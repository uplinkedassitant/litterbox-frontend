import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "sheesh" | "green" | "red" | "muted";
}

export function Badge({ className, variant = "muted", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
        variant === "sheesh" && "bg-litter-yellow text-black",
        variant === "green" && "bg-green-600 text-white",
        variant === "red"   && "bg-red-600 text-white",
        variant === "muted" && "bg-white/10 text-white/60 border border-white/20",
        className
      )}
      {...props}
    />
  );
}
