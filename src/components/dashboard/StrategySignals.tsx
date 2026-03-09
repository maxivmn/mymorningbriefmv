import { useQuery } from '@tanstack/react-query';
import { getStrategySignals } from '@/services/future-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

function SignalsSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-36" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const signalColor: Record<string, string> = {
  buy: 'border-gain/40 text-gain bg-gain/10',
  sell: 'border-loss/40 text-loss bg-loss/10',
  watch: 'border-warning/40 text-warning bg-warning/10',
};

export function StrategySignals() {
  const { data, isLoading } = useQuery({
    queryKey: ['strategy-signals'],
    queryFn: getStrategySignals,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <SignalsSkeleton />;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Strategy Signals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.signals.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-xs py-1.5 border-b border-border/30 last:border-0">
              <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">{s.strategy}</Badge>
              <span className="font-medium shrink-0">{s.display_name}</span>
              <Badge className={cn("text-[10px] px-1.5 shrink-0", signalColor[s.signal] || '')}>
                {s.signal.toUpperCase()}
              </Badge>
              <div className="w-16 shrink-0">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.strength * 100}%` }} />
                </div>
              </div>
              <span className="text-muted-foreground truncate">{s.reason}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
