-- Create portfolio_positions table
CREATE TABLE public.portfolio_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  shares NUMERIC NOT NULL DEFAULT 0,
  position_value NUMERIC NOT NULL DEFAULT 0,
  portfolio_weight NUMERIC NOT NULL DEFAULT 0,
  sector TEXT NOT NULL DEFAULT 'Other',
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_items table
CREATE TABLE public.news_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  summary TEXT NOT NULL,
  summary_de TEXT,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  source TEXT NOT NULL,
  source_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ticker TEXT,
  category TEXT NOT NULL CHECK (category IN ('global', 'portfolio', 'recent', 'ai-priority')),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create news_ratings table
CREATE TABLE public.news_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_item_id UUID NOT NULL REFERENCES public.news_items(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(news_item_id)
);

-- Enable RLS
ALTER TABLE public.portfolio_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_ratings ENABLE ROW LEVEL SECURITY;

-- Public read/write for now (single user, no auth yet)
CREATE POLICY "Allow all access to portfolio_positions" ON public.portfolio_positions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to news_items" ON public.news_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to news_ratings" ON public.news_ratings FOR ALL USING (true) WITH CHECK (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_portfolio_positions_updated_at
  BEFORE UPDATE ON public.portfolio_positions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_portfolio_positions_ticker ON public.portfolio_positions(ticker);
CREATE INDEX idx_news_items_category ON public.news_items(category);
CREATE INDEX idx_news_items_ticker ON public.news_items(ticker);
CREATE INDEX idx_news_ratings_news_item_id ON public.news_ratings(news_item_id);