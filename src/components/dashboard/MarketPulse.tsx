import { useQuery } from '@tanstack/react-query';
import { getMacroIndicators } from '@/services/future-api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

function PulseSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="border-border/50 min-w-[140px] flex-shrink-0">
          <CardContent className="p-3 space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-3 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function MarketPulse() {
  const { data, isLoading } = useQuery({
    queryKey: ['macro-indicators'],
    queryFn: getMacroIndicators,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <PulseSkeleton />;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">Market Pulse</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {data.indicators.map(ind => (
          <Card key={ind.name} className="border-border/50 min-w-[140px] flex-shrink-0">
            <CardContent className="p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{ind.name}</p>
              <p className="font-mono text-sm font-semibold mt-0.5">{ind.value.toLocaleString()}</p>
              <p className={cn(
                "text-[11px] font-medium mt-0.5",
                ind.change_1d_pct >= 0 ? "text-gain" : "text-loss"
              )}>
                {ind.change_1d_pct >= 0 ? '+' : ''}{ind.change_1d_pct.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
