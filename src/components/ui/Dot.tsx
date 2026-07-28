import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "green" | "yellow" | "red" | "blue" | "gray";
  size?: "sm" | "md";
}

const colorMap = {
  green: "bg-ph-success",
  yellow: "bg-ph-warning",
  red: "bg-ph-danger",
  blue: "bg-ph-info",
  gray: "bg-ph-mutedtext",
};

export function Dot({ color = "gray", size = "md", className, ...props }: DotProps) {
  return (
    <span
      className={cn(
        "ph-dot inline-block shrink-0 rounded-full",
        size === "sm" ? "h-1.5 w-1.5" : "h-2.5 w-2.5",
        colorMap[color],
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

Dot.displayName = "Dot";
