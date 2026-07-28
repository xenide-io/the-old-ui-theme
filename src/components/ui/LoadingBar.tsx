import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface LoadingBarProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

export function LoadingBar({ active = true, className, ...props }: LoadingBarProps) {
  return (
    <div
      className={cn(
        "ph-loading-bar",
        active && "ph-loading-bar--active",
        className
      )}
      role="progressbar"
      aria-label="Loading"
      {...props}
    >
      <div className="ph-loading-bar__fill" />
    </div>
  );
}

LoadingBar.displayName = "LoadingBar";
