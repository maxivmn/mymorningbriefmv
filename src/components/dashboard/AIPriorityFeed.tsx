import { mockAIPriorityNews } from "@/lib/mock-data";
import { NewsCard } from "./NewsCard";
import { Sparkles } from "lucide-react";

export function AIPriorityFeed() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-warning" />
        <h3 className="text-base font-semibold">AI Priority Feed</h3>
        <span className="text-xs text-muted-foreground">Events that may impact your portfolio</span>
      </div>
      <div className="space-y-3">
        {mockAIPriorityNews.map(item => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
