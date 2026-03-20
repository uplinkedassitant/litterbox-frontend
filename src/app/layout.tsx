import type { Metadata } from "next";
import { SolanaWalletProvider } from "@/components/wallet/WalletProvider";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LitterBox — Sweep Your Dust",
  description: "Convert worthless SPL token dust into $LITTER — the platform token for the cleanest wallets on Solana.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🗑️</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
