import { mockPortfolioNews } from "@/lib/mock-data";
import { NewsCard } from "./NewsCard";
import { Briefcase } from "lucide-react";

export function PortfolioNews() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-primary" />
        <h3 className="text-base font-semibold">Portfolio News</h3>
        <span className="text-xs text-muted-foreground">News about your holdings</span>
      </div>
      <div className="space-y-3">
        {mockPortfolioNews.map(item => (
          <NewsCard key={item.id} item={item} showTicker />
        ))}
      </div>
    </div>
  );
}
