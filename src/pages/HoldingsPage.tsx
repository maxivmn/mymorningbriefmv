import { useQuery } from '@tanstack/react-query';
import { getLatestHoldings } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import type { Holding } from '@/services/types';

type SortKey = 'display_name' | 'position_value_eur' | 'pct_of_portfolio' | 'sector';

export default function HoldingsPage() {
  const { data: resp, isLoading } = useQuery({ queryKey: ['holdings'], queryFn: getLatestHoldings });
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('pct_of_portfolio');
  const [sortAsc, setSortAsc] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  const holdings = resp?.holdings ?? [];

  const sectors = useMemo(() => [...new Set(holdings.map(h => h.sector).filter(Boolean))].sort() as string[], [holdings]);
  const countries = useMemo(() => [...new Set(holdings.map(h => h.country).filter(Boolean))].sort() as string[], [holdings]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = useMemo(() => {
    return holdings
      .filter(h => {
        const matchesSearch = h.display_name.toLowerCase().includes(search.toLowerCase()) || h.isin.toLowerCase().includes(search.toLowerCase());
        const matchesSector = sectorFilter === 'all' || h.sector === sectorFilter;
        const matchesCountry = countryFilter === 'all' || h.country === countryFilter;
        return matchesSearch && matchesSector && matchesCountry;
      })
      .sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
        return sortAsc ? cmp : -cmp;
      });
  }, [holdings, search, sortKey, sortAsc, sectorFilter, countryFilter]);

  if (isLoading) return <div className="p-4 md:p-6"><TableSkeleton rows={10} /></div>;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Holdings</h1>
        <p className="text-sm text-muted-foreground">
          {resp?.position_count ?? 0} positions · €{resp?.total_value_eur?.toLocaleString() ?? '0'} · as of {resp?.snapshot_date}
        </p>
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
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                <TableHead className="text-right hidden sm:table-cell">Price (€)</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('position_value_eur')}>
                  <div className="flex items-center justify-end gap-1">Value (€) <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('pct_of_portfolio')}>
                  <div className="flex items-center justify-end gap-1">Weight <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('sector')}>
                  <div className="flex items-center gap-1">Sector <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden xl:table-cell">Country</TableHead>
                <TableHead className="hidden xl:table-cell">Region</TableHead>
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
                  <TableCell className="text-right font-mono text-sm">{h.quantity?.toFixed(2) ?? '—'}</TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell">{h.price_per_unit?.toFixed(2) ?? '—'}</TableCell>
                  <TableCell className="text-right font-mono text-sm">€{h.position_value_eur.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{h.pct_of_portfolio?.toFixed(2) ?? '—'}%</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-[10px]">{h.sector ?? '—'}</Badge>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{h.country ?? '—'}</TableCell>
                  <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{h.region ?? '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
