import type { SVGAttributes } from "react";
import { cn } from "@/lib/cn";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** Pixel size or CSS length — defaults to `1em` (Lemon parity). */
  size?: number | string;
}

/** Base SVG wrapper — mirrors PostHog `LemonIconBase` + `.LemonIcon` metrics. */
export function IconBase({
  className,
  size,
  children,
  viewBox = "0 0 24 24",
  fill = "none",
  xmlns = "http://www.w3.org/2000/svg",
  focusable = "false",
  ...props
}: IconProps) {
  const dimensionProps =
    size != null
      ? { width: size, height: size }
      : {};

  return (
    <svg
      className={cn("ph-icon", className)}
      {...dimensionProps}
      viewBox={viewBox}
      fill={fill}
      xmlns={xmlns}
      focusable={focusable}
      aria-hidden={props["aria-hidden"] ?? true}
      {...props}
    >
      {children}
    </svg>
  );
}
