import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onRemove?: () => void;
  children: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip({
  selected = false,
  onRemove,
  children,
  className,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "ph-chip",
        selected && "ph-chip--selected",
        className
      )}
      {...props}
    >
      <span className="ph-chip__text">{children}</span>
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ph-chip__remove"
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </span>
      )}
    </button>
  );
});

Chip.displayName = "Chip";
