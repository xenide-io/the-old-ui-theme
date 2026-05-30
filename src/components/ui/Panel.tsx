import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PanelProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export function Panel({ title, description, children, className, ...props }: PanelProps) {
  return (
    <div className={cn("ph-panel", className)} {...props}>
      {title && <h3 className="text-sm font-semibold uppercase tracking-wider text-ph-mutedtext">{title}</h3>}
      {description && <p className="text-sm text-ph-subtle">{description}</p>}
      {children}
    </div>
  );
}
