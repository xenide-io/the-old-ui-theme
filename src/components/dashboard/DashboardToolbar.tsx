import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DashboardToolbarProps {
  /** Dashboard / tab title (matches PostHog H3 weight on canvases). */
  title: string;
  description?: string;
  /** Right-aligned actions slot (buttons, dropdown triggers, etc.). */
  actions?: ReactNode;
  className?: string;
}

export function DashboardToolbar({ title, description, actions, className }: DashboardToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-baseline justify-between gap-4", className)}>
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-ph-ink">{title}</h3>
        {description ? <p className="mt-0.5 text-sm text-ph-mutedtext">{description}</p> : null}
      </div>
      {actions != null ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
