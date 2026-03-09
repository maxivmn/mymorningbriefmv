// Mock data matching the exact API contract shapes
import type {
  PortfolioSummary, ValueHistoryResponse, HoldingsResponse,
  TwrResponse, ModifiedDietzResponse, AnnualSummaryResponse,
  PositionReturnsResponse, ExposureResponse, DrawdownResponse,
  DailyDigestResponse, SecurityNewsResponse, ThemeNewsResponse,
  MoversResponse, PortfolioChangesResponse, ThemeDetailResponse,
  ConcentrationResponse, GrowthAttributionResponse, DriftResponse,
  ContributionResponse,
} from './types';

export const mockPortfolioSummary: PortfolioSummary = {
  snapshot_date: "2026-03-07",
  total_value_eur: 36068.66,
  position_count: 50,
  stated_total_eur: 36068.66,
  diff_eur: 0.0,
};

export const mockValueHistory: ValueHistoryResponse = {
  snapshots: [
    { snapshot_date: "2024-06-30", position_count: 14, total_value_eur: 1643.26, stated_total_eur: 1643.26, diff_eur: 0.0 },
    { snapshot_date: "2024-09-01", position_count: 15, total_value_eur: 1720.50, stated_total_eur: 1720.50, diff_eur: 0.0 },
    { snapshot_date: "2024-12-01", position_count: 16, total_value_eur: 1790.80, stated_total_eur: 1790.80, diff_eur: 0.0 },
    { snapshot_date: "2025-01-01", position_count: 17, total_value_eur: 1852.03, stated_total_eur: 1852.03, diff_eur: 0.0 },
    { snapshot_date: "2025-03-01", position_count: 37, total_value_eur: 4769.91, stated_total_eur: 4769.91, diff_eur: 0.0 },
    { snapshot_date: "2025-05-01", position_count: 40, total_value_eur: 8520.30, stated_total_eur: 8520.30, diff_eur: 0.0 },
    { snapshot_date: "2025-07-01", position_count: 42, total_value_eur: 12450.00, stated_total_eur: 12450.00, diff_eur: 0.0 },
    { snapshot_date: "2025-09-01", position_count: 44, total_value_eur: 17200.50, stated_total_eur: 17200.50, diff_eur: 0.0 },
    { snapshot_date: "2025-10-01", position_count: 45, total_value_eur: 20100.00, stated_total_eur: 20100.00, diff_eur: 0.0 },
    { snapshot_date: "2025-11-01", position_count: 46, total_value_eur: 23800.00, stated_total_eur: 23800.00, diff_eur: 0.0 },
    { snapshot_date: "2025-12-01", position_count: 47, total_value_eur: 26541.51, stated_total_eur: 26541.51, diff_eur: 0.0 },
    { snapshot_date: "2026-01-01", position_count: 48, total_value_eur: 26111.05, stated_total_eur: 26111.05, diff_eur: 0.0 },
    { snapshot_date: "2026-02-01", position_count: 49, total_value_eur: 30500.00, stated_total_eur: 30500.00, diff_eur: 0.0 },
    { snapshot_date: "2026-03-01", position_count: 50, total_value_eur: 34200.00, stated_total_eur: 34200.00, diff_eur: 0.0 },
    { snapshot_date: "2026-03-04", position_count: 50, total_value_eur: 37167.65, stated_total_eur: 37167.65, diff_eur: 0.0 },
    { snapshot_date: "2026-03-05", position_count: 50, total_value_eur: 36068.66, stated_total_eur: 36068.66, diff_eur: 0.0 },
    { snapshot_date: "2026-03-07", position_count: 50, total_value_eur: 36068.66, stated_total_eur: 36068.66, diff_eur: 0.0 },
  ],
  first_date: "2024-06-30",
  last_date: "2026-03-07",
  total_snapshots: 17,
};

export const mockHoldings: HoldingsResponse = {
  snapshot_date: "2026-03-07",
  position_count: 50,
  total_value_eur: 36068.66,
  holdings: [
    { snapshot_date: "2026-03-07", isin: "LU1681045370", display_name: "MSCI EM", broker_name: "AIS-Amundi MSCI Em.Ma.Swap Namens-Anteile C Cap.EUR o.N.", custom_name: "MSCI EM", is_crypto: false, asset_class: "Equity", sector: "Multi-Sector", country: "Multi", region: "Emerging Markets", quantity: 1095.96082, price_per_unit: 6.47, price_date: "2026-03-07", position_value_eur: 7087.36, portfolio_total_eur: 36068.66, pct_of_portfolio: 19.65 },
    { snapshot_date: "2026-03-07", isin: "IE00B4L5Y983", display_name: "MSCI World", broker_name: "iShsIII-Core MSCI World U.ETF", custom_name: "MSCI World", is_crypto: false, asset_class: "Equity", sector: "Multi-Sector", country: "Multi", region: "Global Developed", quantity: 37.034857, price_per_unit: 111.75, price_date: "2026-03-07", position_value_eur: 4138.46, portfolio_total_eur: 36068.66, pct_of_portfolio: 11.47 },
    { snapshot_date: "2026-03-07", isin: "NL0010273215", display_name: "ASML", broker_name: "ASML Holding N.V.", custom_name: "ASML", is_crypto: false, asset_class: "Equity", sector: "Information Technology", country: "Netherlands", region: "Netherlands", quantity: 1.427294, price_per_unit: 1114.20, price_date: "2026-03-07", position_value_eur: 1590.29, portfolio_total_eur: 36068.66, pct_of_portfolio: 4.41 },
    { snapshot_date: "2026-03-07", isin: "US64110L1061", display_name: "Netflix", broker_name: "Netflix Inc.", custom_name: "Netflix", is_crypto: false, asset_class: "Equity", sector: "Communication Services", country: "United States", region: "United States", quantity: 1.2, price_per_unit: 1061.38, price_date: "2026-03-07", position_value_eur: 1273.65, portfolio_total_eur: 36068.66, pct_of_portfolio: 3.53 },
    { snapshot_date: "2026-03-07", isin: "US0079031078", display_name: "AMD", broker_name: "Advanced Micro Devices", custom_name: "AMD", is_crypto: false, asset_class: "Equity", sector: "Information Technology", country: "United States", region: "United States", quantity: 1.244669, price_per_unit: 165.62, price_date: "2026-03-07", position_value_eur: 206.14, portfolio_total_eur: 36068.66, pct_of_portfolio: 0.57 },
    { snapshot_date: "2026-03-07", isin: "DE0007164600", display_name: "SAP", broker_name: "SAP SE", custom_name: "SAP", is_crypto: false, asset_class: "Equity", sector: "Information Technology", country: "Germany", region: "Germany", quantity: 4.5, price_per_unit: 245.80, price_date: "2026-03-07", position_value_eur: 1106.10, portfolio_total_eur: 36068.66, pct_of_portfolio: 3.07 },
    { snapshot_date: "2026-03-07", isin: "US8740391003", display_name: "TSMC", broker_name: "Taiwan Semiconductor Mfg.", custom_name: "TSMC", is_crypto: false, asset_class: "Equity", sector: "Information Technology", country: "Taiwan", region: "Taiwan", quantity: 1.538245, price_per_unit: 290.50, price_date: "2026-03-07", position_value_eur: 446.86, portfolio_total_eur: 36068.66, pct_of_portfolio: 1.24 },
    { snapshot_date: "2026-03-07", isin: "DE0007100000", display_name: "Mercedes", broker_name: "Mercedes-Benz Group AG", custom_name: "Mercedes", is_crypto: false, asset_class: "Equity", sector: "Consumer Discretionary", country: "Germany", region: "Germany", quantity: 2.2294, price_per_unit: 54.75, price_date: "2026-03-07", position_value_eur: 122.04, portfolio_total_eur: 36068.66, pct_of_portfolio: 0.34 },
    { snapshot_date: "2026-03-07", isin: "KR7005930003", display_name: "Samsung", broker_name: "Samsung Electronics", custom_name: "Samsung", is_crypto: false, asset_class: "Equity", sector: "Information Technology", country: "South Korea", region: "South Korea", quantity: 25.0, price_per_unit: 39.60, price_date: "2026-03-07", position_value_eur: 990.00, portfolio_total_eur: 36068.66, pct_of_portfolio: 2.74 },
    { snapshot_date: "2026-03-07", isin: "IE00BKM4GZ66", display_name: "ESG Leaders", broker_name: "iShares ESG Aware MSCI USA ETF", custom_name: "ESG Leaders", is_crypto: false, asset_class: "Equity", sector: "Multi-Sector", country: "Multi", region: "Global Developed", quantity: 10.0, price_per_unit: 114.90, price_date: "2026-03-07", position_value_eur: 1149.00, portfolio_total_eur: 36068.66, pct_of_portfolio: 3.19 },
  ],
};

export const mockTwr: TwrResponse = {
  twr_pct: 20.4665,
  start_date: "2024-06-30",
  end_date: "2026-03-07",
  period_days: 615,
};

export const mockModifiedDietz: ModifiedDietzResponse = {
  return_pct: 30.0684,
  start_date: "2024-06-30",
  end_date: "2026-03-07",
  period_days: 615,
  begin_value_eur: 1643.26,
  end_value_eur: 36068.66,
};

export const mockAnnualSummary: AnnualSummaryResponse = {
  rows: [
    { year: 2024, start_date: "2024-06-30", end_date: "2024-06-30", start_value_eur: 1643.26, end_value_eur: 1643.26, new_money_eur: 0.0, realized_eur: 0.0, interest_eur: 0.0, dividends_eur: 0.0, twr_pct: null },
    { year: 2025, start_date: "2025-01-01", end_date: "2025-12-01", start_value_eur: 1852.03, end_value_eur: 26541.51, new_money_eur: 23565.16, realized_eur: 95.68, interest_eur: 124.65, dividends_eur: 124.91, twr_pct: 15.4662 },
    { year: 2026, start_date: "2026-01-01", end_date: "2026-03-07", start_value_eur: 26111.05, end_value_eur: 36068.66, new_money_eur: 10717.80, realized_eur: 1.44, interest_eur: 59.32, dividends_eur: 20.33, twr_pct: -1.1785 },
  ],
};

export const mockPositionReturns: PositionReturnsResponse = {
  snapshot_date: "2026-03-07",
  positions: [
    { isin: "US8740391003", display_name: "TSMC", quantity: 1.538245, avg_cost_per_unit: 208.02928, cost_basis_eur: 320.0, current_value_eur: 446.86, unrealized_eur: 126.86, unrealized_pct: 39.6437 },
    { isin: "US0079031078", display_name: "AMD", quantity: 1.244669, avg_cost_per_unit: 128.548233, cost_basis_eur: 160.0, current_value_eur: 206.14, unrealized_eur: 46.14, unrealized_pct: 28.8375 },
    { isin: "NL0010273215", display_name: "ASML", quantity: 1.427294, avg_cost_per_unit: 950.0, cost_basis_eur: 1355.68, current_value_eur: 1590.29, unrealized_eur: 234.61, unrealized_pct: 17.3047 },
    { isin: "US64110L1061", display_name: "Netflix", quantity: 1.2, avg_cost_per_unit: 850.0, cost_basis_eur: 1020.0, current_value_eur: 1273.65, unrealized_eur: 253.65, unrealized_pct: 24.8676 },
    { isin: "DE0007164600", display_name: "SAP", quantity: 4.5, avg_cost_per_unit: 210.0, cost_basis_eur: 945.0, current_value_eur: 1106.10, unrealized_eur: 161.10, unrealized_pct: 17.0476 },
    { isin: "DE0007100000", display_name: "Mercedes", quantity: 2.2294, avg_cost_per_unit: null, cost_basis_eur: null, current_value_eur: 122.04, unrealized_eur: null, unrealized_pct: null },
    { isin: "KR7005930003", display_name: "Samsung", quantity: 25.0, avg_cost_per_unit: 42.0, cost_basis_eur: 1050.0, current_value_eur: 990.00, unrealized_eur: -60.0, unrealized_pct: -5.7143 },
  ],
};

export const mockSectorExposure: ExposureResponse = {
  snapshot_date: "2026-03-07",
  dimension: "sector",
  total_value_eur: 36068.66,
  rows: [
    { group_name: "Multi-Sector", value_eur: 19726.38, weight_pct: 54.69 },
    { group_name: "Information Technology", value_eur: 6081.64, weight_pct: 16.86 },
    { group_name: "Communication Services", value_eur: 2926.49, weight_pct: 8.11 },
    { group_name: "Health Care", value_eur: 2807.26, weight_pct: 7.78 },
    { group_name: "Materials", value_eur: 1769.20, weight_pct: 4.91 },
    { group_name: "Consumer Discretionary", value_eur: 931.08, weight_pct: 2.58 },
    { group_name: "Industrials", value_eur: 604.04, weight_pct: 1.67 },
    { group_name: "Consumer Staples", value_eur: 499.80, weight_pct: 1.39 },
    { group_name: "Energy", value_eur: 470.30, weight_pct: 1.30 },
    { group_name: "Financials", value_eur: 152.93, weight_pct: 0.42 },
    { group_name: "Utilities", value_eur: 99.54, weight_pct: 0.28 },
  ],
};

export const mockThemeExposure: ExposureResponse = {
  snapshot_date: "2026-03-07",
  dimension: "theme",
  total_value_eur: 36068.66,
  rows: [
    { group_name: "Emerging Markets Growth", value_eur: 7087.36, weight_pct: 19.65 },
    { group_name: "Diversification", value_eur: 4138.46, weight_pct: 11.47 },
    { group_name: "Germany / DAX", value_eur: 2881.23, weight_pct: 7.99 },
    { group_name: "US Large Cap", value_eur: 2364.30, weight_pct: 6.55 },
    { group_name: "Semiconductor Supply Chain", value_eur: 2243.29, weight_pct: 6.22 },
    { group_name: "AI Infrastructure", value_eur: 1948.20, weight_pct: 5.40 },
    { group_name: "European Diversification", value_eur: 1449.25, weight_pct: 4.02 },
    { group_name: "Streaming Media", value_eur: 1273.65, weight_pct: 3.53 },
    { group_name: "Healthcare Innovation", value_eur: 1270.86, weight_pct: 3.52 },
    { group_name: "ESG / Sustainable Investing", value_eur: 1149.00, weight_pct: 3.19 },
  ],
};

export const mockStrategyExposure: ExposureResponse = {
  snapshot_date: "2026-03-07",
  dimension: "strategy",
  total_value_eur: 36068.66,
  rows: [
    { group_name: "Beta", value_eur: 19416.55, weight_pct: 53.83 },
    { group_name: "Structural Growth", value_eur: 8657.76, weight_pct: 24.00 },
    { group_name: "Defensive Compounder", value_eur: 4787.99, weight_pct: 13.27 },
    { group_name: "Innovation", value_eur: 1604.94, weight_pct: 4.45 },
    { group_name: "Cyclical Value", value_eur: 1131.12, weight_pct: 3.14 },
    { group_name: "Macro / Real Assets", value_eur: 470.30, weight_pct: 1.30 },
  ],
};

export const mockCountryExposure: ExposureResponse = {
  snapshot_date: "2026-03-07",
  dimension: "country",
  total_value_eur: 36068.66,
  rows: [
    { group_name: "Multi", value_eur: 18309.80, weight_pct: 50.76 },
    { group_name: "Germany", value_eur: 5722.52, weight_pct: 15.87 },
    { group_name: "United States", value_eur: 5234.27, weight_pct: 14.51 },
    { group_name: "Netherlands", value_eur: 1590.29, weight_pct: 4.41 },
    { group_name: "South Korea", value_eur: 990.00, weight_pct: 2.74 },
    { group_name: "Belgium", value_eur: 930.60, weight_pct: 2.58 },
    { group_name: "Ireland", value_eur: 730.88, weight_pct: 2.03 },
    { group_name: "Sweden", value_eur: 673.00, weight_pct: 1.87 },
    { group_name: "Canada", value_eur: 623.23, weight_pct: 1.73 },
    { group_name: "United Kingdom", value_eur: 565.20, weight_pct: 1.57 },
    { group_name: "Taiwan", value_eur: 446.86, weight_pct: 1.24 },
    { group_name: "China", value_eur: 252.01, weight_pct: 0.70 },
  ],
};

export const mockDrawdown: DrawdownResponse = {
  max_drawdown_pct: -2.9568,
  peak_date: "2026-03-04",
  trough_date: "2026-03-05",
  duration_days: 1,
  series: [
    { snapshot_date: "2024-06-30", value_eur: 1643.26, peak_value_eur: 1643.26, drawdown_pct: 0.0 },
    { snapshot_date: "2025-01-01", value_eur: 1852.03, peak_value_eur: 1852.03, drawdown_pct: 0.0 },
    { snapshot_date: "2025-03-01", value_eur: 4769.91, peak_value_eur: 4769.91, drawdown_pct: 0.0 },
    { snapshot_date: "2025-07-01", value_eur: 12450.00, peak_value_eur: 12450.00, drawdown_pct: 0.0 },
    { snapshot_date: "2025-12-01", value_eur: 26541.51, peak_value_eur: 26541.51, drawdown_pct: 0.0 },
    { snapshot_date: "2026-01-01", value_eur: 26111.05, peak_value_eur: 26541.51, drawdown_pct: -1.6218 },
    { snapshot_date: "2026-02-01", value_eur: 30500.00, peak_value_eur: 30500.00, drawdown_pct: 0.0 },
    { snapshot_date: "2026-03-01", value_eur: 34200.00, peak_value_eur: 34200.00, drawdown_pct: 0.0 },
    { snapshot_date: "2026-03-04", value_eur: 37167.65, peak_value_eur: 37167.65, drawdown_pct: 0.0 },
    { snapshot_date: "2026-03-05", value_eur: 36068.66, peak_value_eur: 37167.65, drawdown_pct: -2.9568 },
    { snapshot_date: "2026-03-07", value_eur: 36068.66, peak_value_eur: 37167.65, drawdown_pct: -2.9568 },
  ],
};

export const mockDailyDigest: DailyDigestResponse = {
  date: "2026-03-07",
  items: [
    { id: "placeholder-1", headline: "Live news feed not yet connected", summary: "This endpoint is ready for integration with a news data source.", sentiment: "neutral", source: "system", published_at: "2026-03-07T08:00:00.000000Z", category: "system", ticker_symbol: null, relevance_score: null },
  ],
  total: 1,
  note: "Placeholder — live news feed not yet connected.",
};

export const mockSecurityNews: SecurityNewsResponse = {
  isin: "placeholder",
  display_name: "placeholder",
  items: [
    { id: "placeholder-1", headline: "Live news feed not yet connected", summary: "This endpoint is ready for integration with a news data source.", sentiment: "neutral", source: "system", published_at: "2026-03-07T08:00:00.000000Z", category: "system", ticker_symbol: null, relevance_score: null },
  ],
  total: 1,
  note: "Placeholder — live news feed not yet connected.",
};

export const mockThemeNews: ThemeNewsResponse = {
  theme: "placeholder",
  items: [
    { id: "placeholder-1", headline: "Live news feed not yet connected", summary: "This endpoint is ready for integration with a news data source.", sentiment: "neutral", source: "system", published_at: "2026-03-07T08:00:00.000000Z", category: "system", ticker_symbol: null, relevance_score: null },
  ],
  total: 1,
  note: "Placeholder — live news feed not yet connected.",
};
