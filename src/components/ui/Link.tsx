import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  disabled?: boolean;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({
  className,
  disabled = false,
  children,
  ...props
}, ref) {
  return (
    <a
      ref={ref}
      className={cn(
        "ph-link",
        disabled && "ph-link--disabled pointer-events-none opacity-50",
        className
      )}
      tabIndex={disabled ? -1 : undefined}
      aria-disabled={disabled || undefined}
      {...props}
    >
      {children}
    </a>
  );
});

Link.displayName = "Link";
