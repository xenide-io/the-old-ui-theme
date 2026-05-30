import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface DashboardWellProps extends ComponentPropsWithoutRef<"div"> {
  /** Passed through to inner div; merges with `.ph-dashboard-well` */
}

export function DashboardWell({ className, ...props }: DashboardWellProps) {
  return <div className={cn("ph-dashboard-well", className)} {...props} />;
}
