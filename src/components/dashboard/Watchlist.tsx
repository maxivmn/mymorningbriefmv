import { useQuery } from '@tanstack/react-query';
import { getWatchlist } from '@/services/future-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

function WatchlistSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function Watchlist() {
  const { data, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <WatchlistSkeleton />;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-primary" /> Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.items.map((item, i) => (
          <div key={i} className="border-b border-border/30 last:border-0 pb-2 last:pb-0 space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.display_name}</span>
              <div className="flex items-center gap-2 text-xs">
                {item.current_price_eur != null && (
                  <span className="font-mono">€{item.current_price_eur.toLocaleString()}</span>
                )}
                {item.price_change_7d_pct != null && (
                  <span className={cn("font-mono", item.price_change_7d_pct >= 0 ? "text-gain" : "text-loss")}>
                    {item.price_change_7d_pct >= 0 ? '+' : ''}{item.price_change_7d_pct.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.reason}</p>
            <p className="text-[10px] text-muted-foreground">Added {item.added_date}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
