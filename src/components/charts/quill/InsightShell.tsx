"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InsightShellProps {
  title: string;
  subtitle?: string;
  ribbonColor?: string;
  children: ReactNode;
  className?: string;
}

export function InsightShell({ title, subtitle, ribbonColor, children, className }: InsightShellProps) {
  return (
    <div className={cn("ph-insight-shell", className)}>
      <div className="flex items-start gap-3 px-4 pt-4">
        {ribbonColor && <div className="ph-insight-shell__ribbon" style={{ background: ribbonColor }} />}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ph-ink truncate">{title}</h3>
          {subtitle && <p className="text-xs text-ph-mutedtext mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-4 pt-3">{children}</div>
    </div>
  );
}
