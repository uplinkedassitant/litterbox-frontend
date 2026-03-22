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
        {/* Large cat middle finger as hero */}
        <div className="relative mb-6">
          <img 
            src="/cat-middle-finger.jpg" 
            alt="LitterBox" 
            className="w-40 h-40 mx-auto object-contain opacity-80"
          />
          <div className="absolute inset-0 bg-litter-yellow opacity-20 blur-3xl rounded-full" />
        </div>
        
        <h2 className="font-heading text-4xl text-litter-yellow drop-shadow-lg">
          Connect Wallet
        </h2>
        <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
          Sweep Your Dust — or Tell It to Fuck Off 🖕
        </p>
      </div>
      
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4"
      >
        <WalletMultiButton />
      </motion.div>
    </motion.div>
  );
}
