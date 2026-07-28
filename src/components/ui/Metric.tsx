import { type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface MetricProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  badge?: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
}

export function Metric({
  value,
  label,
  badge,
  trend,
  icon,
  className,
  ...props
}: MetricProps) {
  return (
    <div className={cn("ph-metric", className)} {...props}>
      <div className="ph-metric__header">
        {icon && <span className="ph-metric__icon">{icon}</span>}
        <span className="ph-metric__label">{label}</span>
        {badge && <span className="ph-metric__badge">{badge}</span>}
      </div>
      <div className="ph-metric__value">{value}</div>
      {trend && <div className="ph-metric__trend">{trend}</div>}
    </div>
  );
}

Metric.displayName = "Metric";
