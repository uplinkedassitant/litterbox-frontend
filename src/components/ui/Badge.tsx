import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "green" | "red" | "muted";
}

export function Badge({ className, variant = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium",
        variant === "gold"  && "bg-[rgba(226,168,39,0.15)]  text-[var(--gold-light)] border border-[rgba(226,168,39,0.25)]",
        variant === "green" && "bg-[rgba(34,197,94,0.1)]    text-green-400           border border-[rgba(34,197,94,0.2)]",
        variant === "red"   && "bg-[rgba(239,68,68,0.1)]    text-red-400             border border-[rgba(239,68,68,0.2)]",
        variant === "muted" && "bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.08)]",
        className
      )}
      {...props}
    />
  );
}
