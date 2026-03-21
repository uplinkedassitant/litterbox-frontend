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
        <div className="flex justify-between text-xs text-[var(--text-muted)] font-mono mb-2">
          <span>{label}</span>
          <span className="text-[var(--sheesh)]">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: clamped >= 100
              ? "var(--sheesh-light)"
              : "linear-gradient(90deg, var(--sheesh-dim), var(--sheesh))",
          }}
        />
      </div>
    </div>
  );
}
