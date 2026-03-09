import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExposureDrift } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DIMENSIONS = ['sector', 'country', 'theme', 'strategy', 'asset_class', 'region'] as const;
const COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))',
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(217, 50%, 45%)',
  'hsl(280, 40%, 50%)', 'hsl(38, 60%, 45%)',
];

export function ExposureDrift() {
  const [dimension, setDimension] = useState<string>('sector');
  const { data, isLoading } = useQuery({
    queryKey: ['exposure-drift', dimension],
    queryFn: () => getExposureDrift(dimension),
  });

  // Flatten data for recharts: one row per snapshot_date, one key per group_name
  const allGroups = new Set<string>();
  data?.snapshots.forEach(s => s.groups.forEach(g => allGroups.add(g.group_name)));
  const groupNames = Array.from(allGroups);

  const chartData = data?.snapshots.map(s => {
    const row: Record<string, unknown> = { snapshot_date: s.snapshot_date };
    s.groups.forEach(g => { row[g.group_name] = g.weight_pct; });
    return row;
  }) ?? [];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Exposure Drift</CardTitle>
          <div className="flex gap-1">
            {DIMENSIONS.map(d => (
              <button
                key={d}
                onClick={() => setDimension(d)}
                className={`px-2 py-0.5 text-[10px] rounded-md transition-colors ${
                  dimension === d
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[280px] bg-muted animate-pulse rounded-md" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="snapshot_date"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              />
              <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 11 }}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              {groupNames.map((name, i) => (
                <Area
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stackId="1"
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.6}
                  stroke={COLORS[i % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
