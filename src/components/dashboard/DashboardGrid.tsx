import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface DashboardGridProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Preset breakpoints: 1 col → md:2 cols → xl:3 (matches common insight grids).
   * Override with your own `className` if you need 4-up or single column.
   */
  preset?: "insights" | "dense";
}

const presetClass: Record<NonNullable<DashboardGridProps["preset"]>, string> = {
  insights: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
  dense: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export function DashboardGrid({
  preset = "insights",
  className,
  ...props
}: DashboardGridProps) {
  return <div className={cn(presetClass[preset], className)} {...props} />;
}
