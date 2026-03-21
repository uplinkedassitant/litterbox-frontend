import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import IDL from "./litterbox.json";
import { PROGRAM_ID, DEVNET_RPC } from "./constants";

// Anchor 0.32 — program ID comes from the IDL's `address` field.
// The Program constructor reads it automatically; we export it separately
// so hooks don't need to import the full IDL.
export type LitterboxIDL = typeof IDL;

export function getLitterboxProgram(provider: AnchorProvider) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Program(IDL as any, provider);
}

// Read-only connection (no wallet required)
export function getReadonlyConnection() {
  return new Connection(DEVNET_RPC, "confirmed");
}

// Lightweight read-only provider backed by a throwaway keypair
export function getReadonlyProvider(connection: Connection) {
  const dummy = Keypair.generate();
  const dummyWallet = {
    publicKey: dummy.publicKey,
    signTransaction: async (tx: unknown) => tx,
    signAllTransactions: async (txs: unknown[]) => txs,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new AnchorProvider(connection, dummyWallet as any, { commitment: "confirmed" });
}
