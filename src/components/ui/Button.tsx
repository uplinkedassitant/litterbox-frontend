import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  className, variant = "primary", size = "md", loading, disabled, children, ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-body font-medium rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "primary"   && "bg-[var(--sheesh)] text-black hover:bg-[var(--sheesh-light)] active:scale-[0.98] shadow-lg shadow-[rgba(255,220,0,0.2)]",
        variant === "secondary" && "bg-transparent border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--sheesh)] hover:bg-[rgba(255,220,0,0.06)]",
        variant === "ghost"     && "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.04)]",
        variant === "danger"    && "bg-transparent border border-red-900/40 text-red-400 hover:border-red-700/60 hover:bg-red-950/20",
        size === "sm" && "text-xs px-3 py-1.5 h-8",
        size === "md" && "text-sm px-4 py-2 h-10",
        size === "lg" && "text-base px-6 py-3 h-12",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  );
}
