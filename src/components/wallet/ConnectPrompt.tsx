"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

export function ConnectPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 py-24"
    >
      <div className="text-center space-y-3">
        <div className="text-5xl mb-4">🗑️</div>
        <h2 className="font-display text-2xl text-[var(--text-primary)]">
          Connect your wallet
        </h2>
        <p className="text-[var(--text-secondary)] text-sm max-w-xs leading-relaxed">
          Connect to scan for dust tokens and start converting them into $LITTER.
        </p>
      </div>
      <WalletMultiButton />
    </motion.div>
  );
}
