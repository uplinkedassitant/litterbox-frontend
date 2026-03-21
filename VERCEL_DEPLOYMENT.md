# Vercel Deployment Guide - LitterBox Frontend

## Quick Deploy

```bash
# 1. Install dependencies
yarn install

# 2. Copy environment file
cp .env.example .env.local

# 3. Edit .env.local with your values
# - Get Helius RPC key from https://helius.dev
# - Update PROGRAM_ID if deploying to mainnet

# 4. Test locally
yarn dev

# 5. Commit to git
git init
git add .
git commit -m "Initial commit - LitterBox frontend"

# 6. Push to GitHub
git remote add origin https://github.com/uplinkedassitant/litterbox-frontend.git
git push -u origin main

# 7. Deploy to Vercel
# Option A: Vercel CLI
vercel

# Option B: Vercel Dashboard
# - Go to https://vercel.com/new
# - Import from GitHub: uplinkedassitant/litterbox-frontend
# - Configure environment variables
# - Deploy!
```

---

## Environment Variables (Required)

Set these in **Vercel Dashboard** → Project Settings → Environment Variables:

| Variable | Devnet Value | Mainnet Value | Description |
|----------|-------------|---------------|-------------|
| `NEXT_PUBLIC_RPC_URL` | `https://devnet.helius-rpc.com/?api-key=YOUR_KEY` | `https://api.mainnet-beta.solana.com` | Solana RPC endpoint |
| `NEXT_PUBLIC_PROGRAM_ID` | `GbDxASiScq4SNjq3Nj5iqYNSkCeyuTLTHSE64pxyAQeD` | `<mainnet-program-id>` | LitterBox program ID |
| `NEXT_PUBLIC_NETWORK` | `devnet` | `mainnet-beta` | Solana network |

### How to Add in Vercel:

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** → **Environment Variables**
3. Add each variable for **Production**, **Preview**, and **Development** environments
4. Click **Save**

---

## Deployment Steps

### Step 1: Prepare Repository

```bash
cd /home/jay/.openclaw/workspace/litterbox-frontend-deployment

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo (via CLI or web)
# Then push:
git remote add origin https://github.com/uplinkedassitant/litterbox-frontend.git
git push -u origin main
```

### Step 2: Connect to Vercel

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? litterbox-frontend
# - Directory? ./
# - Want to override settings? N
```

**Option B: Vercel Dashboard**
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select `uplinkedassitant/litterbox-frontend`
4. Click **Import**
5. Configure environment variables
6. Click **Deploy**

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to project → **Settings** → **Environment Variables**
2. Add required variables (see table above)
3. Deploy again to apply changes

### Step 4: Test Deployment

```bash
# Get deployment URL from Vercel
# Example: https://litterbox-frontend.vercel.app

# Test in browser
# - Connect wallet
# - Check program state loads
# - Test deposit flow
# - Test claim flow
```

---

## Preview Deployments

Vercel automatically creates preview deployments for every push to non-main branches:

```bash
# Create feature branch
git checkout -b feature/audit-updates

# Make changes
git add .
git commit -m "feat: implement audit fixes"

# Push
git push origin feature/audit-updates

# Vercel creates preview at:
# https://litterbox-frontend-git-feature-audit-updates.vercel.app
```

---

## Production Deployment

```bash
# When ready for production:
git checkout main
git pull
git merge feature/audit-updates
git push origin main

# Vercel auto-deploys to production
# Production URL: https://litterbox-frontend.vercel.app
```

### Promote Preview to Production

```bash
# If you deployed a preview and want to promote it:
vercel --prod

# Or in dashboard: click "Promote to Production"
```

---

## Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your domain: `litterbox.yourdomain.com`
3. Follow DNS configuration instructions
4. Wait for propagation (5-10 minutes)

---

## Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Check package.json has all dependencies
yarn install
git add package.json yarn.lock
git commit -m "fix: add missing dependencies"
git push
```

**Error**: `Environment variable not defined`
```bash
# Ensure all NEXT_PUBLIC_* variables are set in Vercel
# Check Settings → Environment Variables
```

### Wallet Connection Issues

- Ensure `NEXT_PUBLIC_NETWORK` matches your RPC
- Check browser console for errors
- Verify wallet adapter is configured correctly

### RPC Errors

- Check Helius API key is valid
- Ensure RPC URL is correct
- Check rate limits (Helius free tier: 100 RPS)

---

## Monitoring

### Vercel Analytics

Enable in **Project Settings** → **Analytics**

### Error Tracking

Add Sentry for error tracking:

```bash
yarn add @sentry/nextjs
```

Configure in `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_NETWORK,
});
```

---

## Cost Estimate

**Vercel Free Tier** (sufficient for start):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic SSL
- ✅ Preview deployments
- Cost: **$0/month**

**Vercel Pro** (if needed later):
- $20/month per team member
- More analytics
- Priority support

---

## Next Steps After Deployment

1. ✅ Test all flows (deposit, claim, admin functions)
2. ✅ Monitor error logs in Vercel dashboard
3. ✅ Set up Vercel Analytics (optional)
4. ✅ Add custom domain (optional)
5. ✅ Configure password protection for testing (optional)

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Solana Wallet Adapter**: https://github.com/solana-labs/wallet-adapter

---

**Status**: Ready to deploy  
**Estimated Time**: 10-15 minutes  
**Cost**: Free
