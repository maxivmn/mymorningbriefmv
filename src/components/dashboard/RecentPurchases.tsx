import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recentPurchases, mockRecentPurchaseNews } from "@/lib/mock-data";
import { NewsCard } from "./NewsCard";
import { ShoppingCart, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function RecentPurchases() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4 text-primary" />
        <h3 className="text-base font-semibold">Recently Purchased Positions</h3>
        <span className="text-xs text-muted-foreground">Bought in 2025</span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
        {recentPurchases.map(pos => {
          const isUp = pos.dailyChangePercent >= 0;
          return (
            <Card key={pos.id} className="border-border/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold">{pos.ticker}</span>
                  <Badge variant="outline" className="text-[10px]">{pos.sector}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{pos.companyName}</p>
                <div className="mt-2 flex items-center gap-1">
                  {isUp ? <TrendingUp className="h-3 w-3 text-gain" /> : <TrendingDown className="h-3 w-3 text-loss" />}
                  <span className={cn("font-mono text-xs font-semibold", isUp ? "text-gain" : "text-loss")}>
                    {isUp ? '+' : ''}{pos.dailyChangePercent.toFixed(2)}%
                  </span>
                </div>
                {pos.notes && <p className="mt-1 text-[10px] text-muted-foreground italic">{pos.notes}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-3">
        {mockRecentPurchaseNews.map(item => (
          <NewsCard key={item.id} item={item} showTicker />
        ))}
      </div>
    </div>
  );
}
