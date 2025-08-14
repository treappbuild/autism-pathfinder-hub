-- Create places cache table for intelligent caching
CREATE TABLE public.places_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  search_type TEXT NOT NULL CHECK (search_type IN ('text_search', 'nearby_search', 'place_details', 'autocomplete')),
  query_params JSONB NOT NULL,
  results JSONB NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('google_places', 'openstreetmap', 'hybrid')),
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  radius_meters INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search analytics table for optimization insights
CREATE TABLE public.search_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query TEXT NOT NULL,
  search_type TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  category TEXT,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  response_time_ms INTEGER,
  result_count INTEGER,
  api_cost_estimate DECIMAL(8, 4),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create API usage tracking table for cost monitoring
CREATE TABLE public.api_usage_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_provider TEXT NOT NULL CHECK (api_provider IN ('google_places', 'openstreetmap')),
  endpoint TEXT NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 1,
  estimated_cost DECIMAL(8, 4),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(api_provider, endpoint, date)
);

-- Enable Row Level Security
ALTER TABLE public.places_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public resource directory)
CREATE POLICY "Places cache is publicly readable"
ON public.places_cache
FOR SELECT
USING (true);

CREATE POLICY "Search analytics are publicly readable"
ON public.search_analytics
FOR SELECT
USING (true);

CREATE POLICY "API usage tracking is publicly readable"
ON public.api_usage_tracking
FOR SELECT
USING (true);

-- Create policies for inserting/updating (for the Edge Functions)
CREATE POLICY "Allow cache updates from Edge Functions"
ON public.places_cache
FOR ALL
USING (true);

CREATE POLICY "Allow analytics inserts from Edge Functions"
ON public.search_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow API usage tracking from Edge Functions"
ON public.api_usage_tracking
FOR ALL
USING (true);

-- Create indexes for performance optimization
CREATE INDEX idx_places_cache_key ON public.places_cache(cache_key);
CREATE INDEX idx_places_cache_expires ON public.places_cache(expires_at);
CREATE INDEX idx_places_cache_location ON public.places_cache(location_lat, location_lng);
CREATE INDEX idx_search_analytics_query ON public.search_analytics(search_query);
CREATE INDEX idx_search_analytics_location ON public.search_analytics(location_lat, location_lng);
CREATE INDEX idx_search_analytics_created ON public.search_analytics(created_at);
CREATE INDEX idx_api_usage_date ON public.api_usage_tracking(date, api_provider);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_places_cache_updated_at
  BEFORE UPDATE ON public.places_cache
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to clean expired cache entries
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.places_cache WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate cache keys
CREATE OR REPLACE FUNCTION public.generate_cache_key(
  search_type TEXT,
  params JSONB
)
RETURNS TEXT AS $$
BEGIN
  RETURN search_type || '_' || encode(digest(params::TEXT, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;