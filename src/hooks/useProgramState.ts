"use client";
import { useState, useEffect, useCallback } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { getLitterboxProgram, getReadonlyProvider } from "@/lib/program";
import { getConfigPda, getCyclePda } from "@/lib/pda";

export interface ConfigState {
  authority:          { toBase58(): string };
  feeVault:           { toBase58(): string };
  platformTokenMint:  { toBase58(): string };
  treasuryBump:       number;
  launchThreshold:    { toNumber(): number };
  buybackThreshold:   { toNumber(): number };
  platformFeeBps:     number;
  totalSupply:        { toNumber(): number };
  launched:           boolean;
  currentCycle:       { toNumber(): number };
}

export interface CycleState {
  cycleId:              { toNumber(): number };
  totalSolContributed:  { toNumber(): number };
  totalLitterOwed:      { toNumber(): number };
  startTimestamp:       { toNumber(): number };
}

export function useProgramState() {
  const { connection } = useConnection();
  const [config,       setConfig]       = useState<ConfigState | null>(null);
  const [currentCycle, setCurrentCycle] = useState<CycleState  | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  const fetchState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const provider = getReadonlyProvider(connection);
      const program  = getLitterboxProgram(provider);

      const [configPda] = getConfigPda();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cfg = await (program.account as any).config.fetch(configPda) as ConfigState;
      setConfig(cfg);

      const cycleId = cfg.currentCycle.toNumber();
      const [cyclePda] = getCyclePda(cycleId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cyc = await (program.account as any).cycle.fetch(cyclePda) as CycleState;
      setCurrentCycle(cyc);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch program state");
    } finally {
      setLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    fetchState();
    const id = setInterval(fetchState, 15_000);
    return () => clearInterval(id);
  }, [fetchState]);

  return { config, currentCycle, loading, error, refetch: fetchState };
}
