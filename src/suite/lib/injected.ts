import type { ButtonHTMLAttributes, ComponentType, ReactNode } from "react";

/**
 * Structural types for theme primitives each app injects from
 * `@xenide-io/the-old-ui-theme/ui` (the shared package must not depend on it).
 * The real components satisfy these shapes, so apps can pass them directly.
 */

export interface SuiteDropdownMenuProps {
  trigger: ReactNode;
  triggerId?: string;
  triggerDataTest?: string;
  children: ReactNode;
  "aria-label": string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
  panelClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type SuiteDropdownMenuComponent = ComponentType<SuiteDropdownMenuProps>;

export type SuiteDropdownItemComponent = ComponentType<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export interface SuiteCommandItem {
  id: string;
  label: string;
  shortcut?: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export type SuiteCommandPaletteComponent = ComponentType<{
  items: SuiteCommandItem[];
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  className?: string;
  id?: string;
  dataTest?: string;
  inputId?: string;
  inputDataTest?: string;
}>;

/** App-branded spinner (each app has its own AppSpinner design). */
export type SuiteSpinnerComponent = ComponentType<{
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}>;
