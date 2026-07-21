"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { IconArrowDown, IconTuning } from "@/components/icons";
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
  align?: DropdownAlign;
  disabled?: boolean;
  className?: string;
}

export interface SortMenuProps extends Omit<FilterMenuProps, "placeholder"> {
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
  align = "start",
  disabled,
  className,
}: FilterMenuProps) {
  const selected = options.find((option) => option.value === value);
  const displayValue = selected?.label ?? placeholder;
  const accessibleValue = selected ? getOptionText(selected) : String(placeholder);

  return (
    <DropdownMenu
      aria-label={`${label}: ${accessibleValue}`}
      align={align}
      disabled={disabled}
      className={className}
      trigger={
        <span className={cn("ph-filter-menu-trigger", selected && "ph-filter-menu-trigger--active")}>
          <IconTuning className="h-3.5 w-3.5" aria-hidden />
          <span className="ph-filter-menu-trigger__label">{label}</span>
          <span className="ph-filter-menu-trigger__value">{displayValue}</span>
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
  direction = "descending",
  align = "end",
  disabled,
  className,
}: SortMenuProps) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu
      aria-label={`${label}: ${selected ? getOptionText(selected) : "Choose sort order"}`}
      align={align}
      disabled={disabled}
      className={className}
      trigger={
        <span className="ph-filter-menu-trigger ph-sort-menu-trigger">
          <IconArrowDown
            className={cn("h-3.5 w-3.5", direction === "ascending" && "rotate-180")}
            aria-hidden
          />
          <span className="ph-filter-menu-trigger__label">{label}</span>
          {selected ? <span className="ph-filter-menu-trigger__value">{selected.label}</span> : null}
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
