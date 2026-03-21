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

// cycleProgress accepts a raw lamport number and a SOL target
export function cycleProgress(lamports: number, thresholdSol: number): number {
  return Math.min((lamportsToSol(lamports) / thresholdSol) * 100, 100);
}

export function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60)    return `${seconds}s ago`;
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
