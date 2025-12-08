-- COMPLETE FIX FOR RLS ERROR
-- Copy and paste this ENTIRE script into Supabase SQL Editor and run it

-- Step 1: Make sure the table exists
CREATE TABLE IF NOT EXISTS file_metadata (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_file_metadata_uploaded_at ON file_metadata(uploaded_at);

-- Step 3: DISABLE RLS (simplest solution for development)
ALTER TABLE file_metadata DISABLE ROW LEVEL SECURITY;

-- Step 4: Verify - this should return 'f' (false) meaning RLS is disabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'file_metadata';

-- If you see relrowsecurity = 'f', RLS is disabled and uploads should work!

