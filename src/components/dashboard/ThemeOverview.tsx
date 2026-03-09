import { useQuery } from '@tanstack/react-query';
import { getThemeDetail } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { ChevronDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeDetail } from '@/services/types';

function ThemeCard({ theme }: { theme: ThemeDetail }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between rounded-md px-3 py-2.5 hover:bg-muted/50 transition-colors group">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{theme.theme_name}</span>
            <span className="text-[11px] text-muted-foreground">{theme.holding_count} holdings</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(theme.weight_pct, 100)}%` }} />
            </div>
            <span className="font-mono text-xs w-14 text-right">{theme.weight_pct.toFixed(1)}%</span>
            <span className="font-mono text-[11px] text-muted-foreground w-20 text-right">€{theme.value_eur.toLocaleString()}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-2 ml-3 border-l border-border/50 space-y-1">
          {theme.top_holdings.map(h => (
            <div key={h.display_name} className="flex items-center justify-between text-xs py-1 text-muted-foreground">
              <span>{h.display_name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono">{h.weight_in_theme_pct.toFixed(1)}% of theme</span>
                <span className="font-mono">€{h.value_eur.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function ThemeOverview() {
  const { data, isLoading } = useQuery({ queryKey: ['theme-detail'], queryFn: getThemeDetail });

  if (isLoading) return <ChartSkeleton />;
  if (!data) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" /> Theme Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5">
        {data.themes.map(t => <ThemeCard key={t.theme_name} theme={t} />)}
      </CardContent>
    </Card>
  );
}
