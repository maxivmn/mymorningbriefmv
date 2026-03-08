import { useQuery } from '@tanstack/react-query';
import { getPortfolioSummary, getLatestHoldings, getDailyDigest, getExposureByStrategy, getExposureByTheme } from '@/services/api';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Activity, BarChart3, Sparkles, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });
  const { data: holdings, isLoading: loadingHoldings } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const { data: digest, isLoading: loadingDigest } = useQuery({ queryKey: ['daily-digest'], queryFn: getDailyDigest });
  const { data: strategyExposure } = useQuery({ queryKey: ['exposure-strategy'], queryFn: getExposureByStrategy });
  const { data: themeExposure } = useQuery({ queryKey: ['exposure-theme'], queryFn: getExposureByTheme });

  const topMovers = holdings
    ? [...holdings].sort((a, b) => Math.abs(b.unrealized_pct) - Math.abs(a.unrealized_pct)).slice(0, 5)
    : [];

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Morning Briefing</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {loadingSummary ? (
            <>
              <KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
            </>
          ) : summary ? (
            <>
              <KpiCard label="Portfolio Value" value={`€${summary.portfolio_value_eur.toLocaleString()}`} icon={<DollarSign className="h-3.5 w-3.5" />} />
              <KpiCard label="TWR" value={`${summary.twr_pct > 0 ? '+' : ''}${summary.twr_pct.toFixed(1)}%`} trend={summary.twr_pct >= 0 ? 'positive' : 'negative'} icon={<TrendingUp className="h-3.5 w-3.5" />} subtitle="Time-weighted return" />
              <KpiCard label="Modified Dietz" value={`${summary.modified_dietz_pct > 0 ? '+' : ''}${summary.modified_dietz_pct.toFixed(1)}%`} trend={summary.modified_dietz_pct >= 0 ? 'positive' : 'negative'} icon={<Activity className="h-3.5 w-3.5" />} subtitle="Money-weighted return" />
              <KpiCard label="Max Drawdown" value={`${summary.max_drawdown_pct.toFixed(1)}%`} trend="negative" icon={<ArrowDown className="h-3.5 w-3.5" />} subtitle={`Unrealized: €${summary.total_unrealized_eur.toLocaleString()}`} />
            </>
          ) : null}
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
                  {strategyExposure?.map(e => (
                    <div key={e.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{e.label}</span>
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
                  {themeExposure?.slice(0, 5).map(e => (
                    <div key={e.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{e.label}</span>
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
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingDigest ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-md bg-muted animate-pulse" />)}
                  </div>
                ) : digest?.summary.map((item, i) => (
                  <div key={i} className="rounded-lg border border-border/50 p-3 space-y-1.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-tight">{item.headline}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          item.sentiment === 'positive' && "border-gain/30 text-gain",
                          item.sentiment === 'negative' && "border-loss/30 text-loss",
                        )}>
                          {item.sentiment}
                        </Badge>
                        {item.importance === 'high' && (
                          <Badge className="text-[10px] bg-warning/10 text-warning border-warning/30" variant="outline">
                            HIGH
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-medium">{item.security}</span>
                      <span>·</span>
                      <span>{item.theme}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.why_it_matters}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Top Movers */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-gain" /> Top Movers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {loadingHoldings ? (
                  <div className="space-y-2">{[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-muted animate-pulse rounded" />)}</div>
                ) : topMovers.map(h => (
                  <Link
                    key={h.isin}
                    to={`/security/${h.isin}`}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <span className="font-mono font-semibold">{h.display_name}</span>
                      <span className="ml-2 text-[11px] text-muted-foreground">{h.portfolio_weight_pct.toFixed(1)}%</span>
                    </div>
                    <span className={cn(
                      "font-mono text-sm font-semibold",
                      h.unrealized_pct >= 0 ? "text-gain" : "text-loss"
                    )}>
                      {h.unrealized_pct >= 0 ? '+' : ''}{h.unrealized_pct.toFixed(1)}%
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Returns overview */}
            {summary && (
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Returns Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: 'Unrealized', value: summary.total_unrealized_eur, positive: true },
                    { label: 'Realized', value: summary.total_realized_eur, positive: true },
                    { label: 'Dividends', value: summary.dividends_eur, positive: true },
                    { label: 'Interest', value: summary.interest_eur, positive: true },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-mono text-gain">+€{r.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-border/50 pt-2 flex items-center justify-between text-sm font-medium">
                    <span>Total Return</span>
                    <span className="font-mono text-gain">
                      +€{(summary.total_unrealized_eur + summary.total_realized_eur + summary.dividends_eur + summary.interest_eur).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Latest News Quick */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Latest News</CardTitle>
                  <Link to="/news" className="text-[11px] text-primary hover:underline">View all →</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {digest?.summary.slice(0, 3).map((item, i) => (
                  <div key={i} className="text-xs space-y-0.5">
                    <p className="font-medium leading-tight">{item.headline}</p>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Badge variant="outline" className={cn(
                        "text-[9px] px-1 py-0",
                        item.sentiment === 'positive' && "border-gain/30 text-gain",
                        item.sentiment === 'negative' && "border-loss/30 text-loss",
                      )}>
                        {item.sentiment}
                      </Badge>
                      <span>{item.security}</span>
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
