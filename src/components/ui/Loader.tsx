import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LoaderVariant = "spinner" | "dots" | "pulse";
export type LoaderSize = "sm" | "md" | "lg";
export type SkeletonShape = "title" | "text" | "short-text" | "avatar" | "button" | "block";

export interface LoaderProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  label?: string;
}

export interface SkeletonProps extends ComponentPropsWithoutRef<"span"> {
  shape?: SkeletonShape;
}

export interface LoadingStateProps extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  label?: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: LoaderVariant;
  size?: LoaderSize;
}

const loaderSizeClass: Record<LoaderSize, string> = {
  sm: "ph-loader-sm",
  md: "ph-loader-md",
  lg: "ph-loader-lg",
};

const skeletonShapeClass: Record<SkeletonShape, string> = {
  title: "ph-skeleton-title",
  text: "ph-skeleton-text",
  "short-text": "ph-skeleton-text-short",
  avatar: "ph-skeleton-avatar",
  button: "ph-skeleton-button",
  block: "ph-skeleton-block",
};

export function Loader({
  variant = "spinner",
  size = "md",
  label = "Loading",
  className,
  ...props
}: LoaderProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn("ph-loader", loaderSizeClass[size], className)}
      {...props}
    >
      {variant === "spinner" ? <span className="ph-loading" aria-hidden /> : null}
      {variant === "dots" ? (
        <span className="ph-loading-dots" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      ) : null}
      {variant === "pulse" ? <span className="ph-loading-pulse" aria-hidden /> : null}
    </span>
  );
}

export function Skeleton({ shape = "text", className, ...props }: SkeletonProps) {
  return (
    <span
      className={cn("ph-skeleton", skeletonShapeClass[shape], className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export function LoadingState({
  label = "Loading",
  title = "Loading",
  description,
  variant = "spinner",
  size = "lg",
  className,
  ...props
}: LoadingStateProps) {
  return (
    <div className={cn("ph-loading-state", className)} role="status" aria-label={label} {...props}>
      <Loader variant={variant} size={size} label={label} aria-hidden="true" />
      <div className="ph-loading-state__copy">
        <strong>{title}</strong>
        {description ? <span>{description}</span> : null}
      </div>
    </div>
  );
}
