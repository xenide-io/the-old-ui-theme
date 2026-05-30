import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type StatTone = "default" | "brand" | "blue" | "purple" | "warning";

export interface StatProps extends ComponentPropsWithoutRef<"article"> {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  footer?: ReactNode;
  tone?: StatTone;
}

const toneMap: Record<StatTone, string> = {
  default: "text-ph-ink",
  brand: "text-ph-brand",
  blue: "text-ph-blue",
  purple: "text-ph-purple",
  warning: "text-amber-900",
};

const statMap: Record<StatTone, string> = {
  default: "",
  brand: "",
  blue: "",
  purple: "",
  warning: "border-amber-200 bg-amber-50/70",
};

export function Stat({ icon, label, value, footer, tone = "default", className, ...props }: StatProps) {
  return (
    <article className={cn("ph-stat", statMap[tone], className)} {...props}>
      {icon && <div className={cn("mb-2 h-7 w-7", toneMap[tone])}>{icon}</div>}
      <div className={cn("ph-stat-label", tone === "warning" && toneMap[tone])}>{label}</div>
      <div className={cn("ph-stat-val", toneMap[tone])}>{value}</div>
      {footer && <p className="text-xs text-ph-subtle">{footer}</p>}
    </article>
  );
}
