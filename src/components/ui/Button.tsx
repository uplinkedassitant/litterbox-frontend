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
        "inline-flex items-center justify-center gap-2 font-bold rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95",
        variant === "primary"   && "bg-litter-text text-litter-bg hover:shadow-lg",
        variant === "secondary" && "bg-transparent border-2 border-litter-text text-litter-text hover:bg-litter-text/10",
        variant === "ghost"     && "bg-transparent text-litter-brown hover:text-litter-text",
        variant === "danger"   && "bg-red-600 text-white hover:bg-red-500 border-red-900",
        size === "sm" && "text-xs px-3 py-2 h-8",
        size === "md" && "text-sm px-4 py-3 h-10",
        size === "lg" && "text-base px-6 py-4 h-14",
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
