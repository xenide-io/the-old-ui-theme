import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DashboardKpiCardProps extends ComponentPropsWithoutRef<"article"> {
  /** Upper label (tabular small caps styling via `.ph-stat-label`). */
  label: ReactNode;
  /** Main KPI value. */
  value: ReactNode;
  /** Supporting line beneath the value (Δ %, qualifier, etc.). */
  footer?: ReactNode;
  /** Optional decorative icon aligned with headline stats across the PostHog app. */
  icon?: ReactNode;
}

export function DashboardKpiCard({ label, value, footer, icon, className, children, ...props }: DashboardKpiCardProps) {
  return (
    <article className={cn("ph-stat", className)} {...props}>
      {icon != null ? <div className="mb-2 [&>svg]:h-7 [&>svg]:w-7">{icon}</div> : null}
      <div className="ph-stat-label">{label}</div>
      <div className="ph-stat-val">{value}</div>
      {footer != null ? <p className="mt-1 text-xs text-ph-subtle">{footer}</p> : null}
      {children}
    </article>
  );
}
