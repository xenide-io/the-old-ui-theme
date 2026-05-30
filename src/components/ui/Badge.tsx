import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  brand: "ph-badge-brand",
  neutral: "ph-badge-neutral",
  success: "ph-badge-success",
  warning: "ph-badge-warning",
  danger: "ph-badge-danger",
  info: "ph-badge-info",
  outline: "ph-badge-outline",
};

const sizeMap: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "",
};

export function Badge({
  variant = "neutral",
  size = "md",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "ph-badge",
        variantMap[variant],
        sizeMap[size],
        className
      )}
    >
      {children}
    </span>
  );
}
