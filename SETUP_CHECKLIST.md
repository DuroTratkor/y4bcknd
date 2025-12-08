# Setup Checklist

Follow these steps in order to set up your webapp:

## ✅ Prerequisites
- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn package manager

## ✅ Supabase Setup
- [ ] Created Supabase account at https://supabase.com
- [ ] Created a new project in Supabase
- [ ] Created storage bucket named `files`
- [ ] Ran SQL script to create `file_metadata` table (see `supabase-setup.sql`)
- [ ] Copied Supabase Project URL
- [ ] Copied Supabase anon/public key

## ✅ Gemini AI Setup
- [ ] Created Google account (if needed)
- [ ] Visited https://makersuite.google.com/app/apikey
- [ ] Created API key
- [ ] Copied Gemini API key

## ✅ Project Setup

### Step 1: Create Environment Variables File
- [ ] Created `.env.local` file in project root
  - **What to do**: 
    1. In your project folder (`bckny4 3ver`), create a new file named exactly `.env.local` (note the dot at the beginning)
    2. You can do this in your code editor (VS Code, etc.) or using terminal: `touch .env.local`
  - **Why**: This file stores your secret API keys and credentials. The `.local` extension means it won't be committed to git (it's in `.gitignore`)
  - **Important**: Make sure the file is in the root directory (same level as `package.json`), not inside any subfolder

### Step 2: Add Supabase Configuration
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
  - **What to do**: 
    1. Open `.env.local` in a text editor
    2. Add this line: `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co`
    3. Replace `your-project-id.supabase.co` with your actual Supabase Project URL (from Supabase Setup step)
    4. Example: `NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co`
  - **Why**: This tells your app where your Supabase database and storage are located
  - **Note**: The `NEXT_PUBLIC_` prefix makes this variable accessible in the browser (needed for client-side code)

- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
  - **What to do**: 
    1. In the same `.env.local` file, add a new line: `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`
    2. Replace `your-anon-key-here` with your actual Supabase anon/public key (from Supabase Setup step)
    3. Example: `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long string)
  - **Why**: This is the authentication key that allows your app to connect to Supabase
  - **Security**: This is a "public" key, but it's still important to keep it in `.env.local` and not share it publicly

### Step 3: Add Gemini AI Configuration
- [ ] Added `GEMINI_API_KEY` to `.env.local`
  - **What to do**: 
    1. In the same `.env.local` file, add a new line: `GEMINI_API_KEY=your-gemini-api-key-here`
    2. Replace `your-gemini-api-key-here` with your actual Gemini API key (from Gemini AI Setup step)
    3. Example: `GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`
  - **Why**: This key allows your app to use Google's Gemini AI to generate file summaries
  - **Note**: This key does NOT have `NEXT_PUBLIC_` prefix because it's only used on the server side (in API routes), keeping it more secure

**Your `.env.local` file should now look like this:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

### Step 4: Install Dependencies
- [ ] Ran `npm install` in project directory
  - **What to do**: 
    1. Open a terminal/command prompt
    2. Navigate to your project directory: `cd "/Users/durotraktor/backeny4 2ver/bckny4 3ver"`
    3. Run the command: `npm install`
    4. Wait for it to finish (this may take 1-3 minutes)
  - **Why**: This downloads and installs all the required packages listed in `package.json` (Next.js, React, Supabase client, Gemini AI, etc.)
  - **What you'll see**: A progress bar and lots of package names being installed. When done, you'll see a `node_modules` folder created
  - **If it fails**: Make sure you have Node.js installed (check with `node --version`, should be v18 or higher)

### Step 5: Start Development Server
- [ ] Started dev server with `npm run dev`
  - **What to do**: 
    1. In the same terminal, run: `npm run dev`
    2. Wait for it to start (you'll see "Ready" message)
    3. You should see: `- Local: http://localhost:3000`
  - **Why**: This starts the Next.js development server so you can view and test your app
  - **What happens**: The server watches for file changes and automatically reloads the page when you make edits
  - **Keep it running**: Leave this terminal window open while you're working on the app
  - **To stop**: Press `Ctrl + C` (or `Cmd + C` on Mac) in the terminal

### Step 6: Open in Browser
- [ ] Opened http://localhost:3000 in browser
  - **What to do**: 
    1. Open your web browser (Chrome, Firefox, Safari, etc.)
    2. Type in the address bar: `http://localhost:3000` or just `localhost:3000`
    3. Press Enter
  - **What you should see**: The home page with two buttons: "Upload Files" and "View & Summarize Files"
  - **If you see an error**: 
    - Make sure the dev server is still running in your terminal
    - Check that port 3000 isn't being used by another app
    - Verify all environment variables are set correctly in `.env.local`

## ✅ Testing
- [ ] Uploaded a test file on the Upload page
- [ ] Viewed uploaded files on the User page
- [ ] Generated a summary for a file

## 🎉 Done!
Your webapp should now be fully functional!

