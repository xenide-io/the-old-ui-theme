"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from "react";
import { IconCheck, IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";
import { ButtonChrome } from "@/components/ui/ButtonChrome";
import type { ButtonSize } from "@/components/ui/Button";

type ContentProps = ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>;

export type DropdownAlign = NonNullable<ContentProps["align"]>;
export type DropdownSide = NonNullable<ContentProps["side"]>;

interface DropdownPlacementProps {
  align?: DropdownAlign;
  side?: DropdownSide;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: ContentProps["collisionPadding"];
  avoidCollisions?: boolean;
  panelClassName?: string;
}

interface DropdownOpenProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface DropdownMenuProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    DropdownPlacementProps,
    DropdownOpenProps {
  /** Custom non-interactive trigger node, such as an avatar or icon chip. */
  trigger: ReactNode;
  /** Accessible name when the trigger has no visible text. */
  "aria-label": string;
  children: ReactNode;
  disabled?: boolean;
}

export interface DropdownButtonProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    DropdownPlacementProps,
    DropdownOpenProps {
  /** Visible button label. */
  label: string;
  variant?: "primary" | "secondary" | "accent";
  outline?: boolean;
  size?: ButtonSize;
  /** Split control styling with a divider before the trailing chevron. */
  split?: boolean;
  icon?: ReactNode;
  /** Defaults to a chevron when omitted. */
  sideIcon?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  /** Overrides the accessible name; defaults to `label`. */
  "aria-label"?: string;
}

export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type DropdownRadioGroupProps = ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioGroup>;
export type DropdownRadioItemProps = ComponentPropsWithoutRef<typeof DropdownPrimitive.RadioItem>;

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

function DropdownContent({
  children,
  align = "start",
  side = "bottom",
  sideOffset = 7,
  alignOffset = 0,
  collisionPadding = 8,
  avoidCollisions = true,
  panelClassName,
}: DropdownPlacementProps & { children: ReactNode }) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        className={cn("ph-dropdown-panel", panelClassName)}
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        avoidCollisions={avoidCollisions}
        sticky="partial"
      >
        {children}
        <DropdownPrimitive.Arrow className="ph-dropdown-arrow" width={12} height={6} />
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  );
}

/** Collision-aware menu that flips sides and shifts its alignment to remain visible. */
export function DropdownMenu({
  trigger,
  children,
  align,
  side,
  sideOffset,
  alignOffset,
  collisionPadding,
  avoidCollisions,
  className,
  panelClassName,
  "aria-label": ariaLabel,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  disabled,
  ...props
}: DropdownMenuProps) {
  return (
    <div className={cn("ph-dropdown", className)} {...props}>
      <DropdownPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        <DropdownPrimitive.Trigger asChild disabled={disabled}>
          <button type="button" className="ph-dropdown-trigger" aria-label={ariaLabel}>
            {trigger}
          </button>
        </DropdownPrimitive.Trigger>
        <DropdownContent
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          avoidCollisions={avoidCollisions}
          panelClassName={panelClassName}
        >
          {children}
        </DropdownContent>
      </DropdownPrimitive.Root>
    </div>
  );
}

/** Tactile dropdown trigger backed by the same adaptive menu positioning. */
export function DropdownButton({
  label,
  variant = "secondary",
  outline = false,
  size = "md",
  split = false,
  icon,
  sideIcon,
  children,
  align,
  side,
  sideOffset,
  alignOffset,
  collisionPadding,
  avoidCollisions,
  className,
  panelClassName,
  "aria-label": ariaLabel,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
  disabled,
  ...props
}: DropdownButtonProps) {
  const trailing = sideIcon ?? <IconChevronDown className="h-4 w-4" aria-hidden />;

  return (
    <div className={cn("ph-dropdown", className)} {...props}>
      <DropdownPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        modal={modal}
      >
        <DropdownPrimitive.Trigger asChild disabled={disabled}>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "ph-btn ph-btn-raised ph-dropdown-button",
              variantClass[variant],
              outline && "ph-btn-outline",
              sizeClass[size],
              split && "ph-btn-split",
            )}
            aria-label={ariaLabel}
          >
            <ButtonChrome label={label} icon={icon} sideIcon={trailing} split={split} />
          </button>
        </DropdownPrimitive.Trigger>
        <DropdownContent
          align={align}
          side={side}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          avoidCollisions={avoidCollisions}
          panelClassName={panelClassName}
        >
          {children}
        </DropdownContent>
      </DropdownPrimitive.Root>
    </div>
  );
}

export function DropdownItem({ className, children, disabled, ...props }: DropdownItemProps) {
  return (
    <DropdownPrimitive.Item asChild disabled={disabled}>
      <button
        type="button"
        disabled={disabled}
        className={cn("ph-dropdown-item w-full text-left", className)}
        {...props}
      >
        {children}
      </button>
    </DropdownPrimitive.Item>
  );
}

export function DropdownRadioGroup(props: DropdownRadioGroupProps) {
  return <DropdownPrimitive.RadioGroup {...props} />;
}

export function DropdownRadioItem({ className, children, ...props }: DropdownRadioItemProps) {
  return (
    <DropdownPrimitive.RadioItem className={cn("ph-dropdown-item ph-dropdown-radio-item", className)} {...props}>
      <span className="ph-dropdown-item-indicator" aria-hidden>
        <DropdownPrimitive.ItemIndicator>
          <IconCheck className="h-3.5 w-3.5" />
        </DropdownPrimitive.ItemIndicator>
      </span>
      <span>{children}</span>
    </DropdownPrimitive.RadioItem>
  );
}
