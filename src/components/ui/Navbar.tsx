"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgramState } from "@/hooks/useProgramState";
import { Badge } from "@/components/ui/Badge";
import { AppView } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "dashboard", label: "Overview" },
  { id: "deposit",   label: "Deposit"  },
  { id: "claim",     label: "Claim"    },
  { id: "admin",     label: "Admin"    },
];

export function Navbar({ view, onViewChange }: NavbarProps) {
  const { publicKey }  = useWallet();
  const { config }     = useProgramState();

  const isAuthority =
    config && publicKey &&
    config.authority.toBase58() === publicKey.toBase58();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[rgba(17,16,9,0.85)] backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl">🗑️</span>
          <span className="font-display text-lg text-[var(--text-primary)] tracking-tight">
            LitterBox
          </span>
          <Badge variant="muted" className="text-[10px] hidden sm:inline-flex">devnet</Badge>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS
            .filter((item) => item.id !== "admin" || isAuthority)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-md transition-colors",
                  view === item.id
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                )}
              >
                {view === item.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-md bg-[rgba(226,168,39,0.1)] border border-[var(--border-subtle)]"
                    transition={{ type: "spring", stiffness: 380, damping: 36 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
        </nav>

        <div className="shrink-0">
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
