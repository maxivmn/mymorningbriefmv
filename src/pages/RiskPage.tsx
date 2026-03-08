import { useQuery } from '@tanstack/react-query';
import { getExposureBySector, getExposureByCountry, getExposureByTheme, getExposureByStrategy, getExposureByAssetClass, getPortfolioSummary, getLatestHoldings } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ExposureRow } from '@/services/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = [
  'hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))',
  'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(var(--primary))',
  'hsl(var(--muted-foreground))', 'hsl(var(--warning))', 'hsl(var(--gain))',
];

function ExposureCard({ title, data, loading }: { title: string; data?: ExposureRow[]; loading: boolean }) {
  if (loading) return <ChartSkeleton className="h-[250px]" />;
  if (!data) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          <div className="h-[200px] w-[200px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="weight_pct" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={40} strokeWidth={2} stroke="hsl(var(--background))">
                  {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1.5 py-2">
            {data.map((e, i) => (
              <div key={e.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-muted-foreground truncate">{e.label}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">€{e.value_eur.toLocaleString()}</span>
                  <span className="font-mono text-xs font-medium w-12 text-right">{e.weight_pct.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RiskPage() {
  const { data: sectorData, isLoading: l1 } = useQuery({ queryKey: ['exposure-sector'], queryFn: getExposureBySector });
  const { data: countryData, isLoading: l2 } = useQuery({ queryKey: ['exposure-country'], queryFn: getExposureByCountry });
  const { data: themeData, isLoading: l3 } = useQuery({ queryKey: ['exposure-theme'], queryFn: getExposureByTheme });
  const { data: strategyData, isLoading: l4 } = useQuery({ queryKey: ['exposure-strategy'], queryFn: getExposureByStrategy });
  const { data: assetClassData, isLoading: l5 } = useQuery({ queryKey: ['exposure-asset-class'], queryFn: getExposureByAssetClass });
  const { data: holdings } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const { data: summary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });

  // Concentration analysis
  const topConcentration = holdings
    ? holdings.sort((a, b) => b.portfolio_weight_pct - a.portfolio_weight_pct).slice(0, 5)
    : [];
  const top5Weight = topConcentration.reduce((s, h) => s + h.portfolio_weight_pct, 0);

  // Cyclical vs Defensive
  const cyclicalSectors = ['Information Technology', 'Consumer Discretionary', 'Communication Services'];
  const cyclicalWeight = sectorData
    ? sectorData.filter(s => cyclicalSectors.includes(s.label)).reduce((sum, s) => sum + s.weight_pct, 0)
    : 0;
  const defensiveWeight = 100 - cyclicalWeight;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Risk & Exposure</h1>
        <p className="text-sm text-muted-foreground">Portfolio concentration and allocation analysis</p>
      </div>

      {/* Quick risk metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Max Drawdown</p>
            <p className="font-mono text-xl font-bold text-loss">{summary?.max_drawdown_pct.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Top 5 Concentration</p>
            <p className="font-mono text-xl font-bold">{top5Weight.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Cyclical</p>
            <p className="font-mono text-xl font-bold">{cyclicalWeight.toFixed(1)}%</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Defensive</p>
            <p className="font-mono text-xl font-bold">{defensiveWeight.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Exposure tabs */}
      <Tabs defaultValue="sector" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50">
          <TabsTrigger value="sector" className="text-xs">Sector</TabsTrigger>
          <TabsTrigger value="country" className="text-xs">Country</TabsTrigger>
          <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
          <TabsTrigger value="strategy" className="text-xs">Strategy</TabsTrigger>
          <TabsTrigger value="asset" className="text-xs">Asset Class</TabsTrigger>
        </TabsList>
        <TabsContent value="sector" className="mt-4"><ExposureCard title="Sector Exposure" data={sectorData} loading={l1} /></TabsContent>
        <TabsContent value="country" className="mt-4"><ExposureCard title="Country Exposure" data={countryData} loading={l2} /></TabsContent>
        <TabsContent value="theme" className="mt-4"><ExposureCard title="Theme Exposure" data={themeData} loading={l3} /></TabsContent>
        <TabsContent value="strategy" className="mt-4"><ExposureCard title="Strategy Bucket Exposure" data={strategyData} loading={l4} /></TabsContent>
        <TabsContent value="asset" className="mt-4"><ExposureCard title="Asset Class Exposure" data={assetClassData} loading={l5} /></TabsContent>
      </Tabs>

      {/* Concentration */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Concentration Analysis — Top 5 Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConcentration} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="display_name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Weight']} />
                <Bar dataKey="portfolio_weight_pct" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Thematic clusters */}
      {themeData && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thematic Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {themeData.map(t => (
                <Badge key={t.label} variant="outline" className={cn(
                  "text-xs px-3 py-1.5",
                  t.weight_pct > 15 && "border-primary/50 bg-primary/5 text-primary",
                  t.weight_pct > 10 && t.weight_pct <= 15 && "border-chart-2/50 bg-chart-2/5",
                )}>
                  {t.label} — {t.weight_pct.toFixed(1)}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
