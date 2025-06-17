-- Tabel Members
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar TEXT NOT NULL,
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  skills TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}'
);

-- Tabel Photos
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  photographer TEXT NOT NULL
);

-- Atur Row Level Security (RLS)
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Buat Policy untuk akses publik read-only
CREATE POLICY "Allow public read access" 
  ON public.members FOR SELECT USING (true);
  
CREATE POLICY "Allow public read access" 
  ON public.photos FOR SELECT USING (true);

-- Buat Policy untuk akses insert/update/delete dengan auth
CREATE POLICY "Allow authenticated users to modify"
  ON public.members FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Allow authenticated users to modify"
  ON public.photos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
