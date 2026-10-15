"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { IconFilter, IconSort } from "@/components/icons";
import { cn } from "@/lib/cn";
import {
  DropdownMenu,
  DropdownRadioGroup,
  DropdownRadioItem,
  type DropdownAlign,
} from "@/components/ui/DropdownMenu";

export interface FilterMenuOption {
  value: string;
  label: ReactNode;
  /** Plain-text label used for typeahead and accessible trigger naming. */
  textValue?: string;
  disabled?: boolean;
}

export interface FilterMenuProps {
  label: string;
  value?: string;
  options: readonly FilterMenuOption[];
  onValueChange: (value: string) => void;
  placeholder?: ReactNode;
  /** Hide the value chip when it matches this option (e.g. "any" / "none"). */
  inactiveValue?: string;
  align?: DropdownAlign;
  disabled?: boolean;
  className?: string;
  /** Optional leading icon; defaults to the funnel filter glyph. */
  icon?: ReactNode;
}

export interface SortMenuProps extends Omit<FilterMenuProps, "placeholder" | "icon"> {
  direction?: "ascending" | "descending";
}

export interface FilterBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  label?: string;
  onClear?: () => void;
  clearLabel?: string;
  resultCount?: ReactNode;
}

export function FilterBar({
  children,
  label = "Filters and sorting",
  onClear,
  clearLabel = "Clear all",
  resultCount,
  className,
  ...props
}: FilterBarProps) {
  return (
    <div className={cn("ph-filter-bar", className)} {...props}>
      <div className="ph-filter-bar__controls" role="group" aria-label={label}>
        {children}
        {onClear ? (
          <button type="button" className="ph-filter-bar__clear" onClick={onClear}>
            {clearLabel}
          </button>
        ) : null}
      </div>
      {resultCount != null ? (
        <output className="ph-filter-bar__results" aria-live="polite">
          {resultCount}
        </output>
      ) : null}
    </div>
  );
}

export function FilterMenu({
  label,
  value,
  options,
  onValueChange,
  placeholder = "Any",
  inactiveValue,
  align = "start",
  disabled,
  className,
  icon,
}: FilterMenuProps) {
  const selected = options.find((option) => option.value === value);
  const isInactive =
    inactiveValue != null && (selected == null || selected.value === inactiveValue);
  const showValue = selected != null && !isInactive;
  const isActive = showValue && inactiveValue != null;
  const displayValue = selected?.label ?? placeholder;
  const accessibleValue = selected ? getOptionText(selected) : String(placeholder);

  return (
    <DropdownMenu
      aria-label={`${label}: ${accessibleValue}`}
      align={align}
      disabled={disabled}
      className={className}
      trigger={
        <span className={cn("ph-filter-menu-trigger", isActive && "ph-filter-menu-trigger--active")}>
          {icon === undefined ? (
            <IconFilter className="ph-filter-menu-trigger__icon" aria-hidden />
          ) : (
            icon
          )}
          <span className="ph-filter-menu-trigger__label">{label}</span>
          {showValue ? (
            <span className="ph-filter-menu-trigger__value">{displayValue}</span>
          ) : null}
        </span>
      }
    >
      <DropdownRadioGroup value={value} onValueChange={onValueChange}>
        {options.map((option) => (
          <DropdownRadioItem
            key={option.value}
            value={option.value}
            textValue={getOptionText(option)}
            disabled={option.disabled}
          >
            {option.label}
          </DropdownRadioItem>
        ))}
      </DropdownRadioGroup>
    </DropdownMenu>
  );
}

export function SortMenu({
  label,
  value,
  options,
  onValueChange,
  inactiveValue,
  direction = "descending",
  align = "end",
  disabled,
  className,
}: SortMenuProps) {
  const selected = options.find((option) => option.value === value);
  const isInactive = inactiveValue != null && selected?.value === inactiveValue;
  const showValue = selected != null && !isInactive;
  const isActive = showValue && inactiveValue != null;

  return (
    <DropdownMenu
      aria-label={`${label}: ${selected ? getOptionText(selected) : "Choose sort order"}`}
      align={align}
      disabled={disabled}
      className={className}
      trigger={
        <span
          className={cn(
            "ph-filter-menu-trigger",
            isActive && "ph-filter-menu-trigger--active",
          )}
        >
          <IconSort
            className={cn(
              "ph-filter-menu-trigger__icon",
              direction === "ascending" && "rotate-180",
            )}
            aria-hidden
          />
          <span className="ph-filter-menu-trigger__label">{label}</span>
          {showValue ? (
            <span className="ph-filter-menu-trigger__value">{selected.label}</span>
          ) : null}
        </span>
      }
    >
      <DropdownRadioGroup value={value} onValueChange={onValueChange}>
        {options.map((option) => (
          <DropdownRadioItem
            key={option.value}
            value={option.value}
            textValue={getOptionText(option)}
            disabled={option.disabled}
          >
            {option.label}
          </DropdownRadioItem>
        ))}
      </DropdownRadioGroup>
    </DropdownMenu>
  );
}

function getOptionText(option: FilterMenuOption) {
  if (option.textValue) return option.textValue;
  if (typeof option.label === "string" || typeof option.label === "number") return String(option.label);
  return option.value;
}
