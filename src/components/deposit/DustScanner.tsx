"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletTokens } from "@/hooks/useWalletTokens";
import { useLitterboxProgram } from "@/hooks/useLitterboxProgram";
import { useProgramState } from "@/hooks/useProgramState";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { filterDustTokens, totalSelectedValue } from "@/lib/jupiter";
import {
  getConfigPda,
  getCyclePda,
  getContributorPda,
  getTokenVaultPda,
  getFeeVaultPda,
  getFeeVaultAuthorityPda,
} from "@/lib/pda";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { formatUsd } from "@/lib/utils";
import { TokenAccount } from "@/types";
import { Scan, CheckSquare, Square, Trash2 } from "lucide-react";

export function DustScanner() {
  const { publicKey } = useWallet();
  const { tokens, setTokens, loading, refetch } = useWalletTokens();
  const program  = useLitterboxProgram();
  const { config, currentCycle, refetch: refetchState } = useProgramState();

  const [depositing, setDepositing] = useState(false);
  const [txSig,      setTxSig]      = useState<string | null>(null);
  const [error,      setError]      = useState<string | null>(null);

  const dustTokens    = filterDustTokens(tokens);
  const selectedTokens = dustTokens.filter((t) => t.selected);

  function toggleToken(mint: string) {
    setTokens((prev) =>
      prev.map((t) => (t.mint === mint ? { ...t, selected: !t.selected } : t))
    );
  }

  function selectAll() {
    setTokens((prev) =>
      prev.map((t) =>
        dustTokens.find((d) => d.mint === t.mint) ? { ...t, selected: true } : t
      )
    );
  }

  async function handleDeposit() {
    if (!program || !publicKey || !config || selectedTokens.length === 0) return;
    setDepositing(true);
    setError(null);
    setTxSig(null);

    try {
      const [configPda]          = getConfigPda();
      const cycleId               = config.currentCycle.toNumber();
      const [cyclePda]            = getCyclePda(cycleId);
      const [contributorPda]      = getContributorPda(publicKey);
      const [feeVaultAuthority]   = getFeeVaultAuthorityPda();

      for (const token of selectedTokens) {
        const mint      = new PublicKey(token.mint);
        const amount    = new BN(Math.floor(token.balance * Math.pow(10, token.decimals)));
        const [vault]   = getTokenVaultPda(mint);
        const [feeVault]= getFeeVaultPda(mint);
        const userAta   = await getAssociatedTokenAddress(mint, publicKey);

        // Anchor 0.32: account names match IDL snake_case exactly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sig = await (program.methods as any)
          .deposit(amount)
          .accounts({
            config:                 configPda,
            currentCycle:           cyclePda,
            contributor:            contributorPda,
            depositTokenMint:       mint,
            userTokenAccount:       userAta,
            tokenVault:             vault,
            feeVaultTokenAccount:   feeVault,
            feeVaultAuthority:      feeVaultAuthority,
            authority:              publicKey,
            tokenProgram:           TOKEN_PROGRAM_ID,
            associatedTokenProgram: new PublicKey(ASSOCIATED_TOKEN_PROGRAM_ID.toString()),
            systemProgram:          SystemProgram.programId,
          })
          .rpc();

        setTxSig(sig);
      }

      await refetch();
      await refetchState();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setDepositing(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--text-muted)] text-sm font-mono">
            <Scan className="w-4 h-4 animate-pulse text-[var(--gold)]" />
            Scanning wallet for dust tokens...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!publicKey) return null;

  if (dustTokens.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-2">
          <p className="text-2xl">✨</p>
          <p className="text-[var(--text-secondary)] text-sm">No dust tokens found.</p>
          <p className="text-[var(--text-muted)] text-xs font-mono">
            Tokens worth less than $1.00 appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">
            {dustTokens.length} dust token{dustTokens.length !== 1 ? "s" : ""} found
          </span>
          <Badge variant="sheesh">{formatUsd(totalSelectedValue(dustTokens))} total</Badge>
        </div>
        <Button variant="ghost" size="sm" onClick={selectAll}>Select all</Button>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-[var(--border-subtle)]">
          <AnimatePresence>
            {dustTokens.map((token, i) => (
              <TokenRow
                key={token.mint}
                token={token}
                index={i}
                onToggle={() => toggleToken(token.mint)}
              />
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      {selectedTokens.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 p-4 rounded-xl border border-[var(--border-default)] bg-[rgba(226,168,39,0.04)]"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">
              {selectedTokens.length} token{selectedTokens.length !== 1 ? "s" : ""} selected
            </span>
            <span className="font-mono text-[var(--gold)]">
              {formatUsd(totalSelectedValue(selectedTokens))}
            </span>
          </div>
          <Button onClick={handleDeposit} loading={depositing} className="w-full">
            <Trash2 className="w-4 h-4" />
            Sweep dust into cycle #{currentCycle?.cycleId.toNumber() ?? "—"}
          </Button>
          {error  && <p className="text-xs text-red-400 font-mono">{error}</p>}
          {txSig  && <p className="text-xs text-green-400 font-mono break-all">✔ {txSig.slice(0, 44)}...</p>}
        </motion.div>
      )}
    </div>
  );
}

function TokenRow({ token, index, onToggle }: { token: TokenAccount; index: number; onToggle: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onToggle}
      className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
    >
      <div className="text-[var(--text-muted)]">
        {token.selected
          ? <CheckSquare className="w-4 h-4 text-[var(--gold)]" />
          : <Square className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-[var(--text-primary)]">{token.symbol}</span>
          <span className="text-xs text-[var(--text-muted)] truncate">{token.name}</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">
          {token.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} tokens
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono text-[var(--text-secondary)]">{formatUsd(token.usdValue)}</p>
        <Badge variant="muted" className="text-[10px] mt-0.5">dust</Badge>
      </div>
    </motion.button>
  );
}
