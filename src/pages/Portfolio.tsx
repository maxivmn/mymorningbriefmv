import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Upload, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { mockPositions, totalPortfolioValue, type PortfolioPosition } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortKey = 'ticker' | 'positionValue' | 'portfolioWeight' | 'dailyChangePercent' | 'sector';

const sectors = ['Technology', 'Semiconductors', 'Healthcare', 'Financials', 'Consumer', 'ETF', 'Other'];

export default function Portfolio() {
  const [positions, setPositions] = useState<PortfolioPosition[]>(mockPositions);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('portfolioWeight');
  const [sortAsc, setSortAsc] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPosition, setNewPosition] = useState({
    ticker: '', companyName: '', shares: '', positionValue: '', sector: '', purchaseDate: '', notes: '',
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = positions
    .filter(p => p.ticker.toLowerCase().includes(search.toLowerCase()) || p.companyName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
      return sortAsc ? cmp : -cmp;
    });

  const handleAdd = () => {
    const value = parseFloat(newPosition.positionValue) || 0;
    const newPos: PortfolioPosition = {
      id: crypto.randomUUID(),
      ticker: newPosition.ticker.toUpperCase(),
      companyName: newPosition.companyName,
      shares: parseFloat(newPosition.shares) || 0,
      positionValue: value,
      portfolioWeight: Math.round((value / totalPortfolioValue) * 1000) / 10,
      sector: newPosition.sector || 'Other',
      purchaseDate: newPosition.purchaseDate || undefined,
      notes: newPosition.notes || undefined,
      dailyChange: 0,
      dailyChangePercent: 0,
    };
    setPositions(prev => [...prev, newPos]);
    setNewPosition({ ticker: '', companyName: '', shares: '', positionValue: '', sector: '', purchaseDate: '', notes: '' });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">{positions.length} positions · ${(totalPortfolioValue / 1000).toFixed(0)}k total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            Import PDF
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-3.5 w-3.5" />
                Add Position
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Position</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ticker</Label>
                    <Input placeholder="AAPL" value={newPosition.ticker} onChange={e => setNewPosition(p => ({ ...p, ticker: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input placeholder="Apple Inc." value={newPosition.companyName} onChange={e => setNewPosition(p => ({ ...p, companyName: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Shares</Label>
                    <Input type="number" placeholder="100" value={newPosition.shares} onChange={e => setNewPosition(p => ({ ...p, shares: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Position Value ($)</Label>
                    <Input type="number" placeholder="25000" value={newPosition.positionValue} onChange={e => setNewPosition(p => ({ ...p, positionValue: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sector</Label>
                    <Select value={newPosition.sector} onValueChange={v => setNewPosition(p => ({ ...p, sector: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select sector" /></SelectTrigger>
                      <SelectContent>
                        {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Purchase Date</Label>
                    <Input type="date" value={newPosition.purchaseDate} onChange={e => setNewPosition(p => ({ ...p, purchaseDate: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea placeholder="Optional notes..." value={newPosition.notes} onChange={e => setNewPosition(p => ({ ...p, notes: e.target.value }))} />
                </div>
                <Button onClick={handleAdd} disabled={!newPosition.ticker || !newPosition.companyName}>Add Position</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by ticker or company..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('ticker')}>
                  <div className="flex items-center gap-1">Ticker <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('positionValue')}>
                  <div className="flex items-center justify-end gap-1">Value <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('portfolioWeight')}>
                  <div className="flex items-center justify-end gap-1">Weight <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer text-right" onClick={() => handleSort('dailyChangePercent')}>
                  <div className="flex items-center justify-end gap-1">Daily <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
                <TableHead className="cursor-pointer hidden lg:table-cell" onClick={() => handleSort('sector')}>
                  <div className="flex items-center gap-1">Sector <ArrowUpDown className="h-3 w-3" /></div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(pos => {
                const isUp = pos.dailyChangePercent >= 0;
                return (
                  <TableRow key={pos.id}>
                    <TableCell className="font-mono font-bold">{pos.ticker}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{pos.companyName}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{pos.shares}</TableCell>
                    <TableCell className="text-right font-mono text-sm">${pos.positionValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{pos.portfolioWeight.toFixed(1)}%</TableCell>
                    <TableCell className="text-right">
                      <div className={cn("flex items-center justify-end gap-1 font-mono text-sm font-semibold", isUp ? "text-gain" : "text-loss")}>
                        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isUp ? '+' : ''}{pos.dailyChangePercent.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline" className="text-[10px]">{pos.sector}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
