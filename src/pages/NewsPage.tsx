import { useQuery } from '@tanstack/react-query';
import { getDailyDigest, getLatestHoldings, getExposureByTheme, getNewsBySecurity, getNewsByTheme } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import type { NewsItem } from '@/services/types';
import { format, parseISO } from 'date-fns';

function NewsItemCard({ item }: { item: NewsItem }) {
  return (
    <div className="rounded-lg border border-border/50 p-4 space-y-2 hover:bg-muted/30 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-tight">{item.headline}</p>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{item.source}</span>
            <span>·</span>
            <span>{format(parseISO(item.published_at), 'MMM d, HH:mm')}</span>
            {item.ticker_symbol && <><span>·</span><span className="font-mono">{item.ticker_symbol}</span></>}
          </div>
        </div>
        <Badge variant="outline" className={cn(
          "text-[10px] shrink-0",
          item.sentiment === 'positive' && "border-gain/30 text-gain",
          item.sentiment === 'negative' && "border-loss/30 text-loss",
        )}>
          {item.sentiment}
        </Badge>
      </div>
      {item.summary && (
        <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
      )}
      {item.category !== 'system' && (
        <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
      )}
    </div>
  );
}

export default function NewsPage() {
  const { data: digest, isLoading: loadingDigest } = useQuery({ queryKey: ['daily-digest'], queryFn: () => getDailyDigest() });
  const { data: holdingsResp } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const { data: themeExposure } = useQuery({ queryKey: ['exposure-theme'], queryFn: getExposureByTheme });
  const [search, setSearch] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');

  const holdings = holdingsResp?.holdings ?? [];
  const themes = themeExposure?.rows ?? [];

  // Filter digest items
  const filtered = useMemo(() => {
    const items = digest?.items ?? [];
    return items.filter(n => {
      const matchesSearch = n.headline.toLowerCase().includes(search.toLowerCase()) ||
        n.summary.toLowerCase().includes(search.toLowerCase());
      const matchesSentiment = sentimentFilter === 'all' || n.sentiment === sentimentFilter;
      return matchesSearch && matchesSentiment;
    });
  }, [digest, search, sentimentFilter]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">News Intelligence</h1>
        <p className="text-sm text-muted-foreground">Portfolio-relevant news and morning digest</p>
      </div>

      {/* Morning Digest */}
      {loadingDigest ? <ChartSkeleton className="h-[200px]" /> : digest && (
        <Card className="border-border/50 border-warning/20 bg-warning/[0.02]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-warning" /> Morning Digest — {digest.date}
              {digest.note && <Badge variant="secondary" className="text-[10px]">Placeholder</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {digest.items.length === 0 ? (
              <p className="text-sm text-muted-foreground">No digest items for today.</p>
            ) : digest.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-sm">
                <Badge variant="outline" className={cn(
                  "text-[10px] shrink-0 mt-0.5",
                  item.sentiment === 'positive' && "border-gain/30 text-gain",
                  item.sentiment === 'negative' && "border-loss/30 text-loss",
                )}>
                  {item.sentiment}
                </Badge>
                <div>
                  <p className="font-medium">{item.headline}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.source} · {item.summary}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search headlines..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sentiment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="all" className="text-xs">All News</TabsTrigger>
          <TabsTrigger value="holdings" className="text-xs">By Holding</TabsTrigger>
          <TabsTrigger value="themes" className="text-xs">By Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState title="No news found" description="News feed not yet connected — will populate once live data source is integrated." />
          ) : (
            filtered.map(item => <NewsItemCard key={item.id} item={item} />)
          )}
        </TabsContent>

        <TabsContent value="holdings" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">News grouped by current holdings. Select a holding to see related news.</p>
          <div className="flex flex-wrap gap-2">
            {holdings.slice(0, 10).map(h => (
              <Badge key={h.isin} variant="outline" className="text-xs cursor-pointer hover:bg-muted/50">
                {h.display_name}
              </Badge>
            ))}
          </div>
          <EmptyState title="News by security" description="Live news feed not yet connected. Holdings-specific news will appear here once the data source is integrated." />
        </TabsContent>

        <TabsContent value="themes" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">News grouped by portfolio themes. Themes ordered by portfolio weight.</p>
          <div className="flex flex-wrap gap-2">
            {themes.slice(0, 10).map(t => (
              <Badge key={t.group_name} variant="outline" className="text-xs cursor-pointer hover:bg-muted/50">
                {t.group_name} ({t.weight_pct.toFixed(1)}%)
              </Badge>
            ))}
          </div>
          <EmptyState title="News by theme" description="Live news feed not yet connected. Theme-specific news will appear here once the data source is integrated." />
        </TabsContent>
      </Tabs>

      {/* Future: Biggest Movers Explained */}
      <Card className="border-border/50 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">🔮 Coming Soon: Biggest Movers Explained</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            When a holding moves significantly, this section will show the likely reason, relevant headlines, linked sources,
            and why it matters to your portfolio. Designed for intelligent portfolio decision support.
          </p>
        </CardContent>
      </Card>

      {/* Future: Recommendation Layer */}
      <Card className="border-border/50 border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">🔮 Coming Soon: Portfolio Intelligence</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            What changed · Why it matters · What to monitor · Possible considerations.
            This is not automated trading — it is intelligent portfolio decision support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
