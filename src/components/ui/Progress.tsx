import { useId, type ComponentPropsWithoutRef } from "react";
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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: ProgressProps) {
  const labelId = useId();
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value)
    ? Math.min(safeMax, Math.max(0, value))
    : 0;
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div className={cn("w-full", className)} {...props}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex justify-between text-sm text-ph-subtle">
          {label && <span id={labelId}>{label}</span>}
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
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-label={label ? undefined : (ariaLabel ?? "Progress")}
          aria-labelledby={label ? (ariaLabelledBy ?? labelId) : ariaLabelledBy}
        />
      </div>
    </div>
  );
}
