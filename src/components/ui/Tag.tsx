import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TagType = "default" | "primary" | "success" | "warning" | "danger" | "info" | "muted" | "highlight";

export interface TagProps extends HTMLAttributes<HTMLDivElement> {
  type?: TagType;
  size?: "sm" | "md";
  icon?: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  children: ReactNode;
}

const typeClass: Record<TagType, string> = {
  default: "ph-tag-default",
  primary: "ph-tag-primary",
  success: "ph-tag-success",
  warning: "ph-tag-warning",
  danger: "ph-tag-danger",
  info: "ph-tag-info",
  muted: "ph-tag-muted",
  highlight: "ph-tag-highlight",
};

export const Tag = forwardRef<HTMLDivElement, TagProps>(function Tag({
  type = "default",
  size = "md",
  icon,
  closable = false,
  onClose,
  className,
  children,
  ...props
}, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "ph-tag",
        typeClass[type],
        size === "sm" && "ph-tag-sm",
        className
      )}
      {...props}
    >
      {icon && <span className="ph-tag__icon">{icon}</span>}
      <span className="ph-tag__text">{children}</span>
      {closable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose?.(); }}
          className="ph-tag__close"
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
});

Tag.displayName = "Tag";
