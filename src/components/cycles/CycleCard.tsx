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
        {/* Claw scratch divider */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-litter-yellow to-transparent opacity-50" />
        
        <CardContent className="pt-5 space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3.5 h-3.5 text-litter-yellow" />
                <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                  Active Cycle
                </span>
              </div>
              <p className="font-heading text-3xl text-litter-yellow">#{cycleId}</p>
            </div>
            <Badge variant={isReady ? "green" : "sheesh"}>
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
          <div className="flex items-center gap-1.5 pt-1 text-xs text-white/50 font-mono">
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
    <div className="space-y-0.5 text-center sm:text-left">
      <p className="text-[10px] uppercase tracking-widest text-white/50 font-mono">{label}</p>
      <p className="text-base text-white font-mono">{value}</p>
    </div>
  );
}
