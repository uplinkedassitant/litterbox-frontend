# 🚀 LitterBox Frontend - Deployment Checklist

## ✅ Repository Created!

**GitHub**: https://github.com/uplinkedassitant/litterbox-frontend  
**Status**: Code pushed and ready for Vercel deployment

---

## Step 1: Configure Vercel (5 minutes)

### Option A: Vercel Dashboard (Easiest)

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select **uplinkedassitant/litterbox-frontend**
4. Click **"Import"**

### Option B: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /home/jay/.openclaw/workspace/litterbox-frontend-deployment
vercel
```

---

## Step 2: Add Environment Variables ⚠️ CRITICAL

**In Vercel Dashboard** → Project Settings → Environment Variables:

| Variable | Value (Devnet) | Value (Mainnet) |
|----------|---------------|-----------------|
| `NEXT_PUBLIC_RPC_URL` | `https://devnet.helius-rpc.com/?api-key=d3bae4a8-b9a7-4ce2-9069-6224be9cd33c` | `https://api.mainnet-beta.solana.com` |
| `NEXT_PUBLIC_PROGRAM_ID` | `GbDxASiScq4SNjq3Nj5iqYNSkCeyuTLTHSE64pxyAQeD` | `<mainnet-program-id>` |
| `NEXT_PUBLIC_NETWORK` | `devnet` | `mainnet-beta` |

**How to Add:**
1. Go to Vercel project
2. Click **Settings** → **Environment Variables**
3. Click **"New Variable"**
4. Add each variable for **Production**, **Preview**, and **Development**
5. Click **Save**

---

## Step 3: Deploy to Vercel

### For Devnet Testing (Current)

```bash
# If using CLI:
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N (first time)
# - Project name? litterbox-frontend
# - Directory? ./
# - Want to override settings? N
```

### For Production (After Audit)

1. Update environment variables in Vercel:
   - Change `NEXT_PUBLIC_RPC_URL` to mainnet
   - Change `NEXT_PUBLIC_PROGRAM_ID` to mainnet deployment
   - Change `NEXT_PUBLIC_NETWORK` to `mainnet-beta`

2. Redeploy:
```bash
vercel --prod
```

---

## Step 4: Verify Deployment

### Test Checklist

- [ ] **Deployment successful** - No build errors
- [ ] **Environment variables loaded** - Check browser console
- [ ] **Wallet connects** - Phantom/Solflare works
- [ ] **Program state loads** - Config PDA fetches correctly
- [ ] **Deposit button visible** - User can deposit
- [ ] **Claim button visible** - User can claim (if eligible)
- [ ] **Admin panel shows** (if admin wallet)
- [ ] **No console errors** - Check browser DevTools

### Test URL

Your deployed app will be at:
```
https://litterbox-frontend.vercel.app
```

Or if custom domain configured:
```
https://litterbox.yourdomain.com
```

---

## Step 5: Post-Deployment Tasks

### Immediate (Required)

- [ ] Test wallet connection
- [ ] Test deposit flow
- [ ] Test claim flow
- [ ] Check error handling
- [ ] Verify RPC calls working

### Recommended

- [ ] Add Vercel Analytics (Project Settings → Analytics)
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain (optional)
- [ ] Enable password protection for testing (optional)

---

## Step 6: Update Workflow

### Making Changes

```bash
# 1. Make changes locally
cd /home/jay/.openclaw/workspace/litterbox-frontend-deployment

# 2. Test locally
yarn install
yarn dev

# 3. Commit and push
git add .
git commit -m "feat: your changes here"
git push origin master

# 4. Vercel auto-deploys!
# Preview: https://litterbox-frontend-git-master.vercel.app
# Production: https://litterbox-frontend.vercel.app
```

### Preview Deployments

Every push to a branch creates a preview:

```bash
git checkout -b feature/audit-updates
# Make changes
git add .
git commit -m "feat: audit updates"
git push origin feature/audit-updates

# Preview at: https://litterbox-frontend-git-feature-audit-updates.vercel.app
```

---

## Troubleshooting

### Build Fails

**Common Issues:**

1. **Missing dependencies**
   ```bash
   yarn install
   git add package.json yarn.lock
   git commit -m "fix: dependencies"
   git push
   ```

2. **TypeScript errors**
   ```bash
   yarn build
   # Fix any TS errors locally first
   ```

3. **Environment variables missing**
   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure all 3 variables are set

### Wallet Issues

- Ensure `NEXT_PUBLIC_NETWORK` matches RPC
- Check browser console for errors
- Verify wallet adapter configuration

### RPC Errors

- Check Helius API key is valid
- Ensure RPC URL is correct
- Monitor rate limits

---

## Cost

**Vercel Free Tier** (what you get):
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month (plenty for start)
- ✅ Automatic SSL certificate
- ✅ Preview deployments
- ✅ Automatic HTTPS
- **Cost: $0/month**

**Vercel Pro** (if you scale):
- $20/month per team member
- More analytics
- Priority support

---

## Quick Commands Reference

```bash
# Local development
yarn install
yarn dev

# Build locally
yarn build

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

---

## Next Steps

1. ✅ **Deploy to Vercel** (follow steps above)
2. ✅ **Test thoroughly** on devnet
3. ⏳ **Implement audit fixes** (when ready)
4. ⏳ **Deploy audit fixes** to mainnet
5. ⏳ **Update Vercel env vars** for mainnet
6. ⏳ **Deploy frontend** with audit updates

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Discord**: https://vercel.com/discord
- **Solana Docs**: https://docs.solana.com

---

**Status**: ✅ Repository ready  
**Next Action**: Deploy to Vercel  
**Estimated Time**: 10-15 minutes

---

*Good luck with deployment! 🚀*
