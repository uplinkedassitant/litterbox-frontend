"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgramState } from "@/hooks/useProgramState";
import { Badge } from "@/components/ui/Badge";
import { AppView } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthority =
    config && publicKey &&
    config.authority.toBase58() === publicKey.toBase58();

  const filteredNavItems = NAV_ITEMS.filter(
    (item) => item.id !== "admin" || isAuthority
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[rgba(10,10,10,0.9)] backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo - centered on mobile */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-2xl">🐱</span>
          <span className="font-display text-xl font-bold text-[var(--text-primary)] tracking-tight">
            LitterBox
          </span>
          <Badge variant="muted" className="text-[10px] hidden sm:inline-flex">devnet</Badge>
        </div>

        {/* Desktop Nav - centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-all",
                view === item.id
                  ? "text-[var(--sheesh)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              {view === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-lg bg-[rgba(255,220,0,0.1)] border border-[var(--sheesh-dim)]"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Wallet - right side */}
        <div className="shrink-0">
          <WalletMultiButton />
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-[var(--text-secondary)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]"
        >
          <nav className="flex flex-col p-4 gap-2">
            {filteredNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all",
                  view === item.id
                    ? "text-[var(--sheesh)] bg-[rgba(255,220,0,0.1)]"
                    : "text-[var(--text-muted)]"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
