import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InsightShellHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing widgets (menus, fullscreen, cohort badge). */
  actions?: ReactNode;
  className?: string;
}

export function InsightShellHeader({ title, subtitle, actions, className }: InsightShellHeaderProps) {
  return (
    <header className={cn("flex gap-3", actions != null ? "items-start justify-between" : "", className)}>
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold leading-snug text-ph-ink">{title}</h4>
        {subtitle != null ? <p className="mt-0.5 text-xs text-ph-mutedtext">{subtitle}</p> : null}
      </div>
      {actions != null ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
    </header>
  );
}
