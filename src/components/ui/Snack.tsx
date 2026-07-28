import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SnackProps extends HTMLAttributes<HTMLSpanElement> {
  type?: "regular" | "pill";
  onClose?: () => void;
  wrap?: boolean;
  children: ReactNode;
}

export const Snack = forwardRef<HTMLSpanElement, SnackProps>(function Snack({
  type = "regular",
  onClose,
  wrap = false,
  className,
  children,
  ...props
}, ref) {
  return (
    <span
      ref={ref}
      className={cn(
        "ph-snack",
        type === "pill" && "ph-snack--pill",
        !wrap && "truncate",
        className
      )}
      title={typeof children === "string" ? children : undefined}
      {...props}
    >
      <span className="ph-snack__text">{children}</span>
      {onClose && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="ph-snack__close"
          aria-label="Remove"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </span>
  );
});

Snack.displayName = "Snack";
