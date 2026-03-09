import { useQuery } from '@tanstack/react-query';
import { getPortfolioChanges } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { cn } from '@/lib/utils';
import type { PortfolioChange } from '@/services/types';

const SECTION_CONFIG = [
  { key: 'new_positions' as const, label: 'New', variant: 'default' as const, className: 'bg-gain text-gain-foreground hover:bg-gain/90' },
  { key: 'closed_positions' as const, label: 'Closed', variant: 'default' as const, className: 'bg-loss text-loss-foreground hover:bg-loss/90' },
  { key: 'increased_positions' as const, label: 'Increased', variant: 'default' as const, className: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  { key: 'decreased_positions' as const, label: 'Decreased', variant: 'default' as const, className: 'bg-warning text-warning-foreground hover:bg-warning/90' },
] as const;

function ChangeRow({ change }: { change: PortfolioChange }) {
  return (
    <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors">
      <span className="font-medium">{change.display_name}</span>
      <div className="flex items-center gap-3 text-xs">
        {change.value_change_eur != null && (
          <span className={cn("font-mono", change.value_change_eur >= 0 ? "text-gain" : "text-loss")}>
            {change.value_change_eur >= 0 ? '+' : ''}€{change.value_change_eur.toFixed(2)}
          </span>
        )}
        {change.weight_to_pct != null && (
          <span className="text-muted-foreground font-mono">{change.weight_to_pct.toFixed(1)}%</span>
        )}
        {change.price_change_pct != null && (
          <span className={cn("font-mono", change.price_change_pct >= 0 ? "text-gain" : "text-loss")}>
            {change.price_change_pct >= 0 ? '+' : ''}{change.price_change_pct.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function PortfolioChangesCard() {
  const { data, isLoading } = useQuery({ queryKey: ['portfolio-changes'], queryFn: getPortfolioChanges });

  if (isLoading) return <ChartSkeleton />;
  if (!data) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          Portfolio Changes
          <Badge variant="outline" className="text-[10px]">{data.snap_from} → {data.snap_to}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {SECTION_CONFIG.map(({ key, label, className }) => {
          const items = data[key];
          if (!items || items.length === 0) return null;
          return (
            <div key={key} className="space-y-1">
              <Badge className={cn("text-[10px]", className)}>{label}</Badge>
              {items.map((c) => <ChangeRow key={c.display_name} change={c} />)}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
