import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "outlined" | "elevated" | "highlighted";

export interface CardProps {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  media?: ReactNode;
  variant?: CardVariant;
  className?: string;
  bodyClassName?: string;
}

const variantMap: Record<CardVariant, string> = {
  default: "bg-ph-surface",
  outlined: "border-2 border-ph-border bg-ph-surface",
  elevated: "bg-ph-surface shadow-ph-md",
  highlighted: "border border-ph-brand/35 bg-orange-50/40 shadow-ph",
};

export function Card({
  children,
  title,
  description,
  actions,
  footer,
  media,
  variant = "default",
  className,
  bodyClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        "ph-card",
        variantMap[variant],
        className
      )}
    >
      {media && <div className="-mx-6 -mt-6 mb-4">{media}</div>}
      <div className={cn("ph-card-body", bodyClassName)}>
        {title && (
          <h3 className="ph-card-title">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-ph-subtle">{description}</p>
        )}
        {children}
        {actions && <div className="ph-card-actions">{actions}</div>}
      </div>
      {footer && (
        <div className="border-t border-ph-border px-6 py-4 text-xs text-ph-subtle">{footer}</div>
      )}
    </div>
  );
}
