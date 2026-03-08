import type {
  PortfolioSummary, Holding, PortfolioSnapshot, AnnualSummaryRow,
  ExposureRow, DailyDigest, NewsItem, DrawdownPoint, SecurityDetail,
} from './types';

export const mockPortfolioSummary: PortfolioSummary = {
  portfolio_value_eur: 36068.66,
  twr_pct: 12.4,
  modified_dietz_pct: 11.8,
  max_drawdown_pct: -8.1,
  total_unrealized_eur: 4200.0,
  total_realized_eur: 950.0,
  dividends_eur: 140.0,
  interest_eur: 25.0,
};

export const mockHoldings: Holding[] = [
  { isin: "US64110L1061", display_name: "Netflix", quantity: 15, current_value: 1273.65, portfolio_weight_pct: 3.53, unrealized_eur: 320.0, unrealized_pct: 33.5, sector: "Communication Services", country: "United States", primary_theme: "Digital Media", strategy_bucket: "Structural Growth", asset_class: "Equity" },
  { isin: "US0378331005", display_name: "Apple", quantity: 25, current_value: 5437.50, portfolio_weight_pct: 15.07, unrealized_eur: 890.0, unrealized_pct: 19.6, sector: "Information Technology", country: "United States", primary_theme: "Platform Ecosystems", strategy_bucket: "Core Quality", asset_class: "Equity" },
  { isin: "US5949181045", display_name: "Microsoft", quantity: 12, current_value: 4968.00, portfolio_weight_pct: 13.77, unrealized_eur: 720.0, unrealized_pct: 16.9, sector: "Information Technology", country: "United States", primary_theme: "Cloud & AI", strategy_bucket: "Core Quality", asset_class: "Equity" },
  { isin: "US67066G1040", display_name: "NVIDIA", quantity: 8, current_value: 3520.00, portfolio_weight_pct: 9.76, unrealized_eur: 1100.0, unrealized_pct: 45.5, sector: "Information Technology", country: "United States", primary_theme: "AI Infrastructure", strategy_bucket: "Structural Growth", asset_class: "Equity" },
  { isin: "NL0010273215", display_name: "ASML", quantity: 3, current_value: 2685.00, portfolio_weight_pct: 7.44, unrealized_eur: 410.0, unrealized_pct: 18.0, sector: "Information Technology", country: "Netherlands", primary_theme: "AI Infrastructure", strategy_bucket: "Structural Growth", asset_class: "Equity" },
  { isin: "US0231351067", display_name: "Amazon", quantity: 18, current_value: 3312.00, portfolio_weight_pct: 9.18, unrealized_eur: 540.0, unrealized_pct: 19.5, sector: "Consumer Discretionary", country: "United States", primary_theme: "Cloud & AI", strategy_bucket: "Core Quality", asset_class: "Equity" },
  { isin: "US02079K3059", display_name: "Alphabet", quantity: 20, current_value: 3400.00, portfolio_weight_pct: 9.43, unrealized_eur: 480.0, unrealized_pct: 16.4, sector: "Communication Services", country: "United States", primary_theme: "Cloud & AI", strategy_bucket: "Core Quality", asset_class: "Equity" },
  { isin: "US8835561023", display_name: "Thermo Fisher", quantity: 4, current_value: 2200.00, portfolio_weight_pct: 6.10, unrealized_eur: 180.0, unrealized_pct: 8.9, sector: "Healthcare", country: "United States", primary_theme: "Life Sciences", strategy_bucket: "Defensive Quality", asset_class: "Equity" },
  { isin: "IE00B4L5Y983", display_name: "iShares Core MSCI World", quantity: 50, current_value: 4150.00, portfolio_weight_pct: 11.50, unrealized_eur: 320.0, unrealized_pct: 8.4, sector: "Diversified", country: "Global", primary_theme: "Broad Market", strategy_bucket: "Core Index", asset_class: "ETF" },
  { isin: "US5324571083", display_name: "Eli Lilly", quantity: 2, current_value: 1800.00, portfolio_weight_pct: 4.99, unrealized_eur: 290.0, unrealized_pct: 19.2, sector: "Healthcare", country: "United States", primary_theme: "Biotech Innovation", strategy_bucket: "Structural Growth", asset_class: "Equity" },
  { isin: "US30303M1027", display_name: "Meta Platforms", quantity: 5, current_value: 2950.00, portfolio_weight_pct: 8.18, unrealized_eur: 380.0, unrealized_pct: 14.8, sector: "Communication Services", country: "United States", primary_theme: "Digital Advertising", strategy_bucket: "Structural Growth", asset_class: "Equity" },
  { isin: "DE0007164600", display_name: "SAP", quantity: 10, current_value: 2373.51, portfolio_weight_pct: 6.58, unrealized_eur: 270.0, unrealized_pct: 12.8, sector: "Information Technology", country: "Germany", primary_theme: "Enterprise Software", strategy_bucket: "Core Quality", asset_class: "Equity" },
];

export const mockPortfolioHistory: PortfolioSnapshot[] = [
  { snapshot_date: "2025-01-01", portfolio_value: 20000, net_deployed: 18500, unrealized: 1500 },
  { snapshot_date: "2025-02-01", portfolio_value: 20800, net_deployed: 19000, unrealized: 1800 },
  { snapshot_date: "2025-03-01", portfolio_value: 21500, net_deployed: 19500, unrealized: 2000 },
  { snapshot_date: "2025-04-01", portfolio_value: 22300, net_deployed: 20000, unrealized: 2300 },
  { snapshot_date: "2025-05-01", portfolio_value: 21800, net_deployed: 20500, unrealized: 1300 },
  { snapshot_date: "2025-06-01", portfolio_value: 23200, net_deployed: 21000, unrealized: 2200 },
  { snapshot_date: "2025-07-01", portfolio_value: 24500, net_deployed: 22000, unrealized: 2500 },
  { snapshot_date: "2025-08-01", portfolio_value: 25100, net_deployed: 23000, unrealized: 2100 },
  { snapshot_date: "2025-09-01", portfolio_value: 26800, net_deployed: 24000, unrealized: 2800 },
  { snapshot_date: "2025-10-01", portfolio_value: 28200, net_deployed: 25000, unrealized: 3200 },
  { snapshot_date: "2025-11-01", portfolio_value: 30500, net_deployed: 26000, unrealized: 4500 },
  { snapshot_date: "2025-12-01", portfolio_value: 32000, net_deployed: 27000, unrealized: 5000 },
  { snapshot_date: "2026-01-01", portfolio_value: 33500, net_deployed: 28000, unrealized: 5500 },
  { snapshot_date: "2026-02-01", portfolio_value: 34800, net_deployed: 29000, unrealized: 5800 },
  { snapshot_date: "2026-03-01", portfolio_value: 36068.66, net_deployed: 30000, unrealized: 6068.66 },
];

export const mockAnnualSummary: AnnualSummaryRow[] = [
  { year: 2025, start_date: "2025-01-01", end_date: "2025-12-31", start_value: 20000, end_value: 32000, new_money_eur: 8500, realized_eur: 700, interest_eur: 20, dividends_eur: 80, twr_pct: 13.2 },
  { year: 2026, start_date: "2026-01-01", end_date: "2026-03-08", start_value: 32000, end_value: 36068.66, new_money_eur: 1000, realized_eur: 250, interest_eur: 5, dividends_eur: 60, twr_pct: 9.6 },
];

export const mockSectorExposure: ExposureRow[] = [
  { label: "Information Technology", value_eur: 13546.51, weight_pct: 37.55 },
  { label: "Communication Services", value_eur: 7623.65, weight_pct: 21.14 },
  { label: "Consumer Discretionary", value_eur: 3312.00, weight_pct: 9.18 },
  { label: "Healthcare", value_eur: 4000.00, weight_pct: 11.09 },
  { label: "Diversified", value_eur: 4150.00, weight_pct: 11.50 },
  { label: "Other", value_eur: 3436.50, weight_pct: 9.53 },
];

export const mockCountryExposure: ExposureRow[] = [
  { label: "United States", value_eur: 28861.15, weight_pct: 79.97 },
  { label: "Netherlands", value_eur: 2685.00, weight_pct: 7.44 },
  { label: "Germany", value_eur: 2373.51, weight_pct: 6.58 },
  { label: "Global (ETF)", value_eur: 4150.00, weight_pct: 11.50 },
];

export const mockThemeExposure: ExposureRow[] = [
  { label: "AI Infrastructure", value_eur: 6205.00, weight_pct: 17.20 },
  { label: "Cloud & AI", value_eur: 11680.00, weight_pct: 32.38 },
  { label: "Platform Ecosystems", value_eur: 5437.50, weight_pct: 15.07 },
  { label: "Digital Media", value_eur: 1273.65, weight_pct: 3.53 },
  { label: "Digital Advertising", value_eur: 2950.00, weight_pct: 8.18 },
  { label: "Broad Market", value_eur: 4150.00, weight_pct: 11.50 },
  { label: "Life Sciences", value_eur: 2200.00, weight_pct: 6.10 },
  { label: "Biotech Innovation", value_eur: 1800.00, weight_pct: 4.99 },
  { label: "Enterprise Software", value_eur: 2373.51, weight_pct: 6.58 },
];

export const mockStrategyExposure: ExposureRow[] = [
  { label: "Core Quality", value_eur: 16117.50, weight_pct: 44.68 },
  { label: "Structural Growth", value_eur: 12228.65, weight_pct: 33.90 },
  { label: "Core Index", value_eur: 4150.00, weight_pct: 11.50 },
  { label: "Defensive Quality", value_eur: 2200.00, weight_pct: 6.10 },
];

export const mockAssetClassExposure: ExposureRow[] = [
  { label: "Equity", value_eur: 31918.66, weight_pct: 88.50 },
  { label: "ETF", value_eur: 4150.00, weight_pct: 11.50 },
];

export const mockDrawdown: DrawdownPoint[] = [
  { date: "2025-01-01", drawdown_pct: 0 },
  { date: "2025-02-01", drawdown_pct: -1.2 },
  { date: "2025-03-01", drawdown_pct: -0.5 },
  { date: "2025-04-01", drawdown_pct: 0 },
  { date: "2025-05-01", drawdown_pct: -8.1 },
  { date: "2025-06-01", drawdown_pct: -3.2 },
  { date: "2025-07-01", drawdown_pct: 0 },
  { date: "2025-08-01", drawdown_pct: -2.1 },
  { date: "2025-09-01", drawdown_pct: 0 },
  { date: "2025-10-01", drawdown_pct: -1.5 },
  { date: "2025-11-01", drawdown_pct: 0 },
  { date: "2025-12-01", drawdown_pct: -0.8 },
  { date: "2026-01-01", drawdown_pct: -1.0 },
  { date: "2026-02-01", drawdown_pct: 0 },
  { date: "2026-03-01", drawdown_pct: -0.3 },
];

export const mockDailyDigest: DailyDigest = {
  date: "2026-03-08",
  summary: [
    { headline: "Micron raises outlook on AI memory demand", security: "Micron", theme: "AI Infrastructure", sentiment: "positive", importance: "high", why_it_matters: "Improves the outlook for your memory semiconductor exposure." },
    { headline: "EU antitrust probe targets Big Tech ad practices", security: "Meta Platforms", theme: "Digital Advertising", sentiment: "negative", importance: "medium", why_it_matters: "May pressure Meta's EU advertising revenue, affecting ~8% of your portfolio." },
    { headline: "Microsoft Azure revenue beats expectations", security: "Microsoft", theme: "Cloud & AI", sentiment: "positive", importance: "high", why_it_matters: "Validates cloud spending thesis — Microsoft is ~14% of your portfolio." },
    { headline: "SAP announces accelerated S/4HANA Cloud migration", security: "SAP", theme: "Enterprise Software", sentiment: "positive", importance: "medium", why_it_matters: "Supports SAP's recurring revenue transition, positive for your ~7% position." },
    { headline: "ASML reports strong EUV bookings for H2 2026", security: "ASML", theme: "AI Infrastructure", sentiment: "positive", importance: "high", why_it_matters: "Strong lithography demand confirms continued AI capex cycle benefiting your semiconductor positions." },
  ],
};

export const mockNewsItems: NewsItem[] = [
  { id: "news_1", published_at: "2026-03-08T07:30:00Z", headline: "ASML supplier bottlenecks ease, EUV capacity expanding", source: "Reuters", url: "#", security: "ASML", theme: "AI Infrastructure", sector: "Information Technology", sentiment: "positive", importance: "medium", why_it_matters: "May support lithography throughput and AI chip capacity." },
  { id: "news_2", published_at: "2026-03-08T06:15:00Z", headline: "Apple announces major AI integration across iOS 20", source: "Bloomberg", url: "#", security: "Apple", theme: "Platform Ecosystems", sector: "Information Technology", sentiment: "positive", importance: "high", why_it_matters: "Strengthens Apple's AI narrative and ecosystem lock-in — relevant to your 15% Apple position." },
  { id: "news_3", published_at: "2026-03-08T05:45:00Z", headline: "NVIDIA H200 demand exceeds supply through Q3 2026", source: "SemiAnalysis", url: "#", security: "NVIDIA", theme: "AI Infrastructure", sector: "Information Technology", sentiment: "positive", importance: "high", why_it_matters: "Sustained GPU demand supports NVIDIA's premium valuation in your portfolio." },
  { id: "news_4", published_at: "2026-03-07T22:00:00Z", headline: "Eli Lilly GLP-1 drug shows 28% weight loss in Phase 3", source: "STAT News", url: "#", security: "Eli Lilly", theme: "Biotech Innovation", sector: "Healthcare", sentiment: "positive", importance: "high", why_it_matters: "Potential blockbuster drug — your Lilly position could see significant upside." },
  { id: "news_5", published_at: "2026-03-07T20:30:00Z", headline: "Amazon Web Services launches next-gen custom AI chips", source: "TechCrunch", url: "#", security: "Amazon", theme: "Cloud & AI", sector: "Consumer Discretionary", sentiment: "positive", importance: "medium", why_it_matters: "AWS custom silicon reduces dependency on NVIDIA, boosting margins for your Amazon holding." },
  { id: "news_6", published_at: "2026-03-07T18:00:00Z", headline: "Alphabet DeepMind achieves reasoning breakthrough", source: "Nature", url: "#", security: "Alphabet", theme: "Cloud & AI", sector: "Communication Services", sentiment: "positive", importance: "medium", why_it_matters: "Advances Google's AI leadership, supporting your ~9% Alphabet position." },
  { id: "news_7", published_at: "2026-03-07T16:00:00Z", headline: "Thermo Fisher wins $2B government lab contract", source: "MarketWatch", url: "#", security: "Thermo Fisher", theme: "Life Sciences", sector: "Healthcare", sentiment: "positive", importance: "medium", why_it_matters: "Strengthens Thermo Fisher's recurring revenue base." },
  { id: "news_8", published_at: "2026-03-07T14:30:00Z", headline: "iShares MSCI World ETF sees record inflows", source: "ETF.com", url: "#", security: "iShares Core MSCI World", theme: "Broad Market", sector: "Diversified", sentiment: "neutral", importance: "low", why_it_matters: "Positive flow signal for your core index allocation." },
  { id: "news_9", published_at: "2026-03-07T12:00:00Z", headline: "Meta announces Threads reaching 500M users", source: "The Verge", url: "#", security: "Meta Platforms", theme: "Digital Advertising", sector: "Communication Services", sentiment: "positive", importance: "medium", why_it_matters: "New engagement surface for Meta's ad platform, supporting revenue growth." },
  { id: "news_10", published_at: "2026-03-07T10:00:00Z", headline: "SAP Cloud revenue grows 32% YoY in Q1 preview", source: "Handelsblatt", url: "#", security: "SAP", theme: "Enterprise Software", sector: "Information Technology", sentiment: "positive", importance: "medium", why_it_matters: "Accelerating cloud transition validates SAP's long-term thesis." },
];

export const mockSecurityDetail: SecurityDetail = {
  isin: "US67066G1040",
  display_name: "NVIDIA",
  ticker: "NVDA",
  quantity: 8,
  current_value: 3520.00,
  portfolio_weight_pct: 9.76,
  unrealized_eur: 1100.0,
  unrealized_pct: 45.5,
  sector: "Information Technology",
  country: "United States",
  primary_theme: "AI Infrastructure",
  strategy_bucket: "Structural Growth",
  asset_class: "Equity",
  purchase_date: "2024-06-15",
  cost_basis: 2420.00,
  notes: "Core AI infrastructure position. Benefiting from datacenter GPU demand cycle.",
};
