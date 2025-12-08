-- Create the file_metadata table for storing file information
CREATE TABLE IF NOT EXISTS file_metadata (
  id BIGSERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on uploaded_at for faster queries
CREATE INDEX IF NOT EXISTS idx_file_metadata_uploaded_at ON file_metadata(uploaded_at);

-- Enable Row Level Security (RLS)
ALTER TABLE file_metadata ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Allow all operations" ON file_metadata;
DROP POLICY IF EXISTS "Allow public inserts" ON file_metadata;
DROP POLICY IF EXISTS "Allow public selects" ON file_metadata;
DROP POLICY IF EXISTS "Allow public updates" ON file_metadata;
DROP POLICY IF EXISTS "Allow public deletes" ON file_metadata;

-- Create policies to allow all operations (for development/testing)
-- For production, you should create more restrictive policies based on user authentication
CREATE POLICY "Allow public inserts" ON file_metadata 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public selects" ON file_metadata 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public updates" ON file_metadata 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public deletes" ON file_metadata 
  FOR DELETE 
  USING (true);

