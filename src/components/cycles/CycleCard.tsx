"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { formatSol, cycleProgress, timeAgo } from "@/lib/utils";
import { BUYBACK_THRESHOLD_SOL } from "@/lib/constants";
import { CycleState, ConfigState } from "@/hooks/useProgramState";
import { Activity, Clock } from "lucide-react";

interface CycleCardProps {
  cycle:            CycleState;
  config:           ConfigState;
  userContribution?: number; // raw lamports
}

export function CycleCard({ cycle, config, userContribution }: CycleCardProps) {
  const totalSol   = cycle.totalSolContributed.toNumber();
  const progress   = cycleProgress(totalSol, BUYBACK_THRESHOLD_SOL);
  const isReady    = progress >= 100;
  const cycleId    = cycle.cycleId.toNumber();
  const startTs    = cycle.startTimestamp.toNumber();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="elevated" className="overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-40" />
        <CardContent className="pt-5 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-widest">
                  Active Cycle
                </span>
              </div>
              <p className="font-display text-2xl text-[var(--text-primary)]">#{cycleId}</p>
            </div>
            <Badge variant={isReady ? "green" : "gold"}>
              {isReady ? "Ready for buyback" : "Accumulating"}
            </Badge>
          </div>

          {/* Progress */}
          <ProgressBar
            value={progress}
            label={`${formatSol(totalSol)} of ${BUYBACK_THRESHOLD_SOL} SOL`}
          />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <Stat label="Contributed"  value={formatSol(totalSol)} />
            <Stat label="Your share"   value={userContribution != null ? formatSol(userContribution) : "—"} />
            <Stat label="Fee"          value={`${config.platformFeeBps / 100}%`} />
          </div>

          {/* Footer */}
          <div className="flex items-center gap-1.5 pt-1 text-xs text-[var(--text-muted)] font-mono">
            <Clock className="w-3 h-3" />
            <span>Started {timeAgo(startTs)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono">{label}</p>
      <p className="text-sm text-[var(--text-primary)] font-mono">{value}</p>
    </div>
  );
}
