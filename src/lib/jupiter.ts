import axios from "axios";
import { JUPITER_PRICE_API, DUST_THRESHOLD_USD } from "./constants";
import { TokenAccount } from "@/types";

interface JupiterPriceData {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
}

interface JupiterPriceResponse {
  data: Record<string, JupiterPriceData>;
}

export async function fetchTokenPrices(mints: string[]): Promise<Record<string, number>> {
  if (mints.length === 0) return {};
  try {
    const ids = mints.join(",");
    const res = await axios.get<JupiterPriceResponse>(`${JUPITER_PRICE_API}?ids=${ids}`);
    const prices: Record<string, number> = {};
    for (const [mint, data] of Object.entries(res.data.data)) {
      prices[mint] = data.price;
    }
    return prices;
  } catch {
    // Price API unavailable — return empty so the scanner still shows tokens
    return {};
  }
}

export function filterDustTokens(tokens: TokenAccount[]): TokenAccount[] {
  return tokens.filter((t) => t.usdValue < DUST_THRESHOLD_USD && t.balance > 0);
}

export function totalSelectedValue(tokens: TokenAccount[]): number {
  return tokens.filter((t) => t.selected).reduce((sum, t) => sum + t.usdValue, 0);
}
