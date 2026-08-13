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
  const chipClassName = cn(
    "ph-chip",
    selected && "ph-chip--selected",
    className
  );

  if (onRemove) {
    const removeLabel =
      typeof children === "string" ? `Remove ${children}` : "Remove";

    return (
      <span className={chipClassName}>
        <button
          ref={ref}
          type="button"
          className="min-w-0 bg-transparent p-0 text-inherit"
          {...props}
        >
          <span className="ph-chip__text">{children}</span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          disabled={props.disabled}
          className="ph-chip__remove"
          aria-label={removeLabel}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M2 2l6 6M8 2l-6 6" />
          </svg>
        </button>
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      className={chipClassName}
      {...props}
    >
      <span className="ph-chip__text">{children}</span>
    </button>
  );
});

Chip.displayName = "Chip";
