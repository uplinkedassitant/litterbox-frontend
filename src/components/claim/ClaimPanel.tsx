"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLitterboxProgram } from "@/hooks/useLitterboxProgram";
import { useProgramState } from "@/hooks/useProgramState";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getConfigPda,
  getCyclePda,
  getContributorPda,
  getClaimReceiptPda,
  getPlatformMintPda,
} from "@/lib/pda";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { formatLitter, formatSol, timeAgo } from "@/lib/utils";
import { Gift, CheckCircle } from "lucide-react";

interface ClaimableCycle {
  cycleId:             number;
  totalTokensContributed: number;
  totalLitterOwed:     number;
  startTimestamp:      number;
  userContribution:    number;
  estimatedLitter:     number;
  alreadyClaimed:      boolean;
}

export function ClaimPanel() {
  const { publicKey }  = useWallet();
  const program        = useLitterboxProgram();
  const { config, refetch: refetchState } = useProgramState();

  const [cycles,   setCycles]   = useState<ClaimableCycle[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const [txSig,    setTxSig]    = useState<string | null>(null);

  const loadCycles = useCallback(async () => {
    if (!program || !publicKey || !config) return;
    setLoading(true);
    try {
      const currentCycleId = config.currentCycle.toNumber();
      const [contributorPda] = getContributorPda(publicKey);

      let userContribution = 0;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const contributor = await (program.account as any).contributor.fetch(contributorPda);
        userContribution = contributor.totalTokensContributed.toNumber();
      } catch { /* no contributions yet */ }

      const result: ClaimableCycle[] = [];

      for (let i = 1; i < currentCycleId; i++) {
        try {
          const [cyclePda] = getCyclePda(i);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cycle = await (program.account as any).cycle.fetch(cyclePda);
          const totalLitter = cycle.totalLitterOwed.toNumber();
          if (totalLitter === 0) continue;

          const totalTokens = cycle.totalTokensContributed.toNumber();
          const estLitter = totalTokens > 0
            ? Math.floor((userContribution / totalTokens) * totalLitter)
            : 0;

          const [receiptPda] = getClaimReceiptPda(i, publicKey);
          let alreadyClaimed = false;
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (program.account as any).claimReceipt.fetch(receiptPda);
            alreadyClaimed = true;
          } catch { /* not yet claimed */ }

          result.push({
            cycleId:             i,
            totalTokensContributed: totalSol,
            totalLitterOwed:     totalLitter,
            startTimestamp:      cycle.startTimestamp.toNumber(),
            userContribution,
            estimatedLitter:     estLitter,
            alreadyClaimed,
          });
        } catch { /* cycle doesn't exist */ }
      }

      setCycles(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, config]);

  useEffect(() => { loadCycles(); }, [loadCycles]);

  async function handleClaim(cycleId: number) {
    if (!program || !publicKey) return;
    setClaiming(cycleId);
    setError(null);
    setTxSig(null);
    try {
      const [configPda]      = getConfigPda();
      const [cyclePda]       = getCyclePda(cycleId);
      const [contributorPda] = getContributorPda(publicKey);
      const [receiptPda]     = getClaimReceiptPda(cycleId, publicKey);
      const [platformMint]   = getPlatformMintPda();
      const airdropVault     = await getAssociatedTokenAddress(platformMint, configPda, true);
      const userTokenAccount = await getAssociatedTokenAddress(platformMint, publicKey);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sig = await (program.methods as any)
        .claim(new BN(cycleId))
        .accounts({
          config:            configPda,
          cycle:             cyclePda,
          contributor:       contributorPda,
          claimReceipt:      receiptPda,
          airdropVault,
          userTokenAccount,
          platformTokenMint: platformMint,
          authority:         publicKey,
          tokenProgram:      TOKEN_PROGRAM_ID,
          systemProgram:     SystemProgram.programId,
        })
        .rpc();

      setTxSig(sig);
      await loadCycles();
      await refetchState();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Claim failed");
    } finally {
      setClaiming(null);
    }
  }

  if (!publicKey) return null;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-[var(--text-muted)] text-sm font-mono animate-pulse">
            Loading claimable cycles...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (cycles.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-2">
          <Gift className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3" />
          <p className="text-[var(--text-secondary)] text-sm">No claimable cycles yet.</p>
          <p className="text-[var(--text-muted)] text-xs font-mono">
            Deposit tokens and wait for a buyback cycle to complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  const unclaimed = cycles.filter((c) => !c.alreadyClaimed);
  const claimed   = cycles.filter((c) =>  c.alreadyClaimed);

  return (
    <div className="space-y-6">
      {unclaimed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Ready to claim
          </h3>
          <AnimatePresence>
            {unclaimed.map((cycle, i) => (
              <motion.div
                key={cycle.cycleId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card variant="elevated" className="overflow-hidden">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50" />
                  <CardContent className="pt-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mb-1">
                          Cycle #{cycle.cycleId}
                        </p>
                        <p className="font-display text-xl text-[var(--gold-light)]">
                          {formatLitter(cycle.estimatedLitter)}
                        </p>
                      </div>
                      <Badge variant="gold"><Gift className="w-3 h-3" />Claimable</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <p className="text-[var(--text-muted)] mb-0.5">Your contribution</p>
                        <p className="text-[var(--text-secondary)]">{formatSol(cycle.userContribution)}</p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)] mb-0.5">Started</p>
                        <p className="text-[var(--text-secondary)]">{timeAgo(cycle.startTimestamp)}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleClaim(cycle.cycleId)}
                      loading={claiming === cycle.cycleId}
                      className="w-full"
                    >
                      <Gift className="w-4 h-4" />Claim $LITTER
                    </Button>
                    {error && claiming === null && (
                      <p className="text-xs text-red-400 font-mono">{error}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {claimed.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-mono">
            Claim history
          </h3>
          {claimed.map((cycle) => (
            <Card key={cycle.cycleId} className="opacity-60">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-mono text-[var(--text-secondary)]">
                      Cycle #{cycle.cycleId}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      {timeAgo(cycle.startTimestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-[var(--text-secondary)]">
                    {formatLitter(cycle.estimatedLitter)}
                  </p>
                  <Badge variant="green" className="text-[10px]">Claimed</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {txSig && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-green-400 font-mono text-center break-all"
        >
          ✔ {txSig.slice(0, 44)}...
        </motion.p>
      )}
    </div>
  );
}
