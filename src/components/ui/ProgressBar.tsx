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
        <div className="flex justify-between text-xs text-litter-brown font-mono mb-2">
          <span>{label}</span>
          <span className="text-litter-text font-bold">{clamped.toFixed(1)}%</span>
        </div>
      )}
      <div className="h-3 w-full rounded-full bg-litter-dark/50 overflow-hidden border border-litter-brown/20">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            background: clamped >= 100
              ? "linear-gradient(90deg, #1a1a1a, #4a4a4a)"
              : "linear-gradient(90deg, #8B7355, #6B5A45)",
          }}
        />
      </div>
    </div>
  );
}
