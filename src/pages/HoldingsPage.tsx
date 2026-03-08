import { useQuery } from '@tanstack/react-query';
import { getLatestHoldings } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import type { Holding } from '@/services/types';

type SortKey = keyof Pick<Holding, 'display_name' | 'current_value' | 'portfolio_weight_pct' | 'unrealized_pct' | 'sector'>;

export default function HoldingsPage() {
  const { data: holdings, isLoading } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('portfolio_weight_pct');
  const [sortAsc, setSortAsc] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [strategyFilter, setStrategyFilter] = useState<string>('all');

  const sectors = useMemo(() => {
    if (!holdings) return [];
    return [...new Set(holdings.map(h => h.sector))].sort();
  }, [holdings]);

  const strategies = useMemo(() => {
    if (!holdings) return [];
    return [...new Set(holdings.map(h => h.strategy_bucket))].sort();
  }, [holdings]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = useMemo(() => {
    if (!holdings) return [];
    return holdings
      .filter(h => {
        const matchesSearch = h.display_name.toLowerCase().includes(search.toLowerCase()) || h.isin.toLowerCase().includes(search.toLowerCase());
        const matchesSector = sectorFilter === 'all' || h.sector === sectorFilter;
        const matchesStrategy = strategyFilter === 'all' || h.strategy_bucket === strategyFilter;
        return matchesSearch && matchesSector && matchesStrategy;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
        return sortAsc ? cmp : -cmp;
      });
  }, [holdings, search, sortKey, sortAsc, sectorFilter, strategyFilter]);

  if (isLoading) return <div className="p-4 md:p-6"><TableSkeleton rows={10} /></div>;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Holdings</h1>
        <p className="text-sm text-muted-foreground">{holdings?.length || 0} positions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or ISIN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Sector" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={strategyFilter} onValueChange={setStrategyFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Strategy" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strategies</SelectItem>
            {strategies.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('display_name')}>
                  <div className="flex items-center gap-1">Name <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">ISIN</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('current_value')}>
                  <div className="flex items-center justify-end gap-1">Value (€) <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('portfolio_weight_pct')}>
                  <div className="flex items-center justify-end gap-1">Weight <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('unrealized_pct')}>
                  <div className="flex items-center justify-end gap-1">Unrealized <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('sector')}>
                  <div className="flex items-center gap-1">Sector <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden xl:table-cell">Theme</TableHead>
                <TableHead className="hidden xl:table-cell">Strategy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(h => (
                <TableRow key={h.isin} className="group">
                  <TableCell>
                    <Link to={`/security/${h.isin}`} className="font-medium hover:text-primary transition-colors">
                      {h.display_name}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">{h.isin}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{h.quantity}</TableCell>
                  <TableCell className="text-right font-mono text-sm">€{h.current_value.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{h.portfolio_weight_pct.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">
                    <div className={cn("flex items-center justify-end gap-1 font-mono text-sm font-semibold", h.unrealized_pct >= 0 ? "text-gain" : "text-loss")}>
                      {h.unrealized_pct >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {h.unrealized_pct >= 0 ? '+' : ''}{h.unrealized_pct.toFixed(1)}%
                      <span className="text-[11px] font-normal ml-1 hidden sm:inline">
                        ({h.unrealized_eur >= 0 ? '+' : ''}€{h.unrealized_eur.toLocaleString()})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[10px]">{h.sector}</Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{h.primary_theme}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{h.strategy_bucket}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
