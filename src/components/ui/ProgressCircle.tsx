import type { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface ProgressCircleProps extends HTMLAttributes<HTMLSpanElement> {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export function ProgressCircle({
  progress,
  size = 40,
  strokeWidth: sw,
  children,
  className,
  ...props
}: ProgressCircleProps) {
  const stroke = sw ?? size * 0.08;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(1, Math.max(0, progress)) * circumference);

  return (
    <span
      className={cn("ph-progress-circle", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          opacity={0.15}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="ph-progress-circle__bar"
        />
      </svg>
      {children && <span className="ph-progress-circle__content">{children}</span>}
    </span>
  );
}

ProgressCircle.displayName = "ProgressCircle";
