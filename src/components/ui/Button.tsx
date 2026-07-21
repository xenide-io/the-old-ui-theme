import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ButtonChrome } from "@/components/ui/ButtonChrome";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "signal"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "ghost"
  | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg";
export type ButtonShape = "default" | "circle" | "square" | "wide";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  outline?: boolean;
  /** Toolbar split control (Run ▾) — adds divider before trailing icon slot */
  split?: boolean;
  icon?: ReactNode;
  sideIcon?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
  loadingLabel?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "ph-btn-primary",
  secondary: "ph-btn-secondary",
  tertiary: "ph-btn-tertiary",
  signal: "ph-btn-signal",
  accent: "ph-btn-accent",
  neutral: "ph-btn-neutral",
  info: "ph-btn-info",
  success: "ph-btn-success",
  warning: "ph-btn-warning",
  danger: "ph-btn-danger",
  ghost: "ph-btn-ghost",
  link: "ph-btn-link",
};

const sizeClass: Record<ButtonSize, string> = {
  xs: "ph-btn-xs",
  sm: "ph-btn-sm",
  md: "",
  lg: "ph-btn-lg",
};

const shapeClass: Record<ButtonShape, string> = {
  default: "",
  circle: "ph-btn-circle",
  square: "ph-btn-square",
  wide: "ph-btn-wide",
};

/** Filled variants keep a stationary depth plate while the face and content move together. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = "secondary",
  size = "md",
  shape = "default",
  outline = false,
  split = false,
  icon,
  sideIcon,
  loading = false,
  loadingLabel,
  className,
  children,
  type = "button",
  disabled,
  ...props
}, ref) {
  const usesLemonChrome = !["tertiary", "ghost", "link"].includes(variant);
  const label = loadingLabel ?? children;
  const leadingIcon = loading ? <span className="ph-btn-spinner" aria-hidden /> : icon;

  const content = usesLemonChrome ? (
    <ButtonChrome label={label} icon={leadingIcon} sideIcon={sideIcon} split={split} />
  ) : (
    <>
      {leadingIcon != null ? <span className="ph-btn-icon">{leadingIcon}</span> : null}
      {label != null ? <span className="ph-btn-label">{label}</span> : null}
      {split ? <span className="ph-btn-split-divider" aria-hidden /> : null}
      {sideIcon != null ? <span className="ph-btn-side-icon">{sideIcon}</span> : null}
    </>
  );

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "ph-btn",
        usesLemonChrome && "ph-btn-raised",
        outline && "ph-btn-outline",
        variantClass[variant],
        sizeClass[size],
        shapeClass[shape],
        split && "ph-btn-split",
        className,
      )}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
