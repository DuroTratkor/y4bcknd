-- ALTERNATIVE: Keep RLS enabled but fix the policies
-- Run this in Supabase SQL Editor if you want to keep RLS enabled

-- First, make sure the table exists
CREATE TABLE IF NOT EXISTS file_metadata (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on this table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'file_metadata') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON file_metadata';
    END LOOP;
END $$;

-- Create a single policy that allows all operations for everyone
CREATE POLICY "Enable all operations for all users" ON file_metadata
  FOR ALL
  USING (true)
  WITH CHECK (true);

