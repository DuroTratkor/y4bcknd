# Deploying to Vercel

## Quick Setup (5 minutes)

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Vercel will auto-detect Next.js - click **"Deploy"**

### Step 3: Add Environment Variables
1. After deployment, go to **Settings** → **Environment Variables**
2. Add these three variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `GEMINI_API_KEY` = your Gemini API key
3. Click **"Redeploy"** to apply changes

### Step 4: Done! 🎉
Your app will be live at `https://your-project.vercel.app`

## Benefits
- ✅ Free tier (generous limits)
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Automatic deployments on git push
- ✅ Serverless functions (API routes work perfectly)
- ✅ Environment variables support
- ✅ Built by Next.js creators

## Alternative: Netlify
If you prefer Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repo
5. Build command: `npm run build`
6. Publish directory: `.next`
7. Add environment variables in **Site settings** → **Environment variables**
8. Deploy!




