import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAttribution } from '@/services/future-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIMENSIONS = ['sector', 'theme', 'strategy'] as const;

function AttributionSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-48" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PerformanceAttribution() {
  const [dimension, setDimension] = useState<string>('sector');

  const { data, isLoading } = useQuery({
    queryKey: ['attribution', dimension],
    queryFn: () => getAttribution(dimension),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <AttributionSkeleton />;

  const sorted = [...data.groups].sort((a, b) => b.gain_eur - a.gain_eur);
  const maxAbs = Math.max(...sorted.map(g => Math.abs(g.gain_eur)), 1);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Performance Attribution
          </CardTitle>
          <ToggleGroup type="single" value={dimension} onValueChange={v => v && setDimension(v)} size="sm">
            {DIMENSIONS.map(d => (
              <ToggleGroupItem key={d} value={d} className="text-xs capitalize px-3">{d}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <TooltipProvider>
          {sorted.map(g => {
            const positive = g.gain_eur >= 0;
            const barWidth = Math.max((Math.abs(g.gain_eur) / maxAbs) * 100, 2);
            return (
              <Tooltip key={g.group_name}>
                <TooltipTrigger asChild>
                  <div className="space-y-1 cursor-default">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{g.group_name}</span>
                      <span className={cn("font-mono font-medium", positive ? "text-gain" : "text-loss")}>
                        {positive ? '+' : ''}€{g.gain_eur.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded overflow-hidden">
                      <div
                        className={cn("h-full rounded", positive ? "bg-gain/70" : "bg-loss/70")}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  <p>Weight: {g.weight_pct.toFixed(1)}% · Contribution: {g.contribution_pct.toFixed(2)}%</p>
                  <p>Best: {g.best_holding} · Worst: {g.worst_holding}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
