// Central API service layer
// Supports live mode (real backend) and mock mode (local mock data)
// Uses exact API contract from API_CONTRACT.md

import type {
  PortfolioSummary, ValueHistoryResponse, HoldingsResponse, Holding,
  TwrResponse, ModifiedDietzResponse, AnnualSummaryResponse, AnnualSummaryRow,
  PositionReturnsResponse, ExposureResponse, ExposureRow, DrawdownResponse,
  DailyDigestResponse, SecurityNewsResponse, ThemeNewsResponse, NewsItem,
  AppSettings, HealthResponse,
} from './types';
import {
  mockPortfolioSummary, mockValueHistory, mockHoldings, mockTwr,
  mockModifiedDietz, mockAnnualSummary, mockPositionReturns,
  mockSectorExposure, mockThemeExposure, mockStrategyExposure, mockCountryExposure,
  mockDrawdown, mockDailyDigest, mockSecurityNews, mockThemeNews,
} from './mock-data';

const DEFAULT_SETTINGS: AppSettings = {
  apiBaseUrl: 'http://localhost:8000',
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

// Live API fetch
async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const { apiBaseUrl } = getSettings();
  const url = new URL(path, apiBaseUrl);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

function isMock(): boolean {
  return getSettings().useMockData;
}

// --- API functions ---

export async function checkHealth(): Promise<HealthResponse> {
  return apiFetch('/api/health');
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  if (isMock()) return delay(mockPortfolioSummary);
  return apiFetch('/api/portfolio/summary');
}

export async function getPortfolioValueHistory(): Promise<ValueHistoryResponse> {
  if (isMock()) return delay(mockValueHistory);
  return apiFetch('/api/portfolio/value-history');
}

export async function getLatestHoldings(): Promise<HoldingsResponse> {
  if (isMock()) return delay(mockHoldings);
  return apiFetch('/api/holdings/latest');
}

export async function getTwr(): Promise<TwrResponse> {
  if (isMock()) return delay(mockTwr);
  return apiFetch('/api/performance/twr');
}

export async function getModifiedDietz(startDate?: string, endDate?: string): Promise<ModifiedDietzResponse> {
  if (isMock()) return delay(mockModifiedDietz);
  const params: Record<string, string> = {};
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  return apiFetch('/api/performance/modified-dietz', params);
}

export async function getAnnualSummary(): Promise<AnnualSummaryResponse> {
  if (isMock()) return delay(mockAnnualSummary);
  return apiFetch('/api/performance/annual-summary');
}

export async function getPositionReturns(): Promise<PositionReturnsResponse> {
  if (isMock()) return delay(mockPositionReturns);
  return apiFetch('/api/performance/position-returns');
}

export async function getExposureBySector(): Promise<ExposureResponse> {
  if (isMock()) return delay(mockSectorExposure);
  return apiFetch('/api/exposure/sector/latest');
}

export async function getExposureByTheme(): Promise<ExposureResponse> {
  if (isMock()) return delay(mockThemeExposure);
  return apiFetch('/api/exposure/theme/latest');
}

export async function getExposureByStrategy(): Promise<ExposureResponse> {
  if (isMock()) return delay(mockStrategyExposure);
  return apiFetch('/api/exposure/strategy/latest');
}

export async function getExposureByCountry(): Promise<ExposureResponse> {
  if (isMock()) return delay(mockCountryExposure);
  return apiFetch('/api/exposure/country/latest');
}

export async function getDrawdown(): Promise<DrawdownResponse> {
  if (isMock()) return delay(mockDrawdown);
  return apiFetch('/api/risk/drawdown');
}

export async function getDailyDigest(date?: string): Promise<DailyDigestResponse> {
  if (isMock()) return delay(mockDailyDigest);
  const params: Record<string, string> = {};
  if (date) params.date = date;
  return apiFetch('/api/news/daily-digest', params);
}

export async function getNewsBySecurity(isin: string): Promise<SecurityNewsResponse> {
  if (isMock()) return delay({ ...mockSecurityNews, isin, display_name: isin });
  return apiFetch('/api/news/by-security', { isin });
}

export async function getNewsByTheme(theme: string): Promise<ThemeNewsResponse> {
  if (isMock()) return delay({ ...mockThemeNews, theme });
  return apiFetch('/api/news/by-theme', { theme });
}
