import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface DashboardInsightPlaceholderProps extends ComponentPropsWithoutRef<"button"> {
  /** Accessible name when `children` does not include visible text. */
  label?: string;
}

/**
 * Mimics PostHog’s empty dashboard slot (“add insight”).
 * Renders `<button>` so you can wire `onClick` → palette / modal.
 *
 * **`onClick` and other event props:** use this inside a Client Component (or a wrapper
 * marked `'use client'`). Server Components cannot serialise function props.
 */
export function DashboardInsightPlaceholder({
  label = "Add insight",
  className,
  children,
  type = "button",
  ...props
}: DashboardInsightPlaceholderProps) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "ph-dashboard-placeholder group text-left outline-none transition",
        "focus-visible:ring-2 focus-visible:ring-ph-brand focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children != null ? children : <span className="font-medium text-ph-subtle group-hover:text-ph-ink">{label}</span>}
    </button>
  );
}
