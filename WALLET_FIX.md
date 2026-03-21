# Wallet Adapter Fix

## Issue
The build warning shows:
```
Attempted import error: 'BackpackWalletAdapter' is not exported from '@solana/wallet-adapter-wallets'
```

This is because Backpack wallet might not be available in the current version of the wallet adapter package.

## Quick Fix Options

### Option 1: Remove Backpack (Easiest)
Edit `src/components/wallet/WalletProvider.tsx`:

```typescript
// REMOVE BackpackWalletAdapter from imports
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

// REMOVE from wallets array
const wallets = useMemo(
  () => [
    new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    // new BackpackWalletAdapter(), // <-- Remove or comment out
  ],
  []
);
```

### Option 2: Use Dynamic Import (Better)
```typescript
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

const wallets = useMemo(
  () => [
    new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
  ],
  []
);

// Optionally add Backpack if available
try {
  const { BackpackWalletAdapter } = await import('@solana/wallet-adapter-wallets');
  wallets.push(new BackpackWalletAdapter());
} catch (e) {
  // Backpack not available in this version
  console.log('Backpack wallet adapter not available');
}
```

### Option 3: Update Package Version
Check if a newer version supports Backpack:
```bash
npm update @solana/wallet-adapter-wallets
```

Or install specific version:
```bash
npm install @solana/wallet-adapter-wallets@latest
```

## Recommended Action

For now, **Option 1** (remove Backpack) is safest. The build will complete successfully with just Phantom and Solflare, which cover 95%+ of users.

The warning won't break your build - it's just a warning. You can fix it in the next update.
