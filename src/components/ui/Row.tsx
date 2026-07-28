import { forwardRef, type ReactElement, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactElement | null;
  sideIcon?: ReactElement | null;
  status?: "default" | "success" | "warning" | "danger" | "muted";
  fullWidth?: boolean;
  center?: boolean;
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row({
  icon,
  sideIcon,
  status = "default",
  fullWidth = false,
  center = false,
  size = "md",
  className,
  children,
  ...props
}, ref) {
  const symbolic = children === null || children === undefined || children === false;

  return (
    <div
      ref={ref}
      className={cn(
        "ph-row",
        status !== "default" && `ph-row--${status}`,
        fullWidth && "ph-row--full-width",
        center && "ph-row--center",
        size === "sm" && "ph-row--sm",
        size === "lg" && "ph-row--lg",
        symbolic && "ph-row--symbolic",
        className
      )}
      {...props}
    >
      <div className="ph-row__main">
        {icon && <span className="ph-row__icon">{icon}</span>}
        {!symbolic && <div className="ph-row__content">{children}</div>}
        {sideIcon && <span className="ph-row__side-icon">{sideIcon}</span>}
      </div>
    </div>
  );
});

Row.displayName = "Row";
