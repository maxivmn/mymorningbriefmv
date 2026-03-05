import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react";
import { totalPortfolioValue, totalDailyChange, totalDailyChangePercent, performanceData, mockPositions } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

export function PortfolioOverview() {
  const isPositive = totalDailyChange >= 0;
  const topGainers = [...mockPositions].sort((a, b) => b.dailyChangePercent - a.dailyChangePercent).slice(0, 5);
  const topLosers = [...mockPositions].sort((a, b) => a.dailyChangePercent - b.dailyChangePercent).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Total Value
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">
              ${(totalPortfolioValue / 1000).toFixed(0)}k
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {isPositive ? <TrendingUp className="h-3.5 w-3.5 text-gain" /> : <TrendingDown className="h-3.5 w-3.5 text-loss" />}
              Daily P&L
            </div>
            <p className={cn("mt-1 font-mono text-2xl font-bold", isPositive ? "text-gain" : "text-loss")}>
              {isPositive ? '+' : ''}{totalDailyChangePercent.toFixed(2)}%
            </p>
            <p className={cn("font-mono text-xs", isPositive ? "text-gain" : "text-loss")}>
              {isPositive ? '+' : ''}${totalDailyChange.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              Positions
            </div>
            <p className="mt-1 font-mono text-2xl font-bold">{mockPositions.length}</p>
            <p className="text-xs text-muted-foreground">Top 40 tracked</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-gain" />
              YTD Return
            </div>
            <p className="mt-1 font-mono text-2xl font-bold text-gain">+12.4%</p>
            <p className="text-xs text-muted-foreground">vs S&P 500 +8.2%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} domain={['dataMin - 50000', 'dataMax + 50000']} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: 12 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-gain" /> Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {topGainers.map(p => (
              <div key={p.ticker} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
                <div>
                  <span className="font-mono font-semibold">{p.ticker}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.companyName}</span>
                </div>
                <span className="font-mono text-sm font-semibold text-gain">+{p.dailyChangePercent.toFixed(2)}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingDown className="h-4 w-4 text-loss" /> Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {topLosers.map(p => (
              <div key={p.ticker} className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
                <div>
                  <span className="font-mono font-semibold">{p.ticker}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{p.companyName}</span>
                </div>
                <span className="font-mono text-sm font-semibold text-loss">{p.dailyChangePercent.toFixed(2)}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
