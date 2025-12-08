-- QUICK FIX: Disable RLS entirely (for development/testing)
-- Run this in Supabase SQL Editor if you want the simplest solution

ALTER TABLE file_metadata DISABLE ROW LEVEL SECURITY;

