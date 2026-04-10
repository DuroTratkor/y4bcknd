# File Upload & Summarizer Web App

A Next.js web application that allows you to upload files to Supabase storage and get AI-powered summaries using Google's Gemini AI.

## Features

- **Upload Page**: Upload files to Supabase storage
- **User Page**: View all uploaded files and get AI summaries

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

#### Step 2.1: Create Supabase Account and Project

1. Go to [Supabase](https://supabase.com) and sign up for a free account (or sign in if you already have one)
2. Click **"New Project"** button
3. Fill in your project details:
   - **Name**: Choose any name (e.g., "file-upload-app")
   - **Database Password**: Create a strong password (save this somewhere safe)
   - **Region**: Choose the closest region to you
4. Click **"Create new project"** and wait for it to initialize (takes 1-2 minutes)

#### Step 2.2: Create Storage Bucket

1. In your Supabase project dashboard, click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"** button
3. Configure the bucket:
   - **Name**: `files` (must be exactly "files")
   - **Public bucket**: Toggle this ON (or OFF if you want private files)
4. Click **"Create bucket"**

#### Step 2.3: Set Up Database Table

1. In Supabase, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the contents of `supabase-setup.sql` file (or the SQL below) into the editor:

```sql
CREATE TABLE IF NOT EXISTS file_metadata (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_metadata_uploaded_at ON file_metadata(uploaded_at);
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter) to execute the SQL
5. You should see a success message

#### Step 2.4: Get Your API Credentials

1. In Supabase, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. You'll see two important values:
   - **Project URL**: Copy this (looks like `https://xxxxx.supabase.co`)
   - **anon public** key: Copy this (long string starting with `eyJ...`)
4. Save these for the next step

### 3. Set Up Gemini AI

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey) (or [aistudio.google.com](https://aistudio.google.com))
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"** button
4. If prompted, create a new Google Cloud project (or select an existing one)
5. Copy your API key (it will look like a long string)
6. **Important**: Save this key immediately - you won't be able to see it again!

### 4. Configure Environment Variables

1. Create a new file called `.env.local` in the root directory of your project

2. Open `.env.local` in a text editor and add the following (replace with your actual values):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Replace the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Paste your Supabase Project URL from Step 2.4
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Paste your Supabase anon key from Step 2.4
   - `GEMINI_API_KEY`: Paste your Gemini API key from Step 3

4. Save the file

**Note**: The `.env.local` file is already in `.gitignore`, so your secrets won't be committed to git.

### 5. Install Dependencies and Run

1. Open a terminal in your project directory

2. Install all required packages:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to [http://localhost:3000](http://localhost:3000)

You should see the home page with links to "Upload Files" and "View & Summarize Files"!

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Files**: 
   - Navigate to the Upload page
   - Select a file and click "Upload File"
   - Files are stored in Supabase storage

2. **View & Summarize Files**:
   - Navigate to the User page
   - See all uploaded files
   - Click "Summarize" on any file to get an AI-generated summary

## File Types Supported

The app can handle various file types:
- Text files (.txt, .md, .json, etc.)
- Code files (.js, .ts, .py, etc.)
- Images (basic support)
- Other file types (will attempt to read as text)

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Supabase** - File storage and database
- **Google Gemini AI** - AI summarization
- **Tailwind CSS** - Styling

## Troubleshooting

### Upload Fails
- **Error: "Missing Supabase environment variables"**: Make sure your `.env.local` file exists and has all three variables set
- **Error: "Bucket not found"**: Verify the bucket is named exactly `files` in Supabase Storage
- **Error: "new row violates row-level security policy"**: Go to Supabase → Authentication → Policies → `file_metadata` table and either disable RLS or create a permissive policy

### Files Not Showing
- **Empty list**: Make sure you've run the SQL script to create the `file_metadata` table
- **Error fetching files**: Check your Supabase URL and anon key in `.env.local`

### Summary Fails
- **Error: "Missing Gemini API key"**: Verify `GEMINI_API_KEY` is set in `.env.local`
- **Error: "Failed to generate summary"**: 
  - Check your Gemini API key is valid
  - Verify you have API quota remaining (free tier has limits)
  - Check the browser console for detailed error messages

### General Issues
- **"Module not found" errors**: Run `npm install` again
- **Port 3000 already in use**: Stop other Next.js servers or change the port: `npm run dev -- -p 3001`

# y4
