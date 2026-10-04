"use client";

import { cn } from "@/lib/cn";

export interface EmptyStateProps {
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
        "ph-empty-state",
        className
      )}
    >
      {icon && (
        <div className="ph-empty-state__icon">
          {icon}
        </div>
      )}
      <h2 className="text-base font-semibold text-ph-ink">{title}</h2>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ph-subtle">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
