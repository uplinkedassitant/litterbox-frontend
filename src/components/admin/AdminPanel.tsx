"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLitterboxProgram } from "@/hooks/useLitterboxProgram";
import { useProgramState } from "@/hooks/useProgramState";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { LaunchPanel } from "./LaunchPanel";
import {
  getConfigPda,
  getCyclePda,
  getPlatformMintPda,
} from "@/lib/pda";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { formatSol, formatLitter, cycleProgress, formatAddress } from "@/lib/utils";
import { BUYBACK_THRESHOLD_SOL, PROGRAM_ID, JUPITER_PROGRAM_ID } from "@/lib/constants";
import { ShieldAlert, Zap, RotateCcw, Terminal, Rocket } from "lucide-react";

export function AdminPanel() {
  const { publicKey }  = useWallet();
  const program        = useLitterboxProgram();
  const [launchLoading, setLaunchLoading] = useState(false);
  const { config, currentCycle, refetch } = useProgramState();

  const [buybackLoading, setBuybackLoading] = useState(false);
  const [recordLoading,  setRecordLoading]  = useState(false);
  const [litterInput,    setLitterInput]    = useState("");
  const [error,          setError]          = useState<string | null>(null);
  const [lastTx,         setLastTx]         = useState<string | null>(null);

  const isAuthority =
    config && publicKey &&
    config.authority.toBase58() === publicKey.toBase58();

  if (!isAuthority) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-2">
          <ShieldAlert className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] text-sm">Admin access required.</p>
          <p className="text-[var(--text-muted)] text-xs font-mono">
            Connect the program authority wallet.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleBuyback() {
    if (!program || !publicKey || !config) return;
    setBuybackLoading(true);
    setError(null);
    try {
      const [configPda]    = getConfigPda();
      const [platformMint] = getPlatformMintPda();
      const cycleId        = config.currentCycle.toNumber();
      const [cyclePda]     = getCyclePda(cycleId);
      const airdropVault   = await getAssociatedTokenAddress(platformMint, configPda, true);

      // IDL account names from litterbox.json
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sig = await (program.methods as any)
        .buyback()
        .accounts({
          config:            configPda,
          currentCycle:      cyclePda,
          platformTokenMint: platformMint,
          jupiterProgram:    JUPITER_PROGRAM_ID,
          airdropVault,
          authority:         publicKey,
          tokenProgram:      TOKEN_PROGRAM_ID,
          systemProgram:     SystemProgram.programId,
        })
        .rpc();

      setLastTx(sig);
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Buyback failed");
    } finally {
      setBuybackLoading(false);
    }
  }

  async function handleRecordBuyback() {
    if (!program || !publicKey || !config || !litterInput) return;
    setRecordLoading(true);
    setError(null);
    try {
      const [configPda] = getConfigPda();
      const cycleId     = config.currentCycle.toNumber();
      const [cyclePda]  = getCyclePda(cycleId);
      // Input is whole $LITTER tokens, convert to 6-decimal lamports
      const litterLamports = new BN(Math.floor(parseFloat(litterInput) * 1_000_000));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sig = await (program.methods as any)
        .recordBuyback(new BN(cycleId), litterLamports)
        .accounts({
          config:        configPda,
          cycle:         cyclePda,
          authority:     publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setLastTx(sig);
      setLitterInput("");
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Record buyback failed");
    } finally {
      setRecordLoading(false);
    }
  }

  const cycleId      = config.currentCycle.toNumber();
  const solContrib   = currentCycle?.totalSolContributed.toNumber() ?? 0;
  const progress     = cycleProgress(solContrib, BUYBACK_THRESHOLD_SOL);
  const thresholdMet = progress >= 100;

  return (
    <div className="space-y-6">
      {/* Authority banner */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(226,168,39,0.06)] border border-[var(--border-subtle)]">
        <ShieldAlert className="w-3.5 h-3.5 text-[var(--gold)]" />
        <span className="text-xs font-mono text-[var(--text-muted)]">
          Authority: {formatAddress(publicKey!.toBase58())}
        </span>
        <Badge variant="sheesh" className="ml-auto">Admin</Badge>
      </div>

      {/* Program state */}
      <Card variant="elevated">
        <CardHeader>
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-mono">
        {!config?.launched && <LaunchPanel />}
            Program state
          </p>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <Stat label="Program ID"    value={formatAddress(PROGRAM_ID.toBase58())} />
            <Stat label="Status"        value={config.launched ? "Live" : "Pre-launch"} />
            <Stat label="Current cycle" value={`#${cycleId}`} />
            <Stat label="Fee"           value={`${config.platformFeeBps / 100}%`} />
            <Stat label="SOL in cycle"  value={formatSol(solContrib)} />
            <Stat label="Total supply"  value={formatLitter(config.totalSupply.toNumber())} />
          </div>
          <ProgressBar
            value={progress}
            label={`Buyback threshold: ${BUYBACK_THRESHOLD_SOL} SOL`}
          />
        </CardContent>
      </Card>

      {/* Buyback trigger */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--gold)]" />
            <p className="text-sm text-[var(--text-primary)] font-medium">Trigger buyback</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Verifies the 5 SOL threshold on-chain. Then perform the Jupiter swap
            off-chain and call Record Buyback with the $LITTER received.
          </p>
          <Button
            onClick={handleBuyback}
            loading={buybackLoading}
            disabled={!thresholdMet}
            className="w-full"
            variant={thresholdMet ? "primary" : "secondary"}
          >
            <Zap className="w-4 h-4" />
            {thresholdMet
              ? "Trigger buyback"
              : `Need ${BUYBACK_THRESHOLD_SOL} SOL (${progress.toFixed(1)}% reached)`}
          </Button>
        </CardContent>
      </Card>

      {/* Record buyback */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[var(--gold)]" />
            <p className="text-sm text-[var(--text-primary)] font-medium">
              Record buyback result
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Enter the $LITTER received from the off-chain Jupiter swap. This
            unlocks claims for all contributors in the current cycle.
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="$LITTER received (whole tokens, e.g. 500000)"
              value={litterInput}
              onChange={(e) => setLitterInput(e.target.value)}
              className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-lg px-3 py-2 text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-strong)]"
            />
            <Button
              onClick={handleRecordBuyback}
              loading={recordLoading}
              disabled={!litterInput}
              variant="secondary"
            >
              Record
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Log */}
      {(error || lastTx) && (
        <Card>
          <CardContent className="py-3 space-y-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Terminal className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">
                Log
              </span>
            </div>
            {error  && <p className="text-xs text-red-400  font-mono">{error}</p>}
            {lastTx && (
              <p className="text-xs text-green-400 font-mono break-all">
                ✔{" "}
                <a
                  href={`https://explorer.solana.com/tx/${lastTx}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  {lastTx.slice(0, 44)}...
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-0.5">
        {label}
      </p>
      <p className="text-[var(--text-secondary)]">{value}</p>
    </div>
  );
}
