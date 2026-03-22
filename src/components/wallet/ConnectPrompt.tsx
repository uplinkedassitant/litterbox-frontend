"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

export function ConnectPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 py-16"
    >
      <div className="text-center space-y-3">
        {/* Large cat logo as hero */}
        <div className="relative mb-6">
          <img 
            src="/cat-logo.jpg" 
            alt="LitterBox" 
            className="w-40 h-40 mx-auto object-contain"
          />
          <div className="absolute inset-0 bg-litter-brown opacity-10 blur-3xl rounded-full" />
        </div>
        
        <h2 className="font-heading text-4xl text-litter-text font-bold">
          Connect Wallet
        </h2>
        <p className="text-litter-brown text-lg max-w-md mx-auto leading-relaxed">
          Sweep Your Dust — or Tell It to Fuck Off 🖕
        </p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4"
      >
        <WalletMultiButton />
      </motion.div>
    </motion.div>
  );
}
