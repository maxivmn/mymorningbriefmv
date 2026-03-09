import { useQuery } from '@tanstack/react-query';
import { getMovers } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import type { Mover, MoverPeriod } from '@/services/types';

function MoverCard({ mover, type }: { mover: Mover; type: 'winner' | 'loser' }) {
  const isPositive = mover.price_change_pct >= 0;
  return (
    <div className="rounded-lg border border-border/50 p-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium truncate">{mover.display_name}</span>
        <span className={cn(
          "font-mono text-sm font-semibold",
          isPositive ? "text-gain" : "text-loss"
        )}>
          {isPositive ? '+' : ''}{mover.price_change_pct.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{isPositive ? '+' : ''}€{mover.value_change_eur.toFixed(2)}</span>
        <span>{mover.pct_of_portfolio.toFixed(1)}% of portfolio</span>
      </div>
    </div>
  );
}

function PeriodSection({ period, prominent }: { period: MoverPeriod; prominent?: boolean }) {
  const hasWinners = period.winners.length > 0;
  const hasLosers = period.losers.length > 0;
  if (!hasWinners && !hasLosers) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {period.label}
          <Badge variant="outline" className="text-[10px]">{period.days}d</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-gain font-medium mb-2">
              <TrendingUp className="h-3 w-3" /> Winners
            </div>
            {period.winners.map(m => (
              <MoverCard key={m.display_name} mover={m} type="winner" />
            ))}
            {!hasWinners && <p className="text-xs text-muted-foreground">No winners</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-loss font-medium mb-2">
              <TrendingDown className="h-3 w-3" /> Losers
            </div>
            {period.losers.map(m => (
              <MoverCard key={m.display_name} mover={m} type="loser" />
            ))}
            {!hasLosers && <p className="text-xs text-muted-foreground">No losers</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BiggestMovers() {
  const { data, isLoading } = useQuery({ queryKey: ['movers'], queryFn: getMovers });

  if (isLoading) return <ChartSkeleton />;
  if (!data) return null;

  // Reorder: Past week first, then Since last snapshot, then Past month
  const weekPeriod = data.periods.find(p => p.label === "Past week");
  const snapPeriod = data.periods.find(p => p.label === "Since last snapshot");
  const monthPeriod = data.periods.find(p => p.label === "Past month");

  return (
    <div className="space-y-4">
      {weekPeriod && <PeriodSection period={weekPeriod} prominent />}
      {snapPeriod && <PeriodSection period={snapPeriod} />}
      {monthPeriod && <PeriodSection period={monthPeriod} />}
    </div>
  );
}
