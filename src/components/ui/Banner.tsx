import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BannerType = "info" | "success" | "warning" | "danger" | "ai";

export interface BannerProps extends HTMLAttributes<HTMLDivElement> {
  type?: BannerType;
  onClose?: () => void;
  action?: ReactNode;
  hideIcon?: boolean;
  square?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const typeClass: Record<BannerType, string> = {
  info: "ph-banner-info",
  success: "ph-banner-success",
  warning: "ph-banner-warning",
  danger: "ph-banner-danger",
  ai: "ph-banner-ai",
};

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner({
  type = "info",
  onClose,
  action,
  hideIcon = false,
  square = false,
  icon,
  className,
  children,
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "ph-banner",
        typeClass[type],
        square && "ph-banner--square",
        className
      )}
      {...props}
    >
      <div className="ph-banner__body">
        {icon}
        <div className="ph-banner__content">{children}</div>
        {action && <div className="ph-banner__action">{action}</div>}
        {onClose && (
          <button type="button" onClick={onClose} className="ph-banner__close" aria-label="Dismiss">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

Banner.displayName = "Banner";
