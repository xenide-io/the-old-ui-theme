"use client";

import { cn } from "@/lib/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-ph-border bg-ph-muted/50 px-8 py-16 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-ph-muted text-ph-mutedtext">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-ph-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ph-subtle">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
