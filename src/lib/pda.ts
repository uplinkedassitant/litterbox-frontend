import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { PROGRAM_ID, SEEDS } from "./constants";

export function getConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEEDS.CONFIG], PROGRAM_ID);
}

export function getCyclePda(cycleId: number): [PublicKey, number] {
  const idBuf = new BN(cycleId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync([SEEDS.CYCLE, idBuf], PROGRAM_ID);
}

export function getContributorPda(wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.CONTRIBUTOR, wallet.toBuffer()],
    PROGRAM_ID
  );
}

export function getClaimReceiptPda(
  cycleId: number,
  wallet: PublicKey
): [PublicKey, number] {
  const idBuf = new BN(cycleId).toArrayLike(Buffer, "le", 8);
  return PublicKey.findProgramAddressSync(
    [SEEDS.RECEIPT, idBuf, wallet.toBuffer()],
    PROGRAM_ID
  );
}

export function getPlatformMintPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([SEEDS.PLATFORM_TOKEN], PROGRAM_ID);
}

export function getTokenVaultPda(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.VAULT, mint.toBuffer()],
    PROGRAM_ID
  );
}

export function getFeeVaultPda(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.FEE_VAULT, mint.toBuffer()],
    PROGRAM_ID
  );
}

export function getFeeVaultAuthorityPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [SEEDS.FEE_VAULT_AUTHORITY],
    PROGRAM_ID
  );
}
