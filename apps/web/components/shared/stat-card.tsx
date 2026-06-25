"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardKPI } from "@/lib/types";
import { formatCurrencyCompact, formatNumber, formatPercent } from "@/lib/utils/format";

interface StatCardProps {
  kpi: DashboardKPI;
  className?: string;
  onClick?: () => void;
}

function formatKPIValue(value: number, unit: DashboardKPI["unit"]): string {
  switch (unit) {
    case "currency_aed":
      return formatCurrencyCompact(value, "AED");
    case "currency_inr":
      return formatCurrencyCompact(value, "INR");
    case "currency_usd":
      return formatCurrencyCompact(value, "USD");
    case "count":
      return formatNumber(value);
    case "percent":
      return formatPercent(value);
    case "days":
      return `${value.toFixed(1)}d`;
    default:
      return String(value);
  }
}

export function StatCard({ kpi, className, onClick }: StatCardProps) {
  const TrendIcon =
    kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;

  const trendColor = kpi.trendPositive
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-red-600 dark:text-red-400";

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-muted-foreground">{kpi.label ?? kpi.title}</p>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatKPIValue(kpi.value, kpi.unit)}
          </p>
          <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
            <TrendIcon className="h-4 w-4" />
            <span>{Math.abs(kpi.trendPercent).toFixed(1)}%</span>
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          vs {formatKPIValue(kpi.previousValue, kpi.unit)} last period
        </p>
      </CardContent>
    </Card>
  );
}
