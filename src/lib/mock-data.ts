export interface PortfolioPosition {
  id: string;
  ticker: string;
  companyName: string;
  shares: number;
  positionValue: number;
  portfolioWeight: number;
  sector: string;
  purchaseDate?: string;
  notes?: string;
  dailyChange: number;
  dailyChangePercent: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  summaryDe?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  source: string;
  sourceUrl: string;
  publishedAt: string;
  ticker?: string;
  category: 'global' | 'portfolio' | 'recent' | 'ai-priority';
  rating?: 'up' | 'down' | null;
  tags?: string[];
}

export interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  type: 'earnings' | 'macro' | 'dividend' | 'fed';
  ticker?: string;
}

export const mockPositions: PortfolioPosition[] = [
  { id: '1', ticker: 'NVDA', companyName: 'NVIDIA Corporation', shares: 150, positionValue: 135000, portfolioWeight: 8.5, sector: 'Semiconductors', purchaseDate: '2024-03-15', dailyChange: 2340, dailyChangePercent: 1.76 },
  { id: '2', ticker: 'AAPL', companyName: 'Apple Inc.', shares: 400, positionValue: 92000, portfolioWeight: 5.8, sector: 'Technology', purchaseDate: '2023-06-10', dailyChange: -460, dailyChangePercent: -0.50 },
  { id: '3', ticker: 'MSFT', companyName: 'Microsoft Corporation', shares: 200, positionValue: 86000, portfolioWeight: 5.4, sector: 'Technology', purchaseDate: '2023-01-20', dailyChange: 1290, dailyChangePercent: 1.52 },
  { id: '4', ticker: 'AMZN', companyName: 'Amazon.com Inc.', shares: 350, positionValue: 73500, portfolioWeight: 4.6, sector: 'Technology', purchaseDate: '2023-09-05', dailyChange: 735, dailyChangePercent: 1.01 },
  { id: '5', ticker: 'AVGO', companyName: 'Broadcom Inc.', shares: 250, positionValue: 62500, portfolioWeight: 3.9, sector: 'Semiconductors', purchaseDate: '2024-01-12', dailyChange: 1875, dailyChangePercent: 3.09 },
  { id: '6', ticker: 'TSLA', companyName: 'Tesla Inc.', shares: 180, positionValue: 58500, portfolioWeight: 3.7, sector: 'Technology', purchaseDate: '2024-06-20', dailyChange: -1170, dailyChangePercent: -1.96 },
  { id: '7', ticker: 'LLY', companyName: 'Eli Lilly and Company', shares: 60, positionValue: 54000, portfolioWeight: 3.4, sector: 'Healthcare', purchaseDate: '2023-04-18', dailyChange: 810, dailyChangePercent: 1.52 },
  { id: '8', ticker: 'UNH', companyName: 'UnitedHealth Group', shares: 80, positionValue: 48000, portfolioWeight: 3.0, sector: 'Healthcare', purchaseDate: '2023-07-22', dailyChange: -720, dailyChangePercent: -1.48 },
  { id: '9', ticker: 'AMD', companyName: 'Advanced Micro Devices', shares: 300, positionValue: 45000, portfolioWeight: 2.8, sector: 'Semiconductors', purchaseDate: '2024-02-08', dailyChange: 900, dailyChangePercent: 2.04 },
  { id: '10', ticker: 'GOOGL', companyName: 'Alphabet Inc.', shares: 250, positionValue: 43750, portfolioWeight: 2.8, sector: 'Technology', purchaseDate: '2023-05-30', dailyChange: 437, dailyChangePercent: 1.01 },
  { id: '11', ticker: 'META', companyName: 'Meta Platforms Inc.', shares: 70, positionValue: 42000, portfolioWeight: 2.6, sector: 'Technology', purchaseDate: '2023-08-14', dailyChange: 840, dailyChangePercent: 2.04 },
  { id: '12', ticker: 'TSM', companyName: 'Taiwan Semiconductor', shares: 200, positionValue: 40000, portfolioWeight: 2.5, sector: 'Semiconductors', purchaseDate: '2024-04-10', dailyChange: 1200, dailyChangePercent: 3.09 },
  { id: '13', ticker: 'ASML', companyName: 'ASML Holding', shares: 40, positionValue: 38000, portfolioWeight: 2.4, sector: 'Semiconductors', purchaseDate: '2023-11-25', dailyChange: 570, dailyChangePercent: 1.52 },
  { id: '14', ticker: 'JNJ', companyName: 'Johnson & Johnson', shares: 200, positionValue: 36000, portfolioWeight: 2.3, sector: 'Healthcare', purchaseDate: '2022-12-10', dailyChange: 180, dailyChangePercent: 0.50 },
  { id: '15', ticker: 'QQQ', companyName: 'Invesco QQQ Trust', shares: 70, positionValue: 35000, portfolioWeight: 2.2, sector: 'ETF', purchaseDate: '2023-03-01', dailyChange: 350, dailyChangePercent: 1.01 },
  { id: '16', ticker: 'VOO', companyName: 'Vanguard S&P 500 ETF', shares: 65, positionValue: 33800, portfolioWeight: 2.1, sector: 'ETF', purchaseDate: '2022-06-15', dailyChange: 169, dailyChangePercent: 0.50 },
  { id: '17', ticker: 'V', companyName: 'Visa Inc.', shares: 100, positionValue: 32000, portfolioWeight: 2.0, sector: 'Financials', purchaseDate: '2023-02-28', dailyChange: 320, dailyChangePercent: 1.01 },
  { id: '18', ticker: 'MRVL', companyName: 'Marvell Technology', shares: 350, positionValue: 31500, portfolioWeight: 2.0, sector: 'Semiconductors', purchaseDate: '2025-01-15', dailyChange: 945, dailyChangePercent: 3.09, notes: 'Recent addition — AI infrastructure play' },
  { id: '19', ticker: 'CRM', companyName: 'Salesforce Inc.', shares: 100, positionValue: 30000, portfolioWeight: 1.9, sector: 'Technology', purchaseDate: '2024-07-01', dailyChange: -300, dailyChangePercent: -0.99 },
  { id: '20', ticker: 'ABBV', companyName: 'AbbVie Inc.', shares: 150, positionValue: 28500, portfolioWeight: 1.8, sector: 'Healthcare', purchaseDate: '2023-10-05', dailyChange: 285, dailyChangePercent: 1.01 },
  { id: '21', ticker: 'NOW', companyName: 'ServiceNow Inc.', shares: 30, positionValue: 27000, portfolioWeight: 1.7, sector: 'Technology', purchaseDate: '2025-02-10', dailyChange: 540, dailyChangePercent: 2.04, notes: 'New position — enterprise AI adoption' },
  { id: '22', ticker: 'PLTR', companyName: 'Palantir Technologies', shares: 400, positionValue: 26000, portfolioWeight: 1.6, sector: 'Technology', purchaseDate: '2025-01-28', dailyChange: 780, dailyChangePercent: 3.09, notes: 'Government AI contracts' },
  { id: '23', ticker: 'PANW', companyName: 'Palo Alto Networks', shares: 70, positionValue: 25200, portfolioWeight: 1.6, sector: 'Technology', purchaseDate: '2024-05-20', dailyChange: 252, dailyChangePercent: 1.01 },
  { id: '24', ticker: 'COST', companyName: 'Costco Wholesale', shares: 25, positionValue: 24500, portfolioWeight: 1.5, sector: 'Consumer', purchaseDate: '2023-08-30', dailyChange: 122, dailyChangePercent: 0.50 },
  { id: '25', ticker: 'SMH', companyName: 'VanEck Semiconductor ETF', shares: 90, positionValue: 23400, portfolioWeight: 1.5, sector: 'ETF', purchaseDate: '2024-09-01', dailyChange: 468, dailyChangePercent: 2.04 },
  { id: '26', ticker: 'PFE', companyName: 'Pfizer Inc.', shares: 800, positionValue: 22400, portfolioWeight: 1.4, sector: 'Healthcare', purchaseDate: '2024-11-12', dailyChange: -448, dailyChangePercent: -1.96 },
  { id: '27', ticker: 'INTC', companyName: 'Intel Corporation', shares: 1000, positionValue: 21000, portfolioWeight: 1.3, sector: 'Semiconductors', purchaseDate: '2025-02-01', dailyChange: -420, dailyChangePercent: -1.96, notes: 'Turnaround bet' },
  { id: '28', ticker: 'MA', companyName: 'Mastercard Inc.', shares: 40, positionValue: 20000, portfolioWeight: 1.3, sector: 'Financials', purchaseDate: '2023-06-22', dailyChange: 200, dailyChangePercent: 1.01 },
  { id: '29', ticker: 'ISRG', companyName: 'Intuitive Surgical', shares: 35, positionValue: 19250, portfolioWeight: 1.2, sector: 'Healthcare', purchaseDate: '2024-08-10', dailyChange: 385, dailyChangePercent: 2.04 },
  { id: '30', ticker: 'SNOW', companyName: 'Snowflake Inc.', shares: 120, positionValue: 18600, portfolioWeight: 1.2, sector: 'Technology', purchaseDate: '2025-02-20', dailyChange: 558, dailyChangePercent: 3.09, notes: 'Data cloud recovery play' },
  { id: '31', ticker: 'ADBE', companyName: 'Adobe Inc.', shares: 35, positionValue: 17500, portfolioWeight: 1.1, sector: 'Technology', dailyChange: 175, dailyChangePercent: 1.01 },
  { id: '32', ticker: 'MRK', companyName: 'Merck & Co.', shares: 150, positionValue: 16500, portfolioWeight: 1.0, sector: 'Healthcare', dailyChange: -165, dailyChangePercent: -0.99 },
  { id: '33', ticker: 'QCOM', companyName: 'Qualcomm Inc.', shares: 100, positionValue: 16000, portfolioWeight: 1.0, sector: 'Semiconductors', dailyChange: 320, dailyChangePercent: 2.04 },
  { id: '34', ticker: 'ANET', companyName: 'Arista Networks', shares: 20, positionValue: 15600, portfolioWeight: 1.0, sector: 'Technology', dailyChange: 312, dailyChangePercent: 2.04 },
  { id: '35', ticker: 'KLAC', companyName: 'KLA Corporation', shares: 20, positionValue: 15000, portfolioWeight: 0.9, sector: 'Semiconductors', dailyChange: 225, dailyChangePercent: 1.52 },
  { id: '36', ticker: 'LRCX', companyName: 'Lam Research', shares: 18, positionValue: 14400, portfolioWeight: 0.9, sector: 'Semiconductors', dailyChange: 216, dailyChangePercent: 1.52 },
  { id: '37', ticker: 'TMO', companyName: 'Thermo Fisher Scientific', shares: 25, positionValue: 13750, portfolioWeight: 0.9, sector: 'Healthcare', dailyChange: 137, dailyChangePercent: 1.01 },
  { id: '38', ticker: 'AMGN', companyName: 'Amgen Inc.', shares: 45, positionValue: 13500, portfolioWeight: 0.8, sector: 'Healthcare', dailyChange: -135, dailyChangePercent: -0.99 },
  { id: '39', ticker: 'SPY', companyName: 'SPDR S&P 500 ETF', shares: 22, positionValue: 13200, portfolioWeight: 0.8, sector: 'ETF', dailyChange: 66, dailyChangePercent: 0.50 },
  { id: '40', ticker: 'SOXX', companyName: 'iShares Semiconductor ETF', shares: 50, positionValue: 12500, portfolioWeight: 0.8, sector: 'ETF', dailyChange: 375, dailyChangePercent: 3.09 },
];

export const totalPortfolioValue = mockPositions.reduce((sum, p) => sum + p.positionValue, 0);
export const totalDailyChange = mockPositions.reduce((sum, p) => sum + p.dailyChange, 0);
export const totalDailyChangePercent = (totalDailyChange / totalPortfolioValue) * 100;

export const performanceData = [
  { date: 'Jan', value: 1420000 },
  { date: 'Feb', value: 1385000 },
  { date: 'Mar', value: 1460000 },
  { date: 'Apr', value: 1490000 },
  { date: 'May', value: 1525000 },
  { date: 'Jun', value: 1510000 },
  { date: 'Jul', value: 1565000 },
  { date: 'Aug', value: 1548000 },
  { date: 'Sep', value: 1580000 },
  { date: 'Oct', value: 1540000 },
  { date: 'Nov', value: 1590000 },
  { date: 'Dec', value: totalPortfolioValue },
];

export const sectorData = (() => {
  const sectors: Record<string, number> = {};
  mockPositions.forEach(p => {
    sectors[p.sector] = (sectors[p.sector] || 0) + p.portfolioWeight;
  });
  return Object.entries(sectors)
    .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
    .sort((a, b) => b.value - a.value);
})();

export const mockEvents: UpcomingEvent[] = [
  { id: '1', title: 'NVDA Earnings Report', date: '2026-03-12', type: 'earnings', ticker: 'NVDA' },
  { id: '2', title: 'Fed Interest Rate Decision', date: '2026-03-19', type: 'fed' },
  { id: '3', title: 'AAPL Q1 Earnings', date: '2026-03-25', type: 'earnings', ticker: 'AAPL' },
  { id: '4', title: 'US CPI Data Release', date: '2026-03-10', type: 'macro' },
  { id: '5', title: 'AVGO Earnings Call', date: '2026-03-14', type: 'earnings', ticker: 'AVGO' },
  { id: '6', title: 'ECB Policy Meeting', date: '2026-03-20', type: 'macro' },
  { id: '7', title: 'AMD Investor Day', date: '2026-03-17', type: 'earnings', ticker: 'AMD' },
  { id: '8', title: 'MSFT Dividend Ex-Date', date: '2026-03-11', type: 'dividend', ticker: 'MSFT' },
];

export const mockGlobalNews: NewsItem[] = [
  {
    id: 'g1', headline: 'Federal Reserve Signals Potential Rate Cut in Q2 2026',
    summary: 'Fed Chair indicated that softening inflation data may warrant a 25bps rate cut at the June meeting, sending bond yields lower and equities higher.',
    summaryDe: 'Fed-Chef signalisierte, dass nachlassende Inflationsdaten eine Zinssenkung um 25 Basispunkte bei der Juni-Sitzung rechtfertigen könnten.',
    sentiment: 'positive', source: 'Reuters', sourceUrl: '#', publishedAt: '2026-03-04T06:30:00Z', category: 'global',
    tags: ['Fed', 'Interest Rates', 'Monetary Policy'],
  },
  {
    id: 'g2', headline: 'EU Announces New AI Regulation Framework',
    summary: 'The European Commission unveiled stricter AI governance rules affecting tech companies operating in the EU, with compliance deadlines set for 2027.',
    summaryDe: 'Die Europäische Kommission stellte strengere KI-Governance-Regeln vor, die Technologieunternehmen in der EU betreffen.',
    sentiment: 'neutral', source: 'Financial Times', sourceUrl: '#', publishedAt: '2026-03-04T05:15:00Z', category: 'global',
    tags: ['AI Regulation', 'EU', 'Technology'],
  },
  {
    id: 'g3', headline: 'China-Taiwan Tensions Escalate After Military Exercises',
    summary: 'Increased military activity in the Taiwan Strait has raised concerns about semiconductor supply chain disruption, impacting chip stocks globally.',
    summaryDe: 'Erhöhte Militäraktivität in der Taiwanstraße hat Sorgen über Störungen der Halbleiter-Lieferkette geweckt.',
    sentiment: 'negative', source: 'Bloomberg', sourceUrl: '#', publishedAt: '2026-03-04T04:00:00Z', category: 'global',
    tags: ['Geopolitics', 'Semiconductors', 'Supply Chain'],
  },
  {
    id: 'g4', headline: 'Oil Prices Surge on OPEC+ Production Cut Extension',
    summary: 'OPEC+ agreed to extend production cuts through Q3 2026, pushing Brent crude above $85/barrel and raising inflation concerns.',
    summaryDe: 'OPEC+ hat die Verlängerung der Produktionskürzungen bis Q3 2026 vereinbart.',
    sentiment: 'negative', source: 'CNBC', sourceUrl: '#', publishedAt: '2026-03-03T22:00:00Z', category: 'global',
    tags: ['Oil', 'OPEC', 'Inflation'],
  },
  {
    id: 'g5', headline: 'Japan\'s Nikkei Hits All-Time High on Weak Yen',
    summary: 'The Nikkei 225 surpassed 42,000 points as the yen weakened to 158 against the dollar, benefiting exporters.',
    summaryDe: 'Der Nikkei 225 überschritt 42.000 Punkte, da der Yen auf 158 gegenüber dem Dollar fiel.',
    sentiment: 'positive', source: 'Nikkei Asia', sourceUrl: '#', publishedAt: '2026-03-04T02:30:00Z', category: 'global',
    tags: ['Japan', 'Nikkei', 'Currency'],
  },
];

export const mockPortfolioNews: NewsItem[] = [
  {
    id: 'p1', headline: 'NVIDIA Unveils Next-Gen Blackwell Ultra GPU', ticker: 'NVDA',
    summary: 'NVIDIA announced the Blackwell Ultra architecture delivering 2x performance per watt, securing major cloud contracts with AWS and Azure.',
    sentiment: 'positive', source: 'Tom\'s Hardware', sourceUrl: '#', publishedAt: '2026-03-04T07:00:00Z', category: 'portfolio',
    tags: ['GPU', 'AI', 'Data Center'],
  },
  {
    id: 'p2', headline: 'Apple Vision Pro 2 Disappoints on Sales Forecast', ticker: 'AAPL',
    summary: 'Apple lowered its Vision Pro 2 sales guidance by 15%, citing slower enterprise adoption. Consumer interest remains tepid at the $2,999 price point.',
    sentiment: 'negative', source: 'Bloomberg', sourceUrl: '#', publishedAt: '2026-03-04T06:00:00Z', category: 'portfolio',
    tags: ['Apple', 'AR/VR', 'Consumer Tech'],
  },
  {
    id: 'p3', headline: 'Broadcom Raises Dividend, Announces $10B Buyback', ticker: 'AVGO',
    summary: 'Broadcom increased quarterly dividend by 12% and authorized a $10 billion share repurchase program, signaling strong free cash flow.',
    sentiment: 'positive', source: 'Seeking Alpha', sourceUrl: '#', publishedAt: '2026-03-03T20:00:00Z', category: 'portfolio',
    tags: ['Dividend', 'Buyback', 'Semiconductors'],
  },
  {
    id: 'p4', headline: 'UnitedHealth Faces DOJ Antitrust Investigation', ticker: 'UNH',
    summary: 'The DOJ opened a broad antitrust probe into UnitedHealth Group\'s vertical integration across insurance and healthcare services.',
    sentiment: 'negative', source: 'Wall Street Journal', sourceUrl: '#', publishedAt: '2026-03-04T05:30:00Z', category: 'portfolio',
    tags: ['Antitrust', 'Healthcare', 'Regulation'],
  },
  {
    id: 'p5', headline: 'Taiwan Semiconductor Expands Arizona Fab Capacity', ticker: 'TSM',
    summary: 'TSMC announced an additional $15 billion investment in its Arizona fabrication facilities, accelerating 3nm production timeline to late 2026.',
    sentiment: 'positive', source: 'Reuters', sourceUrl: '#', publishedAt: '2026-03-03T18:00:00Z', category: 'portfolio',
    tags: ['TSMC', 'Manufacturing', 'US Expansion'],
  },
  {
    id: 'p6', headline: 'Eli Lilly Weight-Loss Drug Shows Superior Results in Phase 3', ticker: 'LLY',
    summary: 'Lilly\'s next-gen GLP-1 drug achieved 28% average weight loss in a Phase 3 trial, exceeding Wegovy and setting up potential blockbuster approval.',
    sentiment: 'positive', source: 'STAT News', sourceUrl: '#', publishedAt: '2026-03-04T03:00:00Z', category: 'portfolio',
    tags: ['GLP-1', 'Weight Loss', 'Clinical Trial'],
  },
  {
    id: 'p7', headline: 'QQQ Rebalancing Increases Semiconductor Weighting', ticker: 'QQQ',
    summary: 'The Nasdaq-100 quarterly rebalance will increase semiconductor weighting from 22% to 26%, reflecting sector momentum.',
    sentiment: 'positive', source: 'ETF.com', sourceUrl: '#', publishedAt: '2026-03-03T16:00:00Z', category: 'portfolio',
    tags: ['ETF', 'Rebalancing', 'Semiconductors'],
  },
  {
    id: 'p8', headline: 'Morgan Stanley Upgrades AMD to Overweight', ticker: 'AMD',
    summary: 'Analyst raised AMD price target to $210 citing accelerating MI400 GPU adoption in enterprise AI workloads.',
    sentiment: 'positive', source: 'MarketWatch', sourceUrl: '#', publishedAt: '2026-03-04T08:00:00Z', category: 'portfolio',
    tags: ['Upgrade', 'AI', 'Analyst'],
  },
];

export const mockRecentPurchaseNews: NewsItem[] = [
  {
    id: 'r1', headline: 'Palantir Wins $1.2B Army Contract for AI Platform', ticker: 'PLTR',
    summary: 'Palantir secured a major multi-year contract with the US Army for its AIP platform, cementing its government AI leadership.',
    sentiment: 'positive', source: 'Defense One', sourceUrl: '#', publishedAt: '2026-03-04T07:30:00Z', category: 'recent',
    tags: ['Government', 'AI', 'Defense'],
  },
  {
    id: 'r2', headline: 'Snowflake Reports 35% Revenue Growth, Stock Surges', ticker: 'SNOW',
    summary: 'Snowflake beat estimates with $1.1B quarterly revenue and expanded margins, driven by AI-powered data analytics demand.',
    sentiment: 'positive', source: 'Barron\'s', sourceUrl: '#', publishedAt: '2026-03-03T21:00:00Z', category: 'recent',
    tags: ['Earnings', 'Data Cloud', 'Growth'],
  },
  {
    id: 'r3', headline: 'Intel Restructuring: Foundry Unit Faces Delays', ticker: 'INTC',
    summary: 'Intel\'s foundry turnaround hits setback as 18A process node timeline slips to Q2 2027, casting doubt on competitiveness.',
    sentiment: 'negative', source: 'The Information', sourceUrl: '#', publishedAt: '2026-03-04T06:45:00Z', category: 'recent',
    tags: ['Foundry', 'Manufacturing', 'Turnaround'],
  },
  {
    id: 'r4', headline: 'ServiceNow Sees Record Enterprise AI Adoption', ticker: 'NOW',
    summary: 'ServiceNow reported that 45% of new enterprise contracts include AI features, with average deal sizes up 30% YoY.',
    sentiment: 'positive', source: 'TechCrunch', sourceUrl: '#', publishedAt: '2026-03-04T04:30:00Z', category: 'recent',
    tags: ['Enterprise AI', 'SaaS', 'Growth'],
  },
  {
    id: 'r5', headline: 'Marvell Custom Silicon Wins Expand with Hyperscalers', ticker: 'MRVL',
    summary: 'Marvell expanded its custom ASIC partnerships with two additional hyperscale cloud providers, boosting 2027 revenue outlook.',
    sentiment: 'positive', source: 'SemiAnalysis', sourceUrl: '#', publishedAt: '2026-03-03T19:00:00Z', category: 'recent',
    tags: ['Custom Silicon', 'Hyperscale', 'AI'],
  },
];

export const mockAIPriorityNews: NewsItem[] = [
  {
    id: 'a1', headline: 'US-China Chip Export Controls Tightened Further',
    summary: 'The Commerce Department expanded chip export restrictions to include additional AI accelerator categories, impacting NVIDIA and AMD revenue in China.',
    sentiment: 'negative', source: 'Reuters', sourceUrl: '#', publishedAt: '2026-03-04T08:30:00Z', category: 'ai-priority',
    tags: ['Export Controls', 'China', 'Semiconductors'],
  },
  {
    id: 'a2', headline: 'Breakthrough in Quantum Error Correction Announced',
    summary: 'Google DeepMind achieved a major milestone in quantum error correction, potentially accelerating quantum computing timelines by 5 years.',
    sentiment: 'positive', source: 'Nature', sourceUrl: '#', publishedAt: '2026-03-04T01:00:00Z', category: 'ai-priority',
    tags: ['Quantum Computing', 'Technology Breakthrough'],
  },
  {
    id: 'a3', headline: 'Major Healthcare M&A: AstraZeneca Bids for Dexcom',
    summary: 'AstraZeneca launched a $45B hostile bid for Dexcom, signaling consolidation in the diabetes tech space. Could impact competitive landscape for holdings.',
    sentiment: 'neutral', source: 'Financial Times', sourceUrl: '#', publishedAt: '2026-03-04T06:15:00Z', category: 'ai-priority',
    tags: ['M&A', 'Healthcare', 'Diabetes'],
  },
  {
    id: 'a4', headline: 'New EU Digital Markets Act Enforcement Against Big Tech',
    summary: 'The EU opened formal proceedings against Apple, Google, and Meta under the DMA, threatening fines up to 10% of global revenue.',
    sentiment: 'negative', source: 'TechCrunch', sourceUrl: '#', publishedAt: '2026-03-03T23:00:00Z', category: 'ai-priority',
    tags: ['Regulation', 'DMA', 'Big Tech'],
  },
  {
    id: 'a5', headline: 'AI Energy Demand Drives Nuclear Power Renaissance',
    summary: 'Microsoft, Google, and Amazon collectively committed $30B to nuclear energy projects to power AI data centers through 2030.',
    sentiment: 'positive', source: 'Bloomberg', sourceUrl: '#', publishedAt: '2026-03-04T05:00:00Z', category: 'ai-priority',
    tags: ['Energy', 'Nuclear', 'AI Infrastructure'],
  },
];

export const recentPurchases = mockPositions.filter(p => {
  if (!p.purchaseDate) return false;
  const d = new Date(p.purchaseDate);
  return d >= new Date('2025-01-01');
});
