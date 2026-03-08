import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function KpiCard({ label, value, subtitle, icon, trend, className }: KpiCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className={cn(
          "mt-1 font-mono text-2xl font-bold",
          trend === 'positive' && "text-gain",
          trend === 'negative' && "text-loss",
        )}>
          {value}
        </p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
