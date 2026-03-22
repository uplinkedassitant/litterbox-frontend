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
        <div className="flex justify-between text-xs text-litter-muted font-mono mb-2">
          <span>{label}</span>
          <span className="text-white font-bold">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden border border-litter-muted/20">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: clamped >= 100
              ? "linear-gradient(90deg, #ffffff, #cccccc)"
              : "linear-gradient(90deg, #666666, #888888)",
          }}
        />
      </div>
    </div>
  );
}
