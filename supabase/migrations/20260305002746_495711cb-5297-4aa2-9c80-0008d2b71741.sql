
ALTER TABLE public.portfolio_positions 
  ADD COLUMN IF NOT EXISTS isin text,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS security_type text DEFAULT 'stock',
  ADD COLUMN IF NOT EXISTS is_top40 boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_per_unit numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS price_date date;

-- Add unique constraint on ticker for upsert
ALTER TABLE public.portfolio_positions 
  ADD CONSTRAINT portfolio_positions_ticker_key UNIQUE (ticker);
