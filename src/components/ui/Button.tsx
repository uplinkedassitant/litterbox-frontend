import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  className, variant = "primary", size = "md", loading, disabled, children, ...props
}: ButtonProps) {
  return (
    <motion.button
      disabled={disabled || loading}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-bold rounded-lg border-2 border-black transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "primary"   && "bg-litter-yellow text-black hover:shadow-xl hover:shadow-litter-yellow/30",
        variant === "secondary" && "bg-transparent border-litter-yellow text-litter-yellow hover:bg-litter-yellow/10",
        variant === "ghost"     && "bg-transparent text-white hover:text-litter-yellow",
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
    </motion.button>
  );
}
