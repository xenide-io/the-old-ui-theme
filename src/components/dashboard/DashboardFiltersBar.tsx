import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Raised strip reminiscent of dashboard date-range / cohort / breakdown controls.
 * Pass pills or selects as children.
 */
export function DashboardFiltersBar({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-[var(--ph-radius-app)] border border-solid bg-ph-surface px-3 py-2 text-sm text-ph-subtle [border-color:var(--ph-border-control)]",
        "[box-shadow:var(--ph-chrome-inset-face-top),var(--ph-chrome-inset-face-bottom),var(--ph-shadow-elevation-3000)]",
        className,
      )}
      {...props}
    />
  );
}
