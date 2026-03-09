import { useQuery } from '@tanstack/react-query';
import { getConcentration } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';

function hhiColor(hhi: number) {
  if (hhi < 1500) return 'text-gain';
  if (hhi < 2500) return 'text-warning';
  return 'text-loss';
}

function hhiLabel(hhi: number) {
  if (hhi < 1500) return 'Diversified';
  if (hhi < 2500) return 'Moderate';
  return 'Concentrated';
}

export function RiskConcentration() {
  const { data, isLoading } = useQuery({ queryKey: ['concentration'], queryFn: getConcentration });

  if (isLoading) return <ChartSkeleton />;
  if (!data) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" /> Risk Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Concentration */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Position Concentration</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Top 1', value: data.top_1_pct },
              { label: 'Top 3', value: data.top_3_pct },
              { label: 'Top 5', value: data.top_5_pct },
              { label: 'Top 10', value: data.top_10_pct },
            ].map(item => (
              <div key={item.label} className="rounded-md bg-muted/50 p-2 text-center">
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
                <p className="font-mono text-sm font-semibold">{item.value.toFixed(1)}%</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">Largest: {data.largest_position_name} ({data.largest_position_pct.toFixed(1)}%)</p>
        </div>

        {/* Sector Concentration */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sector Concentration</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">HHI {data.sector_hhi}</span>
            <Badge variant="outline" className={cn("text-[10px]", hhiColor(data.sector_hhi))}>{hhiLabel(data.sector_hhi)}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Largest: {data.largest_sector_name} ({data.largest_sector_pct.toFixed(1)}%)</p>
        </div>

        {/* Theme Concentration */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Theme Concentration</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">HHI {data.theme_hhi}</span>
            <Badge variant="outline" className={cn("text-[10px]", hhiColor(data.theme_hhi))}>{hhiLabel(data.theme_hhi)}</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Largest: {data.largest_theme_name} ({data.largest_theme_pct.toFixed(1)}%)</p>
        </div>
      </CardContent>
    </Card>
  );
}
