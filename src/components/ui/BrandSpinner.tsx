"use client";

import { useId, useSyncExternalStore, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BrandSpinnerVariant =
  "ring-3" | "timer" | "columns" | "orbit" | "ink" | "squares";
export type BrandSpinnerSize = "sm" | "md" | "lg";

export interface BrandSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrandSpinnerVariant;
  size?: BrandSpinnerSize;
  label?: string;
}

const sizes: Record<BrandSpinnerSize, number> = { sm: 20, md: 40, lg: 56 };
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeMotion(onChange: () => void): () => void {
  const media = window.matchMedia?.(reducedMotionQuery);
  media?.addEventListener("change", onChange);
  return () => media?.removeEventListener("change", onChange);
}

function readReducedMotion(): boolean {
  return window.matchMedia?.(reducedMotionQuery).matches ?? false;
}

export function BrandSpinner({
  variant = "ring-3",
  size = "md",
  label = "Loading",
  className,
  ...props
}: BrandSpinnerProps) {
  const gradientId = `ph-spinner-${useId().replace(/:/g, "")}`;
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    readReducedMotion,
    () => true,
  );
  const dimension = sizes[size];

  return (
    <div
      role="status"
      aria-label={label}
      data-test="app-spinner"
      data-variant={variant}
      className={cn(
        "inline-flex shrink-0",
        variant !== "orbit" && "text-ph-brand",
        className,
      )}
      {...props}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={variant === "ring-3" ? "0 0 24 24" : "0 0 40 40"}
        aria-hidden
        className={
          variant === "timer" || variant === "ring-3"
            ? "animate-spin motion-reduce:animate-none"
            : undefined
        }
      >
        {variant === "ring-3" ? (
          <>
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              opacity="0.2"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        ) : variant === "timer" ? (
          <>
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.18"
              strokeWidth="2.5"
            />
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="24 70"
            />
            <circle cx="20" cy="5" r="2.25" fill="currentColor" />
          </>
        ) : variant === "columns" ? (
          <>
            <rect
              x="9"
              y="16"
              width="6"
              height="14"
              rx="2"
              fill="currentColor"
              fillOpacity="0.35"
              className="ph-brand-spinner__column"
            />
            <rect
              x="17"
              y="11"
              width="6"
              height="19"
              rx="2"
              fill="currentColor"
              className="ph-brand-spinner__column"
              style={{ animationDelay: "0.14s" }}
            />
            <rect
              x="25"
              y="14"
              width="6"
              height="16"
              rx="2"
              fill="currentColor"
              fillOpacity="0.55"
              className="ph-brand-spinner__column"
              style={{ animationDelay: "0.28s" }}
            />
          </>
        ) : variant === "squares" ? (
          <g className="origin-[1.25rem_1.25rem] motion-safe:animate-spin">
            <rect
              x="9" y="9" width="22" height="22" rx="5"
              fill="none" stroke="currentColor" strokeWidth="2.4"
            />
            <rect
              x="14" y="14" width="12" height="12" rx="3"
              fill="none" stroke="currentColor" strokeWidth="2"
              opacity="0.45" transform="rotate(45 20 20)"
            />
          </g>
        ) : variant === "orbit" ? (
          <>
            <defs>
              <linearGradient
                id={gradientId}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#1877f2" />
                <stop offset="100%" stopColor="#ebbcba" />
              </linearGradient>
            </defs>
            <circle
              cx="20"
              cy="20"
              r="15"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            <g className="origin-[1.25rem_1.25rem] animate-spin motion-reduce:animate-none">
              <circle
                cx="20"
                cy="20"
                r="15"
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="22 72"
              />
            </g>
            <g className="origin-[1.25rem_1.25rem] animate-[spin_1.6s_linear_infinite_reverse] motion-reduce:animate-none">
              <circle
                cx="20"
                cy="20"
                r="9"
                fill="none"
                stroke="#ebbcba"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="12 45"
                strokeOpacity="0.9"
              />
            </g>
            <circle
              cx="20"
              cy="20"
              r="2.5"
              fill="#1877f2"
              className="animate-pulse motion-reduce:animate-none"
            />
          </>
        ) : (
          <>
            <g>
              {!reducedMotion ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 20 20"
                  to="360 20 20"
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              ) : null}
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.2"
                strokeWidth="1.5"
                strokeDasharray="3 5"
              />
            </g>
            <g>
              {!reducedMotion ? (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="360 20 20"
                  to="0 20 20"
                  dur="1.1s"
                  repeatCount="indefinite"
                />
              ) : null}
              <circle
                cx="20"
                cy="20"
                r="11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="18 52"
              />
            </g>
            <path
              d="M16 14h8v12a1 1 0 0 1-1.4.9L20 25.5l-2.6 1.4A1 1 0 0 1 16 26V14z"
              fill="currentColor"
              fillOpacity="0.85"
              className="animate-pulse motion-reduce:animate-none"
            />
          </>
        )}
      </svg>
    </div>
  );
}
