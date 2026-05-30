import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type IndicatorPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface IndicatorProps extends ComponentPropsWithoutRef<"div"> {
  /** The element to attach the indicator to */
  children: ReactNode;
  /** Badge content (number, text, or "!") */
  badge?: ReactNode;
  /** Indicator colour */
  color?: string;
  /** Position of the indicator dot */
  position?: IndicatorPosition;
  /** Show a simple dot instead of a badge */
  dot?: boolean;
  /** Offset from corner (default: 2px) */
  offset?: number;
}

const positionMap: Record<IndicatorPosition, string> = {
  "top-right": "-right-[2px] -top-[2px]",
  "top-left": "-left-[2px] -top-[2px]",
  "bottom-right": "-right-[2px] -bottom-[2px]",
  "bottom-left": "-left-[2px] -bottom-[2px]",
};

export function Indicator({
  children,
  badge,
  color = "bg-ph-brand",
  position = "top-right",
  dot = false,
  className,
  ...props
}: IndicatorProps) {
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} {...props}>
      {dot ? (
        <span
          className={cn(
            "absolute z-10 h-2.5 w-2.5 rounded-full border-2 border-white",
            color,
            positionMap[position],
          )}
        />
      ) : badge != null ? (
        <span
          className={cn(
            "absolute z-10 flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full px-1 text-[11px] font-bold text-white",
            color,
            positionMap[position],
          )}
        >
          {badge}
        </span>
      ) : null}
      {children}
    </div>
  );
}
