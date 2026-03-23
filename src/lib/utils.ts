import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Accepts raw lamport number (from BN.toNumber()) or a plain number
export function lamportsToSol(lamports: number): number {
  return lamports / 1_000_000_000;
}

export function formatSol(lamports: number, decimals = 3): string {
  return lamportsToSol(lamports).toFixed(decimals) + " SOL";
}

// Litter has 6 decimals
export function formatLitter(amount: number, decimals = 2): string {
  return (amount / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }) + " $LITTER";
}

// Format raw token units (6 decimals for USDC-like tokens)
export function formatTokens(amount: number, decimals = 2): string {
  if (!amount || amount === 0) return "0";
  // For 6-decimal tokens, show as whole number if large, otherwise with decimals
  const displayAmount = amount / 1_000_000;
  return displayAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

// cycleProgress accepts raw token units and threshold in same units
export function cycleProgress(amount: number, threshold: number): number {
  if (!amount || !threshold || threshold === 0) return 0;
  return Math.min((amount / threshold) * 100, 100);
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
