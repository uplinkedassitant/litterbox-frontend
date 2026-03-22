import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value:     number; // 0–100
  className?: string;
  label?:    string;
}

export function ProgressBar({ value, className, label }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-xs text-white/70 font-mono mb-2">
          <span>{label}</span>
          <span className="text-litter-yellow">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-3 w-full rounded-full bg-black/50 overflow-hidden border border-litter-yellow/20">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: clamped >= 100
              ? "linear-gradient(90deg, #FFD700, #FFFF00)"
              : "linear-gradient(90deg, #B8860B, #FFD700)",
          }}
        />
      </div>
    </div>
  );
}
