import { useQuery } from '@tanstack/react-query';
import { getGrowthAttribution } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
            <AreaChart data={data.series}>
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
              <Area type="monotone" dataKey="net_deployed_eur" name="Capital Invested" stackId="1" fill="hsl(var(--chart-1))" fillOpacity={0.6} stroke="hsl(var(--chart-1))" />
              <Area type="monotone" dataKey="market_gain_eur" name="Market Gain" stackId="1" fill="hsl(var(--chart-2))" fillOpacity={0.6} stroke="hsl(var(--chart-2))" />
              <Area type="monotone" dataKey="cumulative_income_eur" name="Income" stackId="1" fill="hsl(var(--chart-3))" fillOpacity={0.6} stroke="hsl(var(--chart-3))" />
            </AreaChart>
          </ResponsiveContainer>
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
