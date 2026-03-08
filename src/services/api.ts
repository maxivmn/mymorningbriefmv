// Central API service layer
// Switch between mock data and real backend endpoints via settings
// TODO: Replace mock implementations with actual API calls when backend is ready

import type {
  PortfolioSummary, Holding, PortfolioSnapshot, AnnualSummaryRow,
  ExposureRow, DailyDigest, NewsItem, DrawdownPoint, SecurityDetail, AppSettings,
} from './types';
import {
  mockPortfolioSummary, mockHoldings, mockPortfolioHistory, mockAnnualSummary,
  mockSectorExposure, mockCountryExposure, mockThemeExposure, mockStrategyExposure,
  mockAssetClassExposure, mockDrawdown, mockDailyDigest, mockNewsItems, mockSecurityDetail,
} from './mock-data';

const DEFAULT_SETTINGS: AppSettings = {
  apiBaseUrl: '',
  useMockData: true,
  newsRefreshInterval: 30,
  morningDigestTime: '07:00',
};

function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem('app_settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>) {
  const current = getSettings();
  localStorage.setItem('app_settings', JSON.stringify({ ...current, ...settings }));
}

export function loadSettings(): AppSettings {
  return getSettings();
}

// Simulate network delay for mock data
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

// TODO: Implement real API calls when backend is connected
// async function apiFetch<T>(path: string): Promise<T> {
//   const { apiBaseUrl } = getSettings();
//   const res = await fetch(`${apiBaseUrl}${path}`);
//   if (!res.ok) throw new Error(`API error: ${res.status}`);
//   return res.json();
// }

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  // TODO: return apiFetch('/api/portfolio/summary');
  return delay(mockPortfolioSummary);
}

export async function getLatestHoldings(): Promise<Holding[]> {
  // TODO: return apiFetch('/api/holdings/latest');
  return delay(mockHoldings);
}

export async function getPortfolioValueHistory(): Promise<PortfolioSnapshot[]> {
  // TODO: return apiFetch('/api/portfolio/history');
  return delay(mockPortfolioHistory);
}

export async function getTwr(): Promise<{ twr_pct: number }> {
  // TODO: return apiFetch('/api/analytics/twr');
  return delay({ twr_pct: mockPortfolioSummary.twr_pct });
}

export async function getModifiedDietz(): Promise<{ modified_dietz_pct: number }> {
  // TODO: return apiFetch('/api/analytics/modified-dietz');
  return delay({ modified_dietz_pct: mockPortfolioSummary.modified_dietz_pct });
}

export async function getAnnualSummary(): Promise<AnnualSummaryRow[]> {
  // TODO: return apiFetch('/api/analytics/annual-summary');
  return delay(mockAnnualSummary);
}

export async function getPositionReturns(): Promise<Holding[]> {
  // TODO: return apiFetch('/api/analytics/position-returns');
  return delay(mockHoldings);
}

export async function getExposureBySector(): Promise<ExposureRow[]> {
  // TODO: return apiFetch('/api/exposure/sector');
  return delay(mockSectorExposure);
}

export async function getExposureByTheme(): Promise<ExposureRow[]> {
  // TODO: return apiFetch('/api/exposure/theme');
  return delay(mockThemeExposure);
}

export async function getExposureByStrategy(): Promise<ExposureRow[]> {
  // TODO: return apiFetch('/api/exposure/strategy');
  return delay(mockStrategyExposure);
}

export async function getExposureByCountry(): Promise<ExposureRow[]> {
  // TODO: return apiFetch('/api/exposure/country');
  return delay(mockCountryExposure);
}

export async function getExposureByAssetClass(): Promise<ExposureRow[]> {
  // TODO: return apiFetch('/api/exposure/asset-class');
  return delay(mockAssetClassExposure);
}

export async function getDrawdown(): Promise<DrawdownPoint[]> {
  // TODO: return apiFetch('/api/analytics/drawdown');
  return delay(mockDrawdown);
}

export async function getDailyDigest(): Promise<DailyDigest> {
  // TODO: return apiFetch('/api/news/digest');
  return delay(mockDailyDigest);
}

export async function getNewsBySecurity(security?: string): Promise<NewsItem[]> {
  // TODO: return apiFetch(`/api/news/by-security?security=${security}`);
  const items = security
    ? mockNewsItems.filter(n => n.security.toLowerCase().includes(security.toLowerCase()))
    : mockNewsItems;
  return delay(items);
}

export async function getNewsByTheme(theme?: string): Promise<NewsItem[]> {
  // TODO: return apiFetch(`/api/news/by-theme?theme=${theme}`);
  const items = theme
    ? mockNewsItems.filter(n => n.theme.toLowerCase().includes(theme.toLowerCase()))
    : mockNewsItems;
  return delay(items);
}

export async function getAllNews(): Promise<NewsItem[]> {
  // TODO: return apiFetch('/api/news/all');
  return delay(mockNewsItems);
}

export async function getSecurityDetail(isin: string): Promise<SecurityDetail> {
  // TODO: return apiFetch(`/api/security/${isin}`);
  const holding = mockHoldings.find(h => h.isin === isin);
  if (holding) {
    return delay({
      ...mockSecurityDetail,
      isin: holding.isin,
      display_name: holding.display_name,
      quantity: holding.quantity,
      current_value: holding.current_value,
      portfolio_weight_pct: holding.portfolio_weight_pct,
      unrealized_eur: holding.unrealized_eur,
      unrealized_pct: holding.unrealized_pct,
      sector: holding.sector,
      country: holding.country,
      primary_theme: holding.primary_theme,
      strategy_bucket: holding.strategy_bucket,
      asset_class: holding.asset_class,
    });
  }
  return delay(mockSecurityDetail);
}

export async function getSecurityNews(isin: string): Promise<NewsItem[]> {
  // TODO: return apiFetch(`/api/security/${isin}/news`);
  const detail = mockHoldings.find(h => h.isin === isin);
  if (!detail) return delay([]);
  return delay(mockNewsItems.filter(n => n.security === detail.display_name));
}
