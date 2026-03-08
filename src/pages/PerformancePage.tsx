import { useQuery } from '@tanstack/react-query';
import { getPortfolioSummary, getPortfolioValueHistory, getAnnualSummary, getDrawdown } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Activity, ArrowDown, Banknote, PiggyBank } from 'lucide-react';

export default function PerformancePage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });
  const { data: history, isLoading: loadingHistory } = useQuery({ queryKey: ['portfolio-history'], queryFn: getPortfolioValueHistory });
  const { data: annual, isLoading: loadingAnnual } = useQuery({ queryKey: ['annual-summary'], queryFn: getAnnualSummary });
  const { data: drawdown } = useQuery({ queryKey: ['drawdown'], queryFn: getDrawdown });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">Returns, drawdowns, and annual summary</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
        {loadingSummary ? (
          <>{[1,2,3,4,5,6].map(i => <KpiSkeleton key={i} />)}</>
        ) : summary ? (
          <>
            <KpiCard label="Portfolio Value" value={`€${summary.portfolio_value_eur.toLocaleString()}`} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <KpiCard label="TWR" value={`+${summary.twr_pct.toFixed(1)}%`} trend="positive" icon={<TrendingUp className="h-3.5 w-3.5" />} />
            <KpiCard label="Modified Dietz" value={`+${summary.modified_dietz_pct.toFixed(1)}%`} trend="positive" icon={<Activity className="h-3.5 w-3.5" />} />
            <KpiCard label="Max Drawdown" value={`${summary.max_drawdown_pct.toFixed(1)}%`} trend="negative" icon={<ArrowDown className="h-3.5 w-3.5" />} />
            <KpiCard label="Dividends" value={`€${summary.dividends_eur.toLocaleString()}`} icon={<PiggyBank className="h-3.5 w-3.5" />} subtitle="+ interest" />
            <KpiCard label="Realized" value={`€${summary.total_realized_eur.toLocaleString()}`} icon={<Banknote className="h-3.5 w-3.5" />} trend="positive" />
          </>
        ) : null}
      </div>

      {/* Portfolio Value Chart */}
      {loadingHistory ? <ChartSkeleton /> : history && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gDeployed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="snapshot_date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => v.slice(5, 7) + '/' + v.slice(2, 4)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number, name: string) => [`€${value.toLocaleString()}`, name === 'portfolio_value' ? 'Value' : name === 'net_deployed' ? 'Deployed' : 'Unrealized']} />
                  <Area type="monotone" dataKey="net_deployed" stroke="hsl(var(--muted-foreground))" strokeWidth={1} strokeDasharray="4 4" fill="url(#gDeployed)" />
                  <Area type="monotone" dataKey="portfolio_value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drawdown Chart */}
      {drawdown && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdown}>
                  <defs>
                    <linearGradient id="gDrawdown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--loss))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => v.slice(5, 7) + '/' + v.slice(2, 4)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} domain={['dataMin - 1', 0]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number) => [`${value.toFixed(1)}%`, 'Drawdown']} />
                  <Area type="monotone" dataKey="drawdown_pct" stroke="hsl(var(--loss))" strokeWidth={2} fill="url(#gDrawdown)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Annual Summary */}
      {loadingAnnual ? <ChartSkeleton className="h-[120px]" /> : annual && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Annual Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Start (€)</TableHead>
                  <TableHead className="text-right">End (€)</TableHead>
                  <TableHead className="text-right">New Money (€)</TableHead>
                  <TableHead className="text-right">Realized (€)</TableHead>
                  <TableHead className="text-right">Dividends (€)</TableHead>
                  <TableHead className="text-right">TWR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annual.map(row => (
                  <TableRow key={row.year}>
                    <TableCell className="font-mono font-bold">{row.year}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.start_value.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.end_value.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.new_money_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.realized_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.dividends_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm font-semibold text-gain">+{row.twr_pct.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
