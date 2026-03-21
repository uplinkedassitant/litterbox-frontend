export interface TokenAccount {
  mint:      string;
  symbol:    string;
  name:      string;
  balance:   number;
  decimals:  number;
  usdValue:  number;
  logoUri?:  string;
  selected?: boolean;
}

export type AppView = "dashboard" | "deposit" | "claim" | "admin";

// Re-exported from hooks for convenience
export type { ConfigState, CycleState } from "@/hooks/useProgramState";
