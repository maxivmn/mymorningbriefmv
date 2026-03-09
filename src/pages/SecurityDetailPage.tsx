import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLatestHoldings, getNewsBySecurity, getPositionReturns } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ArrowLeft, DollarSign, TrendingUp, BarChart3, Tag, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function SecurityDetailPage() {
  const { isin } = useParams<{ isin: string }>();

  const { data: holdingsResp, isLoading: loadingHoldings } = useQuery({
    queryKey: ['holdings'],
    queryFn: getLatestHoldings,
  });

  const { data: posReturns } = useQuery({
    queryKey: ['position-returns'],
    queryFn: getPositionReturns,
  });

  const { data: newsResp } = useQuery({
    queryKey: ['security-news', isin],
    queryFn: () => getNewsBySecurity(isin!),
    enabled: !!isin,
  });

  const holding = holdingsResp?.holdings.find(h => h.isin === isin);
  const posReturn = posReturns?.positions.find(p => p.isin === isin);
  const news = newsResp?.items ?? [];

  if (loadingHoldings) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4"><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></div>
      </div>
    );
  }

  if (!holding) return <EmptyState title="Security not found" description={`No holding found with ISIN ${isin}`} />;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Link to="/holdings">
          <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{holding.display_name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{holding.isin}</p>
          {holding.broker_name && <p className="text-xs text-muted-foreground truncate max-w-md">{holding.broker_name}</p>}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Position Value" value={`€${holding.position_value_eur.toLocaleString()}`} icon={<DollarSign className="h-3.5 w-3.5" />} />
        <KpiCard label="Weight" value={`${holding.pct_of_portfolio?.toFixed(2) ?? '—'}%`} icon={<BarChart3 className="h-3.5 w-3.5" />} />
        <KpiCard
          label="Unrealized"
          value={posReturn?.unrealized_pct != null ? `${posReturn.unrealized_pct >= 0 ? '+' : ''}${posReturn.unrealized_pct.toFixed(2)}%` : '—'}
          subtitle={posReturn?.unrealized_eur != null ? `€${posReturn.unrealized_eur.toFixed(2)}` : undefined}
          trend={posReturn?.unrealized_pct != null ? (posReturn.unrealized_pct >= 0 ? 'positive' : 'negative') : undefined}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
        />
        <KpiCard
          label="Quantity"
          value={holding.quantity?.toFixed(4) ?? '—'}
          icon={<Tag className="h-3.5 w-3.5" />}
          subtitle={posReturn?.cost_basis_eur != null ? `Cost basis: €${posReturn.cost_basis_eur.toLocaleString()}` : 'No cost data'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Classification */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Sector', value: holding.sector },
              { label: 'Country', value: holding.country },
              { label: 'Region', value: holding.region },
              { label: 'Asset Class', value: holding.asset_class },
              { label: 'Price', value: holding.price_per_unit != null ? `€${holding.price_per_unit.toFixed(2)}` : null },
              { label: 'Price Date', value: holding.price_date },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <Badge variant="outline" className="text-xs">{row.value ?? '—'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notes / Thesis */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Investment Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground/50 italic">No notes yet — thesis and notes will be editable in a future version.</p>
            <div className="mt-4 rounded-lg border border-dashed border-border/50 p-4 text-center">
              <Sparkles className="h-5 w-5 text-muted-foreground/50 mx-auto mb-1" />
              <p className="text-xs text-muted-foreground/50">Performance contribution placeholder</p>
              <p className="text-[10px] text-muted-foreground/40">Will be populated when backend analytics are connected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related News */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Related News</CardTitle>
          {newsResp?.note && <Badge variant="secondary" className="text-[10px]">Placeholder</Badge>}
        </CardHeader>
        <CardContent className="space-y-3">
          {news.length === 0 ? (
            <EmptyState title="No news available" description="Live news feed not yet connected for this security." />
          ) : (
            news.map(item => (
              <div key={item.id} className="rounded-lg border border-border/50 p-3 space-y-1.5 hover:bg-muted/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{item.headline}</p>
                  <Badge variant="outline" className={cn(
                    "text-[10px] shrink-0",
                    item.sentiment === 'positive' && "border-gain/30 text-gain",
                    item.sentiment === 'negative' && "border-loss/30 text-loss",
                  )}>
                    {item.sentiment}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {item.source} · {format(parseISO(item.published_at), 'MMM d, HH:mm')}
                </p>
                {item.summary && (
                  <p className="text-xs text-muted-foreground">{item.summary}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
