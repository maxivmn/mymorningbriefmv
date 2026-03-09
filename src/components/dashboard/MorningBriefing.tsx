import { useQuery } from '@tanstack/react-query';
import { getMorningBriefing } from '@/services/future-api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sunrise, TrendingUp, TrendingDown, Eye, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

function BriefingSkeleton() {
  return (
    <Card className="border-border/50">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

export function MorningBriefing() {
  const { data, isLoading } = useQuery({
    queryKey: ['morning-briefing'],
    queryFn: getMorningBriefing,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <BriefingSkeleton />;

  const changePositive = data.day_change_eur >= 0;

  return (
    <Card className="border-border/50">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sunrise className="h-4 w-4 text-primary" />
          <span className="font-medium">Morning Briefing</span>
          <Badge variant="outline" className="text-[10px] ml-auto">{data.date}</Badge>
        </div>

        <div className="flex items-baseline gap-4">
          <span className="font-mono text-2xl font-bold">€{data.portfolio_value_eur.toLocaleString()}</span>
          <span className={cn(
            "flex items-center gap-1 text-sm font-medium",
            changePositive ? "text-gain" : "text-loss"
          )}>
            {changePositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            {changePositive ? '+' : ''}{data.day_change_eur.toFixed(0)}€ ({changePositive ? '+' : ''}{data.day_change_pct.toFixed(2)}%)
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{data.summary_text}</p>

        {data.market_context && (
          <p className="text-xs text-muted-foreground italic">{data.market_context}</p>
        )}

        {data.watch_items.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {data.watch_items.map((item, i) => (
              <Badge key={i} variant="outline" className={cn(
                "text-[10px] gap-1",
                item.type === 'risk' && "border-loss/30 text-loss",
                item.type === 'event' && "border-primary/30 text-primary",
              )}>
                {item.type === 'risk' ? <AlertTriangle className="h-2.5 w-2.5" /> : <Eye className="h-2.5 w-2.5" />}
                {item.title}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
