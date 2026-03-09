// API functions for future endpoints.
// Returns null on 404/503 (graceful skeleton fallback), throws on other errors.

import type {
  MorningBriefingResponse, MacroResponse, AttributionResponse,
  StrategySignalsResponse, ScenariosResponse, WatchlistResponse,
  ResearchNotesResponse,
} from './future-types';

function getBaseUrl(): string {
  try {
    const stored = localStorage.getItem('app_settings');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.apiBaseUrl) return parsed.apiBaseUrl;
    }
  } catch { /* ignore */ }
  return 'http://localhost:8000';
}

function isMock(): boolean {
  try {
    const stored = localStorage.getItem('app_settings');
    if (stored) return JSON.parse(stored).useMockData === true;
  } catch { /* ignore */ }
  return true;
}

async function gracefulFetch<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  if (isMock()) return null; // No mock data for future endpoints — show skeleton

  const base = getBaseUrl();
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    });
  }

  try {
    const res = await fetch(url.toString());
    if (res.status === 404 || res.status === 503) return null;
    if (!res.ok) return null; // graceful — never show errors for future endpoints
    return res.json();
  } catch {
    return null; // network error — show skeleton
  }
}

export async function getMorningBriefing(): Promise<MorningBriefingResponse | null> {
  return gracefulFetch('/api/briefing/morning');
}

export async function getMacroIndicators(): Promise<MacroResponse | null> {
  return gracefulFetch('/api/macro/indicators');
}

export async function getAttribution(dimension: string): Promise<AttributionResponse | null> {
  return gracefulFetch('/api/performance/attribution', { dimension });
}

export async function getStrategySignals(): Promise<StrategySignalsResponse | null> {
  return gracefulFetch('/api/strategies/signals');
}

export async function getScenarios(): Promise<ScenariosResponse | null> {
  return gracefulFetch('/api/scenarios/impact');
}

export async function getWatchlist(): Promise<WatchlistResponse | null> {
  return gracefulFetch('/api/watchlist');
}

export async function getResearchNotes(isin: string): Promise<ResearchNotesResponse | null> {
  return gracefulFetch('/api/research/notes', { isin });
}
