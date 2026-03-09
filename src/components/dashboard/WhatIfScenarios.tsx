import { useQuery } from '@tanstack/react-query';
import { getScenarios } from '@/services/future-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';

function ScenariosSkeleton() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-border/30">
              <CardContent className="p-3 space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WhatIfScenarios() {
  const { data, isLoading } = useQuery({
    queryKey: ['scenarios'],
    queryFn: getScenarios,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading || !data) return <ScenariosSkeleton />;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-primary" /> What-If Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.scenarios.map((s, i) => {
            const negative = s.portfolio_impact_eur < 0;
            return (
              <Card key={i} className="border-border/30">
                <CardContent className="p-3 space-y-1">
                  <p className="text-xs font-medium">{s.name}</p>
                  <p className={cn("font-mono text-lg font-bold", negative ? "text-loss" : "text-gain")}>
                    {negative ? '' : '+'}{s.portfolio_impact_eur.toLocaleString(undefined, { maximumFractionDigits: 0 })}€
                  </p>
                  <p className={cn("text-[11px]", negative ? "text-loss" : "text-gain")}>
                    {negative ? '' : '+'}{s.portfolio_impact_pct.toFixed(1)}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">Most exposed: {s.most_exposed_holding}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
