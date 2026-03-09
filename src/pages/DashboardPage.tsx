import { useQuery } from '@tanstack/react-query';
import {
  getPortfolioSummary, getLatestHoldings, getDailyDigest,
  getExposureByStrategy, getTwr, getModifiedDietz,
  getDrawdown,
} from '@/services/api';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Activity, ArrowDown, Calendar, BarChart3, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { BiggestMovers } from '@/components/dashboard/BiggestMovers';
import { PortfolioChangesCard } from '@/components/dashboard/PortfolioChanges';
import { GrowthAttribution } from '@/components/dashboard/GrowthAttribution';
import { ExposureDrift } from '@/components/dashboard/ExposureDrift';
import { ThemeOverview } from '@/components/dashboard/ThemeOverview';
import { RiskConcentration } from '@/components/dashboard/RiskConcentration';
import { PerformanceContribution } from '@/components/dashboard/PerformanceContribution';

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });
  const { data: holdingsResp, isLoading: loadingHoldings } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const { data: digest, isLoading: loadingDigest } = useQuery({ queryKey: ['daily-digest'], queryFn: () => getDailyDigest() });
  const { data: strategyExposure } = useQuery({ queryKey: ['exposure-strategy'], queryFn: getExposureByStrategy });
  const { data: twr } = useQuery({ queryKey: ['twr'], queryFn: getTwr });
  const { data: dietz } = useQuery({ queryKey: ['modified-dietz'], queryFn: () => getModifiedDietz() });
  const { data: drawdown } = useQuery({ queryKey: ['drawdown'], queryFn: getDrawdown });

  const holdings = holdingsResp?.holdings ?? [];
  const topHoldings = [...holdings].sort((a, b) => (b.pct_of_portfolio ?? 0) - (a.pct_of_portfolio ?? 0)).slice(0, 5);

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Morning Briefing</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {summary?.snapshot_date && (
              <Badge variant="outline" className="text-[10px] ml-2">Data as of {summary.snapshot_date}</Badge>
            )}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {loadingSummary ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <KpiCard
                label="Portfolio Value"
                value={summary ? `€${summary.total_value_eur.toLocaleString()}` : '—'}
                icon={<DollarSign className="h-3.5 w-3.5" />}
                subtitle={summary ? `${summary.position_count} positions` : undefined}
              />
              <KpiCard
                label="TWR"
                value={twr?.twr_pct != null ? `${twr.twr_pct > 0 ? '+' : ''}${twr.twr_pct.toFixed(2)}%` : '—'}
                trend={twr?.twr_pct != null ? (twr.twr_pct >= 0 ? 'positive' : 'negative') : undefined}
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                subtitle={twr ? `${twr.period_days} days` : undefined}
              />
              <KpiCard
                label="Modified Dietz"
                value={dietz?.return_pct != null ? `${dietz.return_pct > 0 ? '+' : ''}${dietz.return_pct.toFixed(2)}%` : '—'}
                trend={dietz?.return_pct != null ? (dietz.return_pct >= 0 ? 'positive' : 'negative') : undefined}
                icon={<Activity className="h-3.5 w-3.5" />}
                subtitle="Money-weighted return"
              />
              <KpiCard
                label="Max Drawdown"
                value={drawdown ? `${drawdown.max_drawdown_pct.toFixed(2)}%` : '—'}
                trend="negative"
                icon={<ArrowDown className="h-3.5 w-3.5" />}
                subtitle={drawdown ? `${drawdown.peak_date} → ${drawdown.trough_date}` : undefined}
              />
            </>
          )}
        </div>

        {/* Biggest Movers — most prominent */}
        <BiggestMovers />

        {/* Portfolio Changes */}
        <PortfolioChangesCard />

        {/* Growth Attribution — key chart */}
        <GrowthAttribution />

        {/* Two-column: Exposure Drift + Theme Overview / Risk / Contribution */}
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <ExposureDrift />
            <ThemeOverview />
            <PerformanceContribution />
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <RiskConcentration />

            {/* Strategy Buckets */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" /> Strategy Buckets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {strategyExposure?.rows.map(e => (
                  <div key={e.group_name} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{e.group_name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${e.weight_pct}%` }} />
                      </div>
                      <span className="font-mono text-xs w-12 text-right">{e.weight_pct.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Holdings */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Largest Positions</CardTitle>
                  <Link to="/holdings" className="text-[11px] text-primary hover:underline">View all →</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                {loadingHoldings ? (
                  <div className="space-y-2">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}</div>
                ) : topHoldings.map(h => (
                  <Link
                    key={h.isin}
                    to={`/security/${h.isin}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{h.display_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">€{h.position_value_eur.toLocaleString()}</span>
                      <span className="font-mono text-xs w-12 text-right">{h.pct_of_portfolio?.toFixed(1)}%</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Morning Digest preview */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-warning" /> Morning Digest
                  </CardTitle>
                  <Link to="/news" className="text-[11px] text-primary hover:underline">View all →</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {loadingDigest ? (
                  <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
                ) : digest?.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-xs space-y-0.5">
                    <p className="font-medium leading-tight">{item.headline}</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1 py-0",
                        item.sentiment === 'positive' && "border-gain/30 text-gain",
                        item.sentiment === 'negative' && "border-loss/30 text-loss",
                      )}>
                        {item.sentiment}
                      </Badge>
                      <span>{item.source}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
