-- Saved searches: group leads per search, track daily search count separately
-- from the number of leads returned, and support saving searches.

-- Searches table: one row per unique (user, industry, location) combination.
-- Repeat searches with the same parameters append to the same row.
CREATE TABLE public.searches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  -- lower(trimmed industry) || '|' || lower(trimmed location), used for dedup
  normalized_key TEXT NOT NULL,
  is_saved BOOLEAN NOT NULL DEFAULT FALSE,
  last_searched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, normalized_key)
);

CREATE INDEX idx_searches_user_id ON public.searches(user_id);
CREATE INDEX idx_searches_user_saved ON public.searches(user_id, is_saved);

-- Link leads to the search that produced them
ALTER TABLE public.leads
  ADD COLUMN search_id UUID REFERENCES public.searches(id) ON DELETE SET NULL;

CREATE INDEX idx_leads_search_id ON public.leads(search_id);

-- Track number of searches per day (leads_allocated keeps counting leads)
ALTER TABLE public.usage_limits
  ADD COLUMN searches_used INTEGER NOT NULL DEFAULT 0;

-- RLS
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own searches" ON public.searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON public.searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own searches" ON public.searches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own searches" ON public.searches
  FOR DELETE USING (auth.uid() = user_id);

-- keep updated_at fresh (create the helper if this database doesn't have it yet)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_searches_updated_at
  BEFORE UPDATE ON public.searches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
