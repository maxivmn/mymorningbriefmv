import { useQuery } from '@tanstack/react-query';
import { getAllNews, getDailyDigest } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Sparkles, ExternalLink } from 'lucide-react';
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
            {item.url !== '#' && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="outline" className={cn(
            "text-[10px]",
            item.sentiment === 'positive' && "border-gain/30 text-gain",
            item.sentiment === 'negative' && "border-loss/30 text-loss",
          )}>
            {item.sentiment}
          </Badge>
          <Badge variant="outline" className={cn(
            "text-[10px]",
            item.importance === 'high' && "border-warning/30 text-warning",
          )}>
            {item.importance}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="text-[10px]">{item.security}</Badge>
        <Badge variant="secondary" className="text-[10px]">{item.theme}</Badge>
        <Badge variant="secondary" className="text-[10px]">{item.sector}</Badge>
      </div>
      {item.why_it_matters && (
        <p className="text-xs text-muted-foreground leading-relaxed italic">
          💡 {item.why_it_matters}
        </p>
      )}
    </div>
  );
}

export default function NewsPage() {
  const { data: news, isLoading: loadingNews } = useQuery({ queryKey: ['all-news'], queryFn: getAllNews });
  const { data: digest, isLoading: loadingDigest } = useQuery({ queryKey: ['daily-digest'], queryFn: getDailyDigest });
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [importanceFilter, setImportanceFilter] = useState<string>('all');

  const sectors = useMemo(() => {
    if (!news) return [];
    return [...new Set(news.map(n => n.sector))].sort();
  }, [news]);

  const securities = useMemo(() => {
    if (!news) return [];
    return [...new Set(news.map(n => n.security))].sort();
  }, [news]);

  const themes = useMemo(() => {
    if (!news) return [];
    return [...new Set(news.map(n => n.theme))].sort();
  }, [news]);

  const filtered = useMemo(() => {
    if (!news) return [];
    return news.filter(n => {
      const matchesSearch = n.headline.toLowerCase().includes(search.toLowerCase()) ||
        n.security.toLowerCase().includes(search.toLowerCase()) ||
        n.theme.toLowerCase().includes(search.toLowerCase());
      const matchesSector = sectorFilter === 'all' || n.sector === sectorFilter;
      const matchesSentiment = sentimentFilter === 'all' || n.sentiment === sentimentFilter;
      const matchesImportance = importanceFilter === 'all' || n.importance === importanceFilter;
      return matchesSearch && matchesSector && matchesSentiment && matchesImportance;
    });
  }, [news, search, sectorFilter, sentimentFilter, importanceFilter]);

  // Group by security
  const groupedBySecurity = useMemo(() => {
    const groups: Record<string, NewsItem[]> = {};
    filtered.forEach(n => {
      if (!groups[n.security]) groups[n.security] = [];
      groups[n.security].push(n);
    });
    return groups;
  }, [filtered]);

  // Group by theme
  const groupedByTheme = useMemo(() => {
    const groups: Record<string, NewsItem[]> = {};
    filtered.forEach(n => {
      if (!groups[n.theme]) groups[n.theme] = [];
      groups[n.theme].push(n);
    });
    return groups;
  }, [filtered]);

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
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {digest.summary.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Badge variant="outline" className={cn(
                  "text-[10px] shrink-0 mt-0.5",
                  item.sentiment === 'positive' && "border-gain/30 text-gain",
                  item.sentiment === 'negative' && "border-loss/30 text-loss",
                )}>
                  {item.sentiment}
                </Badge>
                <div>
                  <p className="font-medium">{item.headline}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.security} · {item.why_it_matters}</p>
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
          <Input placeholder="Search headlines, securities, themes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sentiment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
        <Select value={importanceFilter} onValueChange={setImportanceFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Importance" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* News views */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="all" className="text-xs">All News</TabsTrigger>
          <TabsTrigger value="security" className="text-xs">By Security</TabsTrigger>
          <TabsTrigger value="theme" className="text-xs">By Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {loadingNews ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState title="No news found" description="Try adjusting your filters" />
          ) : (
            filtered.map(item => <NewsItemCard key={item.id} item={item} />)
          )}
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-6">
          {Object.entries(groupedBySecurity).map(([security, items]) => (
            <div key={security}>
              <h3 className="text-sm font-semibold mb-2">{security}</h3>
              <div className="space-y-2">{items.map(item => <NewsItemCard key={item.id} item={item} />)}</div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="theme" className="mt-4 space-y-6">
          {Object.entries(groupedByTheme).map(([theme, items]) => (
            <div key={theme}>
              <h3 className="text-sm font-semibold mb-2">{theme}</h3>
              <div className="space-y-2">{items.map(item => <NewsItemCard key={item.id} item={item} />)}</div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
