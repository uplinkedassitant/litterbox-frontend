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
    <header className="sticky top-0 z-50 w-full bg-litter-bg/95 backdrop-blur-sm border-b-2 border-litter-muted">
      <div className="max-w-4xl mx-auto px-3 md:px-4 h-16 md:h-20 flex items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <img 
            src="/cat-logo.jpg" 
            alt="LitterBox" 
            className="h-10 w-10 md:h-14 md:w-14 object-contain rounded-lg"
          />
          <div>
            <span className="text-lg md:text-2xl font-heading text-white tracking-wide">
              LitterBox
            </span>
            <p className="text-litter-muted text-[10px] md:text-xs font-medium -mt-0.5 md:-mt-1">
              Clean Your Shit
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "relative px-4 py-2 text-sm font-bold transition-all hover:scale-105",
                view === item.id
                  ? "text-white underline underline-offset-4 decoration-2 decoration-litter-muted"
                  : "text-litter-muted hover:text-white"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Wallet - desktop only */}
        <div className="hidden md:block shrink-0">
          <WalletMultiButton />
        </div>

        {/* Mobile: wallet + menu button */}
        <div className="flex md:hidden items-center gap-2">
          <div className="shrink-0">
            <WalletMultiButton />
          </div>
          <button 
            className="p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-litter-card border-t-2 border-litter-muted"
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
                  "w-full text-left px-4 py-3 text-lg font-bold rounded-lg transition-all",
                  view === item.id
                    ? "text-white bg-litter-muted/20"
                    : "text-litter-muted hover:text-white"
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
