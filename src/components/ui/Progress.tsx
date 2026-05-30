import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export interface ProgressProps extends ComponentPropsWithoutRef<"div"> {
  /** Current value (0-100) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Color class for the bar */
  color?: string;
  /** Optional label shown above */
  label?: string;
  /** Show percentage text */
  showPercentage?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export function Progress({
  value,
  max = 100,
  color = "bg-ph-brand",
  label,
  showPercentage = false,
  size = "md",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex justify-between text-sm text-ph-subtle">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className="tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn("ph-progress", sizeMap[size])}>
        <div
          className={cn("ph-progress-bar", color)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
