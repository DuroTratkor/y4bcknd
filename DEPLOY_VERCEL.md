# 🚀 Deploy to Vercel - Step by Step Guide

Your code is already on GitHub at: `https://github.com/DuroTratkor/y4bcknd.git`

## Step 1: Sign up for Vercel (2 minutes)

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your Project (1 minute)

1. After signing in, you'll see the Vercel dashboard
2. Click **"Add New..."** → **"Project"**
3. You should see your repository: **`y4bcknd`**
4. Click **"Import"** next to it

## Step 3: Configure Project (1 minute)

Vercel will auto-detect Next.js! You should see:
- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅

**Don't change anything** - just click **"Deploy"** at the bottom!

## Step 4: Wait for First Deployment (2 minutes)

- Vercel will build your app
- You'll see a progress log
- This first deployment will **fail** (because we haven't added environment variables yet)
- That's OK! We'll fix it in the next step

## Step 5: Add Environment Variables (3 minutes)

1. After the deployment finishes, go to your project dashboard
2. Click **"Settings"** (top menu)
3. Click **"Environment Variables"** (left sidebar)
4. Add these **three** variables one by one:

### Variable 1:
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: (paste your Supabase URL from `.env.local`)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

### Variable 2:
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: (paste your Supabase anon key from `.env.local`)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

### Variable 3:
- **Name**: `GEMINI_API_KEY`
- **Value**: (paste your Gemini API key from `.env.local`)
- **Environment**: Select all (Production, Preview, Development)
- Click **"Save"**

## Step 6: Redeploy (1 minute)

1. Go to **"Deployments"** tab (top menu)
2. Click the **"..."** (three dots) on the latest deployment
3. Click **"Redeploy"**
4. Confirm by clicking **"Redeploy"** again
5. Wait for it to finish (about 2 minutes)

## Step 7: Test Your App! 🎉

1. Once deployment is complete, click the deployment
2. You'll see a URL like: `https://y4bcknd-xxxxx.vercel.app`
3. Click **"Visit"** or copy the URL
4. Your app should be live! 🚀

## ✅ What You Get

- **Free HTTPS** (automatic)
- **Custom domain** (you can add your own domain later)
- **Automatic deployments** (every time you push to GitHub)
- **Preview deployments** (for pull requests)
- **Analytics** (optional, in dashboard)

## 🔄 Future Updates

Every time you push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will **automatically** deploy your changes! No manual steps needed.

## 🆘 Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Make sure all environment variables are set
- Verify your code doesn't have syntax errors

### App Works But API Fails
- Double-check `GEMINI_API_KEY` is set correctly
- Make sure it's set for **all environments** (Production, Preview, Development)

### Can't Find Your Repo
- Make sure you authorized Vercel to access your GitHub
- Check that the repo is public (or you've granted access if private)

## 📝 Next Steps (Optional)

1. **Add a custom domain**: Settings → Domains
2. **Set up preview deployments**: Already done automatically!
3. **Monitor usage**: Dashboard shows analytics

---

**Need help?** Check Vercel docs: https://vercel.com/docs




