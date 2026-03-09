import { useQuery } from '@tanstack/react-query';
import { getPortfolioSummary, getPortfolioValueHistory, getAnnualSummary, getDrawdown, getTwr, getModifiedDietz, getPositionReturns } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/shared/KpiCard';
import { KpiSkeleton, ChartSkeleton } from '@/components/shared/LoadingSkeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Activity, ArrowDown, Banknote, PiggyBank, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function PerformancePage() {
  const { data: summary, isLoading: loadingSummary } = useQuery({ queryKey: ['portfolio-summary'], queryFn: getPortfolioSummary });
  const { data: history, isLoading: loadingHistory } = useQuery({ queryKey: ['portfolio-history'], queryFn: getPortfolioValueHistory });
  const { data: annual, isLoading: loadingAnnual } = useQuery({ queryKey: ['annual-summary'], queryFn: getAnnualSummary });
  const { data: drawdown } = useQuery({ queryKey: ['drawdown'], queryFn: getDrawdown });
  const { data: twr } = useQuery({ queryKey: ['twr'], queryFn: getTwr });
  const { data: dietz } = useQuery({ queryKey: ['modified-dietz'], queryFn: () => getModifiedDietz() });
  const { data: posReturns } = useQuery({ queryKey: ['position-returns'], queryFn: getPositionReturns });

  // Compute income totals from annual summary
  const totalRealized = annual?.rows.reduce((s, r) => s + r.realized_eur, 0) ?? 0;
  const totalDividends = annual?.rows.reduce((s, r) => s + r.dividends_eur, 0) ?? 0;
  const totalInterest = annual?.rows.reduce((s, r) => s + r.interest_eur, 0) ?? 0;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        <p className="text-sm text-muted-foreground">Returns, drawdowns, and annual summary</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
        {loadingSummary ? (
          <>{[1, 2, 3, 4, 5, 6].map(i => <KpiSkeleton key={i} />)}</>
        ) : (
          <>
            <KpiCard label="Portfolio Value" value={summary ? `€${summary.total_value_eur.toLocaleString()}` : '—'} icon={<DollarSign className="h-3.5 w-3.5" />} />
            <KpiCard label="TWR" value={twr?.twr_pct != null ? `+${twr.twr_pct.toFixed(2)}%` : '—'} trend="positive" icon={<TrendingUp className="h-3.5 w-3.5" />} subtitle={twr ? `${twr.start_date} → ${twr.end_date}` : undefined} />
            <KpiCard label="Modified Dietz" value={dietz?.return_pct != null ? `+${dietz.return_pct.toFixed(2)}%` : '—'} trend="positive" icon={<Activity className="h-3.5 w-3.5" />} subtitle={dietz ? `€${dietz.begin_value_eur.toLocaleString()} → €${dietz.end_value_eur.toLocaleString()}` : undefined} />
            <KpiCard label="Max Drawdown" value={drawdown ? `${drawdown.max_drawdown_pct.toFixed(2)}%` : '—'} trend="negative" icon={<ArrowDown className="h-3.5 w-3.5" />} subtitle={drawdown ? `${drawdown.duration_days}d duration` : undefined} />
            <KpiCard label="Dividends + Interest" value={`€${(totalDividends + totalInterest).toFixed(2)}`} icon={<PiggyBank className="h-3.5 w-3.5" />} subtitle={`Div €${totalDividends.toFixed(0)} · Int €${totalInterest.toFixed(0)}`} />
            <KpiCard label="Realized Gains" value={`€${totalRealized.toFixed(2)}`} icon={<Banknote className="h-3.5 w-3.5" />} trend="positive" />
          </>
        )}
      </div>

      {/* Portfolio Value Chart */}
      {loadingHistory ? <ChartSkeleton /> : history && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Portfolio Value History
              <Badge variant="outline" className="ml-2 text-[10px]">{history.total_snapshots} snapshots</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.snapshots.map(s => ({ ...s, snapshot_date: new Date(s.snapshot_date).getTime() }))}>
                  <defs>
                    <linearGradient id="gValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="snapshot_date" type="number" scale="time" domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(ms) => new Date(ms).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number) => [`€${value.toLocaleString()}`, 'Value']} />
                  <Area type="monotone" dataKey="total_value_eur" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gValue)" />
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
            <CardTitle className="text-sm font-medium">
              Drawdown
              <Badge variant="outline" className="ml-2 text-[10px] text-loss border-loss/30">
                Max: {drawdown.max_drawdown_pct.toFixed(2)}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={drawdown.series.map(s => ({ ...s, snapshot_date: new Date(s.snapshot_date).getTime() }))}>
                  <defs>
                    <linearGradient id="gDrawdown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--loss))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--loss))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="snapshot_date" type="number" scale="time" domain={['dataMin', 'dataMax']} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(ms) => new Date(ms).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} domain={['dataMin - 1', 0]} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }} formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']} />
                  <Area type="monotone" dataKey="drawdown_pct" stroke="hsl(var(--loss))" strokeWidth={2} fill="url(#gDrawdown)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Position Returns */}
      {posReturns && (
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Position Returns (Unrealized P&L)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Cost Basis (€)</TableHead>
                  <TableHead className="text-right">Current (€)</TableHead>
                  <TableHead className="text-right">Unrealized (€)</TableHead>
                  <TableHead className="text-right">Unrealized (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posReturns.positions.map(p => (
                  <TableRow key={p.isin ?? p.display_name}>
                    <TableCell>
                      {p.isin ? (
                        <Link to={`/security/${p.isin}`} className="font-medium hover:text-primary transition-colors">{p.display_name}</Link>
                      ) : (
                        <span className="font-medium">{p.display_name}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{p.quantity?.toFixed(2) ?? '—'}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{p.cost_basis_eur != null ? `€${p.cost_basis_eur.toLocaleString()}` : '—'}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{p.current_value_eur.toLocaleString()}</TableCell>
                    <TableCell className={cn("text-right font-mono text-sm font-semibold", p.unrealized_eur != null ? (p.unrealized_eur >= 0 ? "text-gain" : "text-loss") : "")}>
                      {p.unrealized_eur != null ? `${p.unrealized_eur >= 0 ? '+' : ''}€${p.unrealized_eur.toFixed(2)}` : '—'}
                    </TableCell>
                    <TableCell className={cn("text-right font-mono text-sm font-semibold", p.unrealized_pct != null ? (p.unrealized_pct >= 0 ? "text-gain" : "text-loss") : "")}>
                      {p.unrealized_pct != null ? `${p.unrealized_pct >= 0 ? '+' : ''}${p.unrealized_pct.toFixed(2)}%` : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                  <TableHead className="text-right">Interest (€)</TableHead>
                  <TableHead className="text-right">Dividends (€)</TableHead>
                  <TableHead className="text-right">TWR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {annual.rows.map(row => (
                  <TableRow key={row.year}>
                    <TableCell className="font-mono font-bold">{row.year}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.start_value_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.end_value_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.new_money_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.realized_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.interest_eur.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">€{row.dividends_eur.toLocaleString()}</TableCell>
                    <TableCell className={cn("text-right font-mono text-sm font-semibold", row.twr_pct != null ? (row.twr_pct >= 0 ? "text-gain" : "text-loss") : "")}>
                      {row.twr_pct != null ? `${row.twr_pct >= 0 ? '+' : ''}${row.twr_pct.toFixed(2)}%` : '—'}
                    </TableCell>
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
