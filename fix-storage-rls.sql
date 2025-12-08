-- FIX FOR STORAGE BUCKET RLS ERROR
-- This fixes the "new row violates row-level security policy" error from Storage
-- Run this in Supabase SQL Editor

-- Step 1: Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('files', 'files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Step 2: Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- Step 3: Create policies to allow public uploads and reads for the 'files' bucket
-- Policy for INSERT (uploads)
CREATE POLICY "Allow public uploads to files bucket"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'files');

-- Policy for SELECT (reads/downloads)
CREATE POLICY "Allow public reads from files bucket"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'files');

-- Policy for UPDATE (if needed)
CREATE POLICY "Allow public updates to files bucket"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'files')
WITH CHECK (bucket_id = 'files');

-- Policy for DELETE (if needed)
CREATE POLICY "Allow public deletes from files bucket"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'files');

