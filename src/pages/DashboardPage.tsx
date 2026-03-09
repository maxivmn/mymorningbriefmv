import { useQuery } from '@tanstack/react-query';
import {
  getPortfolioSummary, getLatestHoldings, getDailyDigest,
  getExposureByStrategy, getExposureByTheme, getTwr, getModifiedDietz,
  getDrawdown, getPositionReturns,
} from '@/services/api';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Activity, BarChart3, Sparkles, ArrowDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });
  const { data: holdingsResp, isLoading: loadingHoldings } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const { data: digest, isLoading: loadingDigest } = useQuery({ queryKey: ['daily-digest'], queryFn: () => getDailyDigest() });
  const { data: strategyExposure } = useQuery({ queryKey: ['exposure-strategy'], queryFn: getExposureByStrategy });
  const { data: themeExposure } = useQuery({ queryKey: ['exposure-theme'], queryFn: getExposureByTheme });
  const { data: twr } = useQuery({ queryKey: ['twr'], queryFn: getTwr });
  const { data: dietz } = useQuery({ queryKey: ['modified-dietz'], queryFn: () => getModifiedDietz() });
  const { data: drawdown } = useQuery({ queryKey: ['drawdown'], queryFn: getDrawdown });
  const { data: posReturns } = useQuery({ queryKey: ['position-returns'], queryFn: getPositionReturns });

  const holdings = holdingsResp?.holdings ?? [];

  // Top movers by absolute unrealized %
  const topMovers = posReturns
    ? [...posReturns.positions]
        .filter(p => p.unrealized_pct !== null)
        .sort((a, b) => Math.abs(b.unrealized_pct!) - Math.abs(a.unrealized_pct!))
        .slice(0, 5)
    : [];

  // Top holdings by weight
  const topHoldings = [...holdings].sort((a, b) => (b.pct_of_portfolio ?? 0) - (a.pct_of_portfolio ?? 0)).slice(0, 5);

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-4 md:p-6">
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

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* Allocation overview */}
            <div className="grid gap-4 md:grid-cols-2">
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

              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" /> Top Themes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {themeExposure?.rows.slice(0, 5).map(e => (
                    <div key={e.group_name} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{e.group_name}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-chart-2" style={{ width: `${e.weight_pct}%` }} />
                        </div>
                        <span className="font-mono text-xs w-12 text-right">{e.weight_pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Morning Digest */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-warning" /> Morning Digest
                  {digest && <Badge variant="outline" className="text-[10px]">{digest.date}</Badge>}
                  {digest?.note && <Badge variant="secondary" className="text-[10px]">Placeholder</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingDigest ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />)}
                  </div>
                ) : digest?.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No digest items available.</p>
                ) : digest?.items.map((item) => (
                  <div key={item.id} className="rounded-lg border border-border/50 p-3 space-y-1.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{item.headline}</p>
                      <Badge variant="outline" className={cn(
                        "text-[10px] shrink-0",
                        item.sentiment === 'positive' && "border-gain/30 text-gain",
                        item.sentiment === 'negative' && "border-loss/30 text-loss",
                      )}>
                        {item.sentiment}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>{item.source}</span>
                      {item.ticker_symbol && <><span>·</span><span className="font-mono">{item.ticker_symbol}</span></>}
                      {item.category !== 'system' && <><span>·</span><span>{item.category}</span></>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Biggest Movers Explained */}
            {topMovers.length > 0 && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-2" /> Biggest Movers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topMovers.map(p => (
                    <Link
                      key={p.isin}
                      to={p.isin ? `/security/${p.isin}` : '#'}
                      className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <span className="font-medium">{p.display_name}</span>
                        {p.cost_basis_eur != null && (
                          <span className="ml-2 text-[11px] text-muted-foreground">
                            Cost €{p.cost_basis_eur.toLocaleString()} → €{p.current_value_eur.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {p.unrealized_eur != null && (
                          <span className={cn("text-xs font-mono", p.unrealized_eur >= 0 ? "text-gain" : "text-loss")}>
                            {p.unrealized_eur >= 0 ? '+' : ''}€{p.unrealized_eur.toFixed(2)}
                          </span>
                        )}
                        <span className={cn(
                          "font-mono text-sm font-semibold",
                          (p.unrealized_pct ?? 0) >= 0 ? "text-gain" : "text-loss"
                        )}>
                          {(p.unrealized_pct ?? 0) >= 0 ? '+' : ''}{p.unrealized_pct?.toFixed(1)}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
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

            {/* Latest News Quick */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Latest News</CardTitle>
                  <Link to="/news" className="text-[11px] text-primary hover:underline">View all →</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {digest?.items.slice(0, 3).map((item) => (
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

            {/* Portfolio composition */}
            {summary && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Positions</span>
                    <span className="font-mono">{summary.position_count}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-mono">€{summary.total_value_eur.toLocaleString()}</span>
                  </div>
                  {summary.diff_eur != null && summary.diff_eur !== 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reconciliation Δ</span>
                      <span className="font-mono text-warning">€{summary.diff_eur.toFixed(2)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
