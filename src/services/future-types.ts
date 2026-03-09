// Types for future API endpoints — graceful skeleton fallback when unavailable

export interface WatchItem {
  title: string;
  type: string;
}

export interface MorningBriefingResponse {
  date: string;
  portfolio_value_eur: number;
  day_change_eur: number;
  day_change_pct: number;
  top_mover_name: string;
  top_mover_pct: number;
  summary_text: string;
  watch_items: WatchItem[];
  market_context: string;
}

export interface MacroIndicator {
  name: string;
  value: number;
  change_1d_pct: number;
}

export interface MacroResponse {
  updated_at: string;
  indicators: MacroIndicator[];
}

export interface AttributionGroup {
  group_name: string;
  gain_eur: number;
  contribution_pct: number;
  weight_pct: number;
  best_holding: string;
  worst_holding: string;
}

export interface AttributionResponse {
  snapshot_date: string;
  dimension: string;
  groups: AttributionGroup[];
}

export interface StrategySignal {
  strategy: string;
  isin: string;
  display_name: string;
  signal: 'buy' | 'sell' | 'watch';
  strength: number;
  reason: string;
}

export interface StrategySignalsResponse {
  generated_at: string;
  signals: StrategySignal[];
}

export interface Scenario {
  name: string;
  portfolio_impact_eur: number;
  portfolio_impact_pct: number;
  most_exposed_holding: string;
}

export interface ScenariosResponse {
  scenarios: Scenario[];
}

export interface WatchlistItem {
  isin: string;
  display_name: string;
  reason: string;
  added_date: string;
  current_price_eur: number | null;
  price_change_7d_pct: number | null;
}

export interface WatchlistResponse {
  items: WatchlistItem[];
}

export interface ResearchNote {
  date: string;
  text: string;
  tags: string[];
}

export interface ResearchNotesResponse {
  isin: string;
  display_name: string;
  notes: ResearchNote[];
}
