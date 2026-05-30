import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";
import { ButtonChrome } from "@/components/ui/ButtonChrome";
import type { ButtonSize } from "@/components/ui/Button";

export type DropdownAlign = "start" | "end";

export interface DropdownMenuProps extends HTMLAttributes<HTMLDetailsElement> {
  /** Custom trigger node (avatar, icon chip, etc.) */
  trigger: ReactNode;
  /** Accessible name when trigger has no visible text */
  "aria-label": string;
  children: ReactNode;
  align?: DropdownAlign;
  panelClassName?: string;
}

export interface DropdownButtonProps extends Omit<HTMLAttributes<HTMLDetailsElement>, "children"> {
  /** Visible button label */
  label: string;
  variant?: "primary" | "secondary" | "accent";
  outline?: boolean;
  size?: ButtonSize;
  /** Split control (Run ▾) — divider before trailing chevron */
  split?: boolean;
  icon?: ReactNode;
  /** Defaults to chevron when omitted */
  sideIcon?: ReactNode;
  children: ReactNode;
  align?: DropdownAlign;
  panelClassName?: string;
  /** Overrides accessible name; defaults to `label` */
  "aria-label"?: string;
}

const sizeClass: Record<ButtonSize, string> = {
  xs: "ph-btn-xs",
  sm: "ph-btn-sm",
  md: "",
  lg: "ph-btn-lg",
};

const variantClass = {
  primary: "ph-btn-primary",
  secondary: "ph-btn-secondary",
  accent: "ph-btn-accent",
} as const;

function dropdownPanelClass(align: DropdownAlign, panelClassName?: string) {
  return cn(
    "ph-dropdown-panel absolute top-full z-50 mt-0",
    align === "end" ? "right-0" : "left-0",
    panelClassName,
  );
}

/** Generic `<details>` menu — pass any trigger (avatar, icon chip, etc.). */
export function DropdownMenu({
  trigger,
  children,
  align = "start",
  className,
  panelClassName,
  "aria-label": ariaLabel,
  ...props
}: DropdownMenuProps) {
  return (
    <details className={cn("relative", className)} {...props}>
      <summary
        className="cursor-pointer list-none [&::-webkit-details-marker]:hidden"
        aria-label={ariaLabel}
      >
        {trigger}
      </summary>
      <div className={dropdownPanelClass(align, panelClassName)}>{children}</div>
    </details>
  );
}

/** Lemon-styled dropdown trigger (primary / secondary / accent) with labelled chrome. */
export function DropdownButton({
  label,
  variant = "secondary",
  outline = false,
  size = "md",
  split = false,
  icon,
  sideIcon,
  children,
  align = "start",
  className,
  panelClassName,
  "aria-label": ariaLabel,
  ...props
}: DropdownButtonProps) {
  const usesLemonChrome = variant === "primary" || variant === "secondary";
  const chevron = <IconChevronDown className="h-4 w-4" aria-hidden />;
  const trailing = sideIcon ?? chevron;

  return (
    <details className={cn("relative", className)} {...props}>
      <summary
        className={cn(
          "ph-btn cursor-pointer list-none [&::-webkit-details-marker]:hidden",
          variantClass[variant],
          outline && "ph-btn-outline",
          sizeClass[size],
          split && "ph-btn-split",
        )}
        aria-label={ariaLabel ?? label}
      >
        {usesLemonChrome ? (
          <ButtonChrome label={label} icon={icon} sideIcon={trailing} split={split} />
        ) : (
          <>
            {icon != null ? <span className="ph-btn-icon">{icon}</span> : null}
            <span className="ph-btn-label">{label}</span>
            <span className="ph-btn-side-icon">{trailing}</span>
          </>
        )}
      </summary>
      <div className={dropdownPanelClass(align, panelClassName)}>{children}</div>
    </details>
  );
}

export function DropdownItem({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cn("ph-dropdown-item w-full text-left", className)} {...props}>
      {children}
    </button>
  );
}
