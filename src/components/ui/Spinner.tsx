import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  textColored?: boolean;
}

export function Spinner({ size = "sm", textColored = false, className, ...props }: SpinnerProps) {
  return (
    <span
      className={cn(
        "ph-spinner",
        `ph-spinner--${size}`,
        textColored && "ph-spinner--text-colored",
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ph-spinner__svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity={0.2} />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

Spinner.displayName = "Spinner";
