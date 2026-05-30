import type { ButtonHTMLAttributes, ReactNode } from "react";
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

/**
 * PostHog LemonButton parity — primary/secondary use ::before border ring + ::after face/ridge
 * (see PostHog `LemonButton.scss`). Prefer this over raw `<button className="ph-btn …">`.
 */
export function Button({
  variant = "secondary",
  size = "md",
  shape = "default",
  outline = false,
  split = false,
  icon,
  sideIcon,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const usesLemonChrome = variant === "primary" || variant === "secondary";

  const content = usesLemonChrome ? (
    <ButtonChrome label={children} icon={icon} sideIcon={sideIcon} split={split} />
  ) : (
    <>
      {icon != null ? <span className="ph-btn-icon">{icon}</span> : null}
      {children != null ? <span className="ph-btn-label">{children}</span> : null}
      {split ? <span className="ph-btn-split-divider" aria-hidden /> : null}
      {sideIcon != null ? <span className="ph-btn-side-icon">{sideIcon}</span> : null}
    </>
  );

  return (
    <button
      type={type}
      className={cn(
        "ph-btn",
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
}
