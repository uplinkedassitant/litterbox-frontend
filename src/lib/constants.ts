import { PublicKey } from "@solana/web3.js";

// ── Deployed program ──────────────────────────────────────────────────────────
// Updated: 2026-03-23 - Fresh deployment with correct initialization
export const PROGRAM_ID = new PublicKey(
  "3X1zzNCdQUhuQDxqVCpyiGoJNcqYVMxEDW3YQBfoVcMe"
);

// ── RPC ───────────────────────────────────────────────────────────────────────
export const DEVNET_RPC =
  "https://devnet.helius-rpc.com/?api-key=d3bae4a8-b9a7-4ce2-9069-6224be9cd33c";

// ── Jupiter APIs ──────────────────────────────────────────────────────────────
export const JUPITER_PRICE_API = "https://price.jup.ag/v6/price";
export const JUPITER_PROGRAM_ID = new PublicKey(
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
);

// ── PDA seeds (must match on-chain byte-for-byte) ─────────────────────────────
export const SEEDS = {
  CONFIG:              Buffer.from("config"),
  CYCLE:               Buffer.from("cycle"),
  CONTRIBUTOR:         Buffer.from("contributor"),
  RECEIPT:             Buffer.from("receipt"),
  PLATFORM_TOKEN:      Buffer.from("platform_token"),
  VAULT:               Buffer.from("vault"),
  FEE_VAULT:           Buffer.from("fee_vault"),
  FEE_VAULT_AUTHORITY: Buffer.from("fee_vault_authority"),
} as const;

// ── Thresholds ────────────────────────────────────────────────────────────────
export const LAUNCH_THRESHOLD_SOL  = 10;
export const BUYBACK_THRESHOLD_SOL = 5;
export const LAMPORTS_PER_SOL      = 1_000_000_000;

// ── Dust threshold — tokens worth less than this USD are shown in the scanner ─
export const DUST_THRESHOLD_USD = 1.0;

// ── Platform token decimals ───────────────────────────────────────────────────
export const LITTER_DECIMALS  = 6;
export const PLATFORM_FEE_BPS = 100; // 1%
