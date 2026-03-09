// API contract types — FROZEN 2026-03-09
// Matches API_CONTRACT.md exactly. Do not invent new fields.

// GET /api/health
export interface HealthResponse {
  status: string;
  database: string;
}

// GET /api/portfolio/summary
export interface PortfolioSummary {
  snapshot_date: string;
  total_value_eur: number;
  position_count: number;
  stated_total_eur: number | null;
  diff_eur: number | null;
}

// GET /api/portfolio/value-history
export interface ValueHistorySnapshot {
  snapshot_date: string;
  position_count: number;
  total_value_eur: number;
  stated_total_eur: number | null;
  diff_eur: number | null;
}

export interface ValueHistoryResponse {
  snapshots: ValueHistorySnapshot[];
  first_date: string;
  last_date: string;
  total_snapshots: number;
}

// GET /api/holdings/latest
export interface Holding {
  snapshot_date: string;
  isin: string;
  display_name: string;
  broker_name: string | null;
  custom_name: string | null;
  is_crypto: boolean | null;
  asset_class: string | null;
  sector: string | null;
  country: string | null;
  region: string | null;
  quantity: number | null;
  price_per_unit: number | null;
  price_date: string | null;
  position_value_eur: number;
  portfolio_total_eur: number;
  pct_of_portfolio: number | null;
}

export interface HoldingsResponse {
  snapshot_date: string;
  position_count: number;
  total_value_eur: number;
  holdings: Holding[];
}

// GET /api/performance/twr
export interface TwrResponse {
  twr_pct: number | null;
  start_date: string;
  end_date: string;
  period_days: number;
}

// GET /api/performance/modified-dietz
export interface ModifiedDietzResponse {
  return_pct: number | null;
  start_date: string;
  end_date: string;
  period_days: number;
  begin_value_eur: number;
  end_value_eur: number;
}

// GET /api/performance/annual-summary
export interface AnnualSummaryRow {
  year: number;
  start_date: string;
  end_date: string;
  start_value_eur: number;
  end_value_eur: number;
  new_money_eur: number;
  realized_eur: number;
  interest_eur: number;
  dividends_eur: number;
  twr_pct: number | null;
}

export interface AnnualSummaryResponse {
  rows: AnnualSummaryRow[];
}

// GET /api/performance/position-returns
export interface PositionReturn {
  isin: string | null;
  display_name: string;
  quantity: number | null;
  avg_cost_per_unit: number | null;
  cost_basis_eur: number | null;
  current_value_eur: number;
  unrealized_eur: number | null;
  unrealized_pct: number | null;
}

export interface PositionReturnsResponse {
  snapshot_date: string;
  positions: PositionReturn[];
}

// GET /api/exposure/{dimension}/latest
export interface ExposureRow {
  group_name: string;
  value_eur: number;
  weight_pct: number;
}

export interface ExposureResponse {
  snapshot_date: string;
  dimension: string;
  total_value_eur: number;
  rows: ExposureRow[];
}

// GET /api/risk/drawdown
export interface DrawdownSeriesPoint {
  snapshot_date: string;
  value_eur: number;
  peak_value_eur: number;
  drawdown_pct: number;
}

export interface DrawdownResponse {
  max_drawdown_pct: number;
  peak_date: string;
  trough_date: string;
  duration_days: number;
  series: DrawdownSeriesPoint[];
}

// GET /api/news/daily-digest, /api/news/by-security, /api/news/by-theme
export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;
  published_at: string;
  category: string;
  ticker_symbol: string | null;
  relevance_score: number | null;
}

export interface DailyDigestResponse {
  date: string;
  items: NewsItem[];
  total: number;
  note?: string;
}

export interface SecurityNewsResponse {
  isin: string;
  display_name: string;
  items: NewsItem[];
  total: number;
  note?: string;
}

export interface ThemeNewsResponse {
  theme: string;
  items: NewsItem[];
  total: number;
  note?: string;
}

// Frontend-only settings
export interface AppSettings {
  apiBaseUrl: string;
  useMockData: boolean;
  newsRefreshInterval: number;
  morningDigestTime: string;
}
