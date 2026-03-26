"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useLitterboxProgram } from "@/hooks/useLitterboxProgram";
import { useProgramState } from "@/hooks/useProgramState";
import { useWalletTokens } from "@/hooks/useWalletTokens";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getConfigPda, getCyclePda, getContributorPda, getTokenVaultPda, getFeeVaultPda, getFeeVaultAuthorityPda } from "@/lib/pda";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { BN } from "@coral-xyz/anchor";
import Image from "next/image";

interface TokenInfo {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: number;
  uiAmount: number;
  usdValue?: number;
  logoURI?: string;
}

export function TokenTable() {
  const { publicKey } = useWallet();
  const { tokens: walletTokens, loading: tokensLoading, refetch } = useWalletTokens();
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const program = useLitterboxProgram();
  const { config, currentCycle, refetch: refetchState } = useProgramState();

  // Convert walletTokens to TokenInfo format (no $1 filter - show ALL tokens)
  const tokens: TokenInfo[] = walletTokens
    .filter((t) => t.balance > 0)
    .map((t) => ({
      ...t,
      uiAmount: t.balance,
      usdValue: t.usdValue,
      logoURI: t.logoUri,
    }))
    // Sort by USD value descending (whales first)
    .sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0));

  const handleMax = (mint: string, uiAmount: number) => {
    setAmounts((prev) => ({ ...prev, [mint]: uiAmount.toString() }));
  };

  const handleDeposit = async (token: TokenInfo) => {
    if (!publicKey || !program || !config || !currentCycle) {
      setError("Wallet not properly connected. Please disconnect and reconnect.");
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    const inputAmount = amounts[token.mint] || "0";
    const amountNum = parseFloat(inputAmount);
    
    if (!amountNum || amountNum <= 0) {
      setError("Enter a valid amount");
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    if (amountNum > token.uiAmount) {
      setError("Amount exceeds balance");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setProcessing(token.mint);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const amountLamports = new BN(amountNum * 10 ** token.decimals);
      const mint = new PublicKey(token.mint);
      
      const [configPda] = getConfigPda();
      const cycleId = config.currentCycle.toNumber();
      const [cyclePda] = getCyclePda(cycleId);
      const [contributorPda] = getContributorPda(publicKey);
      const [vault] = getTokenVaultPda(mint);
      const [feeVault] = getFeeVaultPda(mint);
      const [feeVaultAuthority] = getFeeVaultAuthorityPda();
      
      const userAta = await getAssociatedTokenAddress(mint, publicKey);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sig = await (program.methods as any)
        .deposit(amountLamports)
        .accounts({
          config: configPda,
          currentCycle: cyclePda,
          contributor: contributorPda,
          depositTokenMint: mint,
          userTokenAccount: userAta,
          tokenVault: vault,
          feeVaultTokenAccount: feeVault,
          feeVaultAuthority: feeVaultAuthority,
          authority: publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
      
      setSuccessMsg(`Successfully contributed ${amountNum} ${token.symbol}!`);
      
      // Reset amount after success
      setAmounts((prev) => ({ ...prev, [token.mint]: "" }));
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(null), 5000);
      
      // Refresh balances
      await refetch();
      await refetchState();
    } catch (err: any) {
      setError(err?.message || "Deposit failed");
    } finally {
      setProcessing(null);
    }
  };

  // Don't render table if wallet isn't truly connected
  if (!publicKey) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-xl text-litter-muted">
            Please connect your wallet first
          </p>
        </CardContent>
      </Card>
    );
  }

  if (tokensLoading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-[var(--text-muted)] text-sm font-mono">
            Loading your tokens...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-xl text-[var(--text-muted)]">
            No SPL tokens found in your wallet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <Card className="border-red-900/30 bg-red-950/10">
          <CardContent className="py-3 flex items-center gap-2">
            <span className="text-xs text-red-400 font-mono">{error}</span>
          </CardContent>
        </Card>
      )}
      
      {/* Success message */}
      {successMsg && (
        <Card className="border-green-900/30 bg-green-950/10">
          <CardContent className="py-3 flex items-center gap-2">
            <span className="text-xs text-green-400 font-mono">{successMsg}</span>
          </CardContent>
        </Card>
      )}
    
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-[var(--border-default)]">
            <th className="px-4 py-3 text-left text-xs font-mono text-[var(--text-muted)]">Token</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-[var(--text-muted)]">Balance</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-[var(--text-muted)]">Value</th>
            <th className="px-4 py-3 text-left text-xs font-mono text-[var(--text-muted)]">Amount to Contribute</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.mint} className="border-b border-[var(--border-subtle)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  {token.logoURI ? (
                    <Image 
                      src={token.logoURI} 
                      alt={token.symbol} 
                      width={32} 
                      height={32} 
                      className="rounded-full" 
                    />
                  ) : (
                    <div className="w-8 h-8 bg-[var(--border-default)] rounded-full" />
                  )}
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{token.symbol}</div>
                    <div className="text-xs text-[var(--text-muted)]">{token.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 font-mono text-[var(--text-secondary)]">
                {token.uiAmount.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </td>
              <td className="px-4 py-4 font-mono text-[var(--text-secondary)]">
                {token.usdValue !== undefined && token.usdValue > 0
                  ? `$${token.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                  : "-"
                }
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={amounts[token.mint] || ""}
                    onChange={(e) =>
                      setAmounts((prev) => ({ ...prev, [token.mint]: e.target.value }))
                    }
                    className="w-32 px-3 py-2 bg-[var(--bg-secondary)] rounded-lg text-[var(--text-primary)] font-mono text-sm border border-[var(--border-default)] focus:border-[var(--gold)] focus:outline-none"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMax(token.mint, token.uiAmount)}
                  >
                    Max
                  </Button>
                </div>
              </td>
              <td className="px-4 py-4">
                <Button
                  onClick={() => handleDeposit(token)}
                  disabled={processing === token.mint}
                  loading={processing === token.mint}
                  className="min-w-[100px]"
                >
                  {processing === token.mint ? "..." : "Deposit"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
