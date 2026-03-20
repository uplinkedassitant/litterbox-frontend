"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { Navbar } from "@/components/ui/Navbar";
import { ConnectPrompt } from "@/components/wallet/ConnectPrompt";
import { CycleCard } from "@/components/cycles/CycleCard";
import { DustScanner } from "@/components/deposit/DustScanner";
import { ClaimPanel } from "@/components/claim/ClaimPanel";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { useProgramState } from "@/hooks/useProgramState";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AppView } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";
import { PROGRAM_ID } from "@/lib/constants";

const VIEW_LABELS: Record<AppView, { title: string; subtitle: string }> = {
  dashboard: { title: "Overview",      subtitle: "Current cycle status and on-chain state"      },
  deposit:   { title: "Deposit Dust",  subtitle: "Scan your wallet and sweep low-value tokens"  },
  claim:     { title: "Claim $LITTER", subtitle: "Collect your share from completed cycles"      },
  admin:     { title: "Admin",         subtitle: "Authority-only controls"                       },
};

export default function Home() {
  const [view, setView] = useState<AppView>("dashboard");
  const { publicKey }   = useWallet();
  const { config, currentCycle, loading, error } = useProgramState();

  return (
    <div className="min-h-screen">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-[var(--gold)] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[var(--amber)] opacity-[0.04] blur-[100px]" />
      </div>

      <Navbar view={view} onViewChange={setView} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Page header */}
        <motion.div
          key={view + "-header"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl text-[var(--text-primary)] mb-1">
            {VIEW_LABELS[view].title}
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {VIEW_LABELS[view].subtitle}
          </p>
        </motion.div>

        {/* Loading / error banners */}
        {loading && (
          <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm font-mono mb-6">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--gold)]" />
            Fetching on-chain state...
          </div>
        )}
        {error && (
          <Card className="mb-6 border-red-900/30 bg-red-950/10">
            <CardContent className="py-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs text-red-400 font-mono">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* View content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {/* DASHBOARD */}
            {view === "dashboard" && (
              <div className="space-y-6">
                {config && (
                  <div className="grid grid-cols-3 gap-3">
                    <StatCard
                      label="Status"
                      value={config.launched ? "Live" : "Pre-launch"}
                      badge={config.launched ? "green" : "muted"}
                    />
                    <StatCard
                      label="Current Cycle"
                      value={`#${config.currentCycle.toNumber()}`}
                    />
                    <StatCard
                      label="Platform Fee"
                      value={`${config.platformFeeBps / 100}%`}
                    />
                  </div>
                )}

                {config && currentCycle ? (
                  <CycleCard cycle={currentCycle} config={config} />
                ) : !loading && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-[var(--text-muted)] text-sm font-mono">
                        Program not yet initialized on devnet.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {!publicKey && <ConnectPrompt />}
              </div>
            )}

            {/* DEPOSIT */}
            {view === "deposit" && (
              !publicKey ? <ConnectPrompt /> : <DustScanner />
            )}

            {/* CLAIM */}
            {view === "claim" && (
              !publicKey ? <ConnectPrompt /> : <ClaimPanel />
            )}

            {/* ADMIN */}
            {view === "admin" && (
              !publicKey ? <ConnectPrompt /> : <AdminPanel />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[var(--border-subtle)] py-6">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
          <span>LitterBox · Solana Devnet</span>
          <a
            href={`https://explorer.solana.com/address/${PROGRAM_ID.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--text-secondary)] transition-colors"
          >
            {PROGRAM_ID.toBase58().slice(0, 8)}...↗
          </a>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  label, value, badge,
}: {
  label: string;
  value: string;
  badge?: "green" | "gold" | "muted";
}) {
  return (
    <Card className="p-4">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono mb-2">
        {label}
      </p>
      {badge ? (
        <Badge variant={badge}>{value}</Badge>
      ) : (
        <p className="text-lg font-display text-[var(--text-primary)]">{value}</p>
      )}
    </Card>
  );
}
