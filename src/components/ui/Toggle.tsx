import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon?: ReactNode;
  children?: ReactNode;
}

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton({
  pressed = false,
  onPressedChange,
  icon,
  children,
  className,
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={cn(
        "ph-toggle-btn",
        pressed && "ph-toggle-btn--pressed",
        className
      )}
      {...props}
    >
      {icon && <span className="ph-toggle-btn__icon">{icon}</span>}
      {children}
    </button>
  );
});

ToggleButton.displayName = "ToggleButton";

export interface ToggleGroupProps {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: ReactNode;
  className?: string;
}

export function ToggleGroup({
  type = "single",
  value,
  onValueChange,
  children,
  className,
}: ToggleGroupProps) {
  return (
    <div className={cn("ph-toggle-group", className)} role="group">
      {children}
    </div>
  );
}

ToggleGroup.displayName = "ToggleGroup";
