import { useQuery } from '@tanstack/react-query';
import { getContribution } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export function PerformanceContribution() {
  const { data, isLoading } = useQuery({ queryKey: ['contribution'], queryFn: getContribution });

  if (isLoading) return <ChartSkeleton className="h-[350px] w-full" />;
  if (!data) return null;

  const sorted = [...data.positions]
    .filter(p => p.portfolio_contribution_pct != null)
    .sort((a, b) => (b.portfolio_contribution_pct ?? 0) - (a.portfolio_contribution_pct ?? 0));

  const nullPositions = data.positions.filter(p => p.portfolio_contribution_pct == null);

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Performance Contribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 32 + 40)}>
          <BarChart data={sorted} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} className="fill-muted-foreground" tickFormatter={(v) => `${v}%`} />
            <YAxis
              type="category"
              dataKey="display_name"
              tick={{ fontSize: 11 }}
              className="fill-muted-foreground"
              width={75}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Contribution']}
            />
            <Bar dataKey="portfolio_contribution_pct" radius={[0, 4, 4, 0]}>
              {sorted.map((entry, index) => (
                <Cell
                  key={index}
                  fill={(entry.portfolio_contribution_pct ?? 0) >= 0 ? 'hsl(var(--gain))' : 'hsl(var(--loss))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {nullPositions.length > 0 && (
          <div className="mt-3 space-y-1">
            {nullPositions.map(p => (
              <div key={p.display_name} className="flex items-center justify-between text-xs text-muted-foreground px-2 py-1">
                <span>{p.display_name}</span>
                <span className="italic">No cost basis</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
