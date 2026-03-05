import { mockGlobalNews } from "@/lib/mock-data";
import { NewsCard } from "./NewsCard";
import { Globe } from "lucide-react";

export function GlobalMarketNews() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <h3 className="text-base font-semibold">Global Market News</h3>
        <span className="text-xs text-muted-foreground">Most important global developments</span>
      </div>
      <div className="space-y-3">
        {mockGlobalNews.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
