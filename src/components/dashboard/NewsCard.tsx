import { ThumbsUp, ThumbsDown, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { NewsItem } from "@/lib/mock-data";

interface NewsCardProps {
  item: NewsItem;
  showTicker?: boolean;
  compact?: boolean;
}

export function NewsCard({ item, showTicker = false, compact = false }: NewsCardProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(item.rating || null);

  const sentimentColor = {
    positive: "bg-sentiment-positive/15 text-sentiment-positive border-sentiment-positive/30",
    neutral: "bg-sentiment-neutral/15 text-sentiment-neutral border-sentiment-neutral/30",
    negative: "bg-sentiment-negative/15 text-sentiment-negative border-sentiment-negative/30",
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className={cn("group border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md", compact && "p-3")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            {showTicker && item.ticker && (
              <Badge variant="outline" className="font-mono text-xs font-semibold">
                {item.ticker}
              </Badge>
            )}
            <Badge className={cn("border text-[10px] font-medium", sentimentColor[item.sentiment])}>
              {item.sentiment}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeAgo(item.publishedAt)}
            </span>
          </div>

          <h4 className={cn("mb-1 font-semibold leading-tight", compact ? "text-sm" : "text-sm md:text-base")}>
            {item.headline}
          </h4>

          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {item.summary}
          </p>

          {item.tags && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.tags.map(tag => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", rating === 'up' && "bg-gain/20 text-gain")}
            onClick={() => setRating(rating === 'up' ? null : 'up')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7", rating === 'down' && "bg-loss/20 text-loss")}
            onClick={() => setRating(rating === 'down' ? null : 'down')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
          <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{item.source}</span>
      </div>
    </Card>
  );
}
