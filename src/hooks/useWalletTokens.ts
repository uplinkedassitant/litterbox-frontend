"use client";
import { useState, useEffect, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID, AccountLayout } from "@solana/spl-token";
import { fetchTokenPrices } from "@/lib/jupiter";
import { TokenAccount } from "@/types";

// Minimal token metadata — extend or swap for a full token-list API
const TOKEN_META: Record<string, { symbol: string; name: string; decimals: number }> = {
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": { symbol: "USDC",  name: "USD Coin",    decimals: 6 },
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": { symbol: "USDT",  name: "Tether",       decimals: 6 },
  "So11111111111111111111111111111111111111112":    { symbol: "SOL",   name: "Wrapped SOL",  decimals: 9 },
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": { symbol: "mSOL",  name: "Marinade SOL", decimals: 9 },
  "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs": { symbol: "ETH",   name: "Ether (Wormhole)", decimals: 8 },
};

export function useWalletTokens() {
  const { connection }  = useConnection();
  const { publicKey }   = useWallet();
  const [tokens,   setTokens]   = useState<TokenAccount[]>([]);
  const [loading,  setLoading]  = useState(false);

  const fetchTokens = useCallback(async () => {
    if (!publicKey) { setTokens([]); return; }
    setLoading(true);
    try {
      const accounts = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      const mints: string[] = [];
      const parsed: Array<{ mint: string; balance: number; decimals: number }> = [];

      for (const { account } of accounts.value) {
        const data     = AccountLayout.decode(account.data);
        const mint     = data.mint.toBase58();
        const meta     = TOKEN_META[mint];
        const decimals = meta?.decimals ?? 6;
        const balance  = Number(data.amount) / Math.pow(10, decimals);
        if (balance > 0) {
          parsed.push({ mint, balance, decimals });
          mints.push(mint);
        }
      }

      const prices = await fetchTokenPrices(mints);

      const result: TokenAccount[] = parsed.map(({ mint, balance, decimals }) => {
        const meta  = TOKEN_META[mint];
        const price = prices[mint] ?? 0;
        return {
          mint,
          symbol:   meta?.symbol ?? mint.slice(0, 4) + "...",
          name:     meta?.name   ?? "Unknown Token",
          balance,
          decimals,
          usdValue: balance * price,
          selected: false,
        };
      });

      // Dust first — ascending USD value
      result.sort((a, b) => a.usdValue - b.usdValue);
      setTokens(result);
    } catch (e) {
      console.error("Failed to fetch token accounts:", e);
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  return { tokens, setTokens, loading, refetch: fetchTokens };
}
