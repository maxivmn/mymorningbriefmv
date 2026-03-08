// API contract types matching the backend Python analytics layer

export interface PortfolioSummary {
  portfolio_value_eur: number;
  twr_pct: number;
  modified_dietz_pct: number;
  max_drawdown_pct: number;
  total_unrealized_eur: number;
  total_realized_eur: number;
  dividends_eur: number;
  interest_eur: number;
}

export interface Holding {
  isin: string;
  display_name: string;
  quantity: number;
  current_value: number;
  portfolio_weight_pct: number;
  unrealized_eur: number;
  unrealized_pct: number;
  sector: string;
  country: string;
  primary_theme: string;
  strategy_bucket: string;
  asset_class: string;
}

export interface PortfolioSnapshot {
  snapshot_date: string;
  portfolio_value: number;
  net_deployed: number;
  unrealized: number;
}

export interface AnnualSummaryRow {
  year: number;
  start_date: string;
  end_date: string;
  start_value: number;
  end_value: number;
  new_money_eur: number;
  realized_eur: number;
  interest_eur: number;
  dividends_eur: number;
  twr_pct: number;
}

export interface ExposureRow {
  label: string;
  value_eur: number;
  weight_pct: number;
}

export interface DailyDigest {
  date: string;
  summary: DigestItem[];
}

export interface DigestItem {
  headline: string;
  security: string;
  theme: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  importance: 'high' | 'medium' | 'low';
  why_it_matters: string;
}

export interface NewsItem {
  id: string;
  published_at: string;
  headline: string;
  source: string;
  url: string;
  security: string;
  theme: string;
  sector: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  importance: 'high' | 'medium' | 'low';
  why_it_matters: string;
}

export interface DrawdownPoint {
  date: string;
  drawdown_pct: number;
}

export interface SecurityDetail {
  isin: string;
  display_name: string;
  ticker: string;
  quantity: number;
  current_value: number;
  portfolio_weight_pct: number;
  unrealized_eur: number;
  unrealized_pct: number;
  sector: string;
  country: string;
  primary_theme: string;
  strategy_bucket: string;
  asset_class: string;
  purchase_date: string;
  cost_basis: number;
  notes: string;
}

export interface AppSettings {
  apiBaseUrl: string;
  useMockData: boolean;
  newsRefreshInterval: number; // minutes
  morningDigestTime: string; // HH:mm
}
