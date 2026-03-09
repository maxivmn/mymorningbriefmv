import { useQuery } from '@tanstack/react-query';
import { getGrowthAttribution } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, Banknote, Wallet } from 'lucide-react';

export function GrowthAttribution() {
  const { data, isLoading } = useQuery({ queryKey: ['growth-attribution'], queryFn: getGrowthAttribution });

  if (isLoading) return <ChartSkeleton className="h-[350px] w-full" />;
  if (!data) return null;

  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Growth Attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data.series}>
              <defs>
                <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--gain))" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="hsl(var(--gain))" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="snapshot_date"
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                className="fill-muted-foreground"
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }}
                formatter={(value: number, name: string) => [`€${value.toLocaleString()}`, name]}
                labelFormatter={(v) => new Date(v).toLocaleDateString()}
              />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              {/* Base layer: Capital Invested */}
              <Area
                type="monotone"
                dataKey="net_deployed_eur"
                name="Capital Invested"
                stackId="stack"
                fill="url(#capitalGradient)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={1}
              />
              {/* Stacked on top: Market Gain (green, goes negative when underwater) */}
              <Area
                type="monotone"
                dataKey="market_gain_eur"
                name="Market Gain"
                stackId="stack"
                fill="url(#gainGradient)"
                stroke="hsl(var(--gain))"
                strokeWidth={1}
              />
              {/* Line overlay: Portfolio Value */}
              <Line
                type="monotone"
                dataKey="portfolio_value_eur"
                name="Portfolio Value"
                stroke="hsl(var(--foreground))"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground mt-2">
            Income (€{data.total_income_eur.toLocaleString()}) included in tooltip. When market gain is negative, portfolio is underwater.
          </p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Total Invested" value={`€${data.total_net_deployed_eur.toLocaleString()}`} icon={<DollarSign className="h-3.5 w-3.5" />} />
        <KpiCard
          label="Market Gain"
          value={`${data.total_market_gain_eur >= 0 ? '+' : ''}€${data.total_market_gain_eur.toLocaleString()}`}
          trend={data.total_market_gain_eur >= 0 ? 'positive' : 'negative'}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
        />
        <KpiCard label="Total Income" value={`€${data.total_income_eur.toLocaleString()}`} icon={<Banknote className="h-3.5 w-3.5" />} />
        <KpiCard label="Portfolio Value" value={`€${data.total_portfolio_value_eur.toLocaleString()}`} icon={<Wallet className="h-3.5 w-3.5" />} />
      </div>
    </div>
  );
}