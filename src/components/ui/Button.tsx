import {
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { ButtonChrome } from "@/components/ui/ButtonChrome";
import { Tooltip, type TooltipSide } from "@/components/ui/Tooltip";
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
  /**
   * Hover/focus tip. Icon-only buttons use this, then `title`, then `aria-label`.
   * `false` shows nothing. A native `title` is never left on the button.
   */
  tooltip?: ReactNode | false;
  tooltipSide?: TooltipSide;
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

function visibleLabel(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node).trim();
  if (Array.isArray(node)) {
    return node.map(visibleLabel).filter(Boolean).join(" ").trim();
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ className?: string; children?: ReactNode }>;
    const className = el.props.className ?? "";
    if (
      typeof className === "string" &&
      className.split(/\s+/).includes("sr-only")
    ) {
      return "";
    }
    return visibleLabel(el.props.children);
  }
  return "";
}

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
  tooltip,
  tooltipSide = "top",
  title,
  "aria-label": ariaLabel,
  ...props
}, ref) {
  const usesLemonChrome = !["tertiary", "ghost", "link"].includes(variant);
  const label = loading ? (loadingLabel ?? children) : children;
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

  const shown = visibleLabel(loading ? (loadingLabel ?? children) : children);
  const nativeTitle = typeof title === "string" ? title.trim() : "";
  const named = typeof ariaLabel === "string" ? ariaLabel.trim() : "";
  // Labelled controls only tip when the text adds something the label doesn't.
  // Icon-only controls always name the action, because nothing else is visible.
  const tip =
    tooltip === false
      ? undefined
      : tooltip !== undefined
        ? tooltip
        : !shown
          ? nativeTitle || named || undefined
          : nativeTitle && nativeTitle !== shown && nativeTitle !== named
            ? nativeTitle
            : undefined;

  const button = (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
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

  if (tip == null || tip === "") return button;

  return (
    <Tooltip content={tip} side={tooltipSide}>
      {button}
    </Tooltip>
  );
});

Button.displayName = "Button";
