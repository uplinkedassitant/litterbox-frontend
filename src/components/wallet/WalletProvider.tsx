"use client";

import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { DEVNET_RPC } from "@/lib/constants";
import "@solana/wallet-adapter-react-ui/styles.css";

interface WalletProviderProps {
  children: React.ReactNode;
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    ],
    []
  );

  const ConnectionProviderAny = ConnectionProvider as any;
  const SolanaWalletProviderAny = SolanaWalletProvider as any;
  const WalletModalProviderAny = WalletModalProvider as any;

  return (
    <ConnectionProviderAny endpoint={DEVNET_RPC}>
      <SolanaWalletProviderAny wallets={wallets} autoConnect>
        <WalletModalProviderAny>{children}</WalletModalProviderAny>
      </SolanaWalletProviderAny>
    </ConnectionProviderAny>
  );
}
