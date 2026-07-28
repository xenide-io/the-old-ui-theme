"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Sparkline } from "@/components/charts/quill/Sparkline";
import { Badge } from "@/components/ui/Badge";

export interface MetricCardProps {
  value: string | number;
  label: string;
  change?: { value: number; positive?: boolean };
  sparklineData?: number[];
  icon?: ReactNode;
  className?: string;
}

export function MetricCard({
  value,
  label,
  change,
  sparklineData,
  icon,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("ph-metric", className)}>
      <div className="ph-metric__header">
        {icon && <span className="ph-metric__icon">{icon}</span>}
        <span className="ph-metric__label">{label}</span>
        {change && (
          <Badge variant={change.positive ?? change.value >= 0 ? "success" : "danger"}>
            {change.value >= 0 ? "+" : ""}{change.value}%
          </Badge>
        )}
      </div>
      <div className="ph-metric__value">{value}</div>
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-2">
          <Sparkline data={sparklineData} />
        </div>
      )}
    </div>
  );
}
