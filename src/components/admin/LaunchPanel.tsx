"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useLitterboxProgram } from "@/hooks/useLitterboxProgram";
import { useProgramState } from "@/hooks/useProgramState";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getConfigPda } from "@/lib/pda";
import { Rocket } from "lucide-react";

export function LaunchPanel() {
  const { publicKey } = useWallet();
  const program = useLitterboxProgram();
  const { config, refetch } = useProgramState();
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);

  const isAuthority = config && publicKey && config.authority.toBase58() === publicKey.toBase58();

  if (!isAuthority) {
    return (
      <Card>
        <CardContent className="py-16 text-center space-y-2">
          <p className="text-[var(--text-secondary)] text-sm">Admin access required.</p>
          <p className="text-[var(--text-muted)] text-xs font-mono">
            Connect the program authority wallet.
          </p>
        </CardContent>
      </Card>
    );
  }

  async function handleLaunch() {
    if (!program || !publicKey || !config) return;
    setLaunching(true);
    setError(null);

    try {
      const [configPda] = getConfigPda();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sig = await (program.methods as any)
        .launch()
        .accounts({
          config: configPda,
          authority: publicKey,
        })
        .rpc();

      setLastTx(sig);
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Launch failed");
    } finally {
      setLaunching(false);
    }
  }

  if (config?.launched) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-green-400" />
            <p className="text-sm text-[var(--text-primary)] font-medium">Program Launched</p>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            ✅ The program is launched and ready for deposits.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-[var(--gold)]" />
          <p className="text-sm text-[var(--text-primary)] font-medium">Launch Program</p>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Launch the program to mint the $LITTER token supply and enable the full cycle.
          This is a one-time action.
        </p>
        <Button onClick={handleLaunch} loading={launching} className="w-full" variant="primary">
          <Rocket className="w-4 h-4" />
          {launching ? "Launching..." : "Launch Program"}
        </Button>
        {(error || lastTx) && (
          <div className="text-xs font-mono">
            {error && <p className="text-red-400">{error}</p>}
            {lastTx && (
              <p className="text-green-400 break-all">
                ✔{" "}
                <a
                  href={`https://explorer.solana.com/tx/${lastTx}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {lastTx.slice(0, 44)}...
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
