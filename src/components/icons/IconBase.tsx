import { forwardRef, type SVGAttributes } from "react";
import { cn } from "@/lib/cn";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** Pixel size or CSS length; defaults to `1em`. */
  size?: number | string;
}

/** Shared SVG wrapper with predictable sizing and accessible-name behavior. */
export const IconBase = forwardRef<SVGSVGElement, IconProps>(function IconBase({
  className,
  size,
  children,
  viewBox = "0 0 24 24",
  fill = "none",
  xmlns = "http://www.w3.org/2000/svg",
  focusable = "false",
  style,
  role,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}, ref) {
  const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy);

  return (
    <svg
      ref={ref}
      className={cn("ph-icon", className)}
      viewBox={viewBox}
      fill={fill}
      xmlns={xmlns}
      focusable={focusable}
      role={role ?? (hasAccessibleName ? "img" : undefined)}
      aria-hidden={ariaHidden ?? (hasAccessibleName ? undefined : true)}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {children}
    </svg>
  );
});

IconBase.displayName = "IconBase";
