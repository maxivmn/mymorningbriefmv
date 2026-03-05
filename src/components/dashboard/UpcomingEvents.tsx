import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mic, DollarSign, Landmark } from "lucide-react";
import { mockEvents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const typeConfig = {
  earnings: { icon: Mic, label: 'Earnings', className: 'bg-primary/15 text-primary border-primary/30' },
  macro: { icon: Calendar, label: 'Macro', className: 'bg-warning/15 text-warning border-warning/30' },
  dividend: { icon: DollarSign, label: 'Dividend', className: 'bg-gain/15 text-gain border-gain/30' },
  fed: { icon: Landmark, label: 'Fed', className: 'bg-loss/15 text-loss border-loss/30' },
};

export function UpcomingEvents() {
  const sorted = [...mockEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {sorted.map(event => {
          const config = typeConfig[event.type];
          const Icon = config.icon;
          const date = new Date(event.date);
          const daysUntil = Math.ceil((date.getTime() - Date.now()) / 86400000);

          return (
            <div key={event.id} className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-muted/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {daysUntil > 0 && <span className="ml-1">· in {daysUntil}d</span>}
                </p>
              </div>
              <Badge className={cn("border text-[10px]", config.className)}>{config.label}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
