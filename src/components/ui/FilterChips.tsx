"use client";

import type { ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface FilterChip {
  id: string;
  label: ReactNode;
  value?: ReactNode;
  active?: boolean;
  removeLabel?: string;
}

export interface FilterChipsProps {
  chips: readonly FilterChip[];
  onToggle?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
  "aria-label"?: string;
}

export function FilterChips({
  chips,
  onToggle,
  onRemove,
  className,
  "aria-label": ariaLabel = "Applied filters",
}: FilterChipsProps) {
  return (
    <div className={cn("ph-filter-chips", className)} role="group" aria-label={ariaLabel}>
      {chips.map((chip) => {
        const label = chip.removeLabel ?? getChipText(chip);
        const content = (
          <>
            <span className="ph-filter-chip__label">{chip.label}</span>
            {chip.value != null ? <span className="ph-filter-chip__value">{chip.value}</span> : null}
          </>
        );

        return (
          <span
            key={chip.id}
            className={cn("ph-filter-chip", chip.active && "ph-filter-chip--active")}
            data-state={chip.active ? "on" : "off"}
          >
            {onToggle ? (
              <button
                type="button"
                className="ph-filter-chip__main"
                aria-pressed={Boolean(chip.active)}
                onClick={() => onToggle(chip.id)}
              >
                {content}
              </button>
            ) : (
              <span className="ph-filter-chip__main">{content}</span>
            )}
            {chip.active && onRemove ? (
              <button
                type="button"
                className="ph-filter-chip__remove"
                aria-label={`Remove ${label} filter`}
                onClick={() => onRemove(chip.id)}
              >
                <IconClose className="h-3 w-3" aria-hidden />
              </button>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

function getChipText(chip: FilterChip) {
  const label = typeof chip.label === "string" || typeof chip.label === "number" ? String(chip.label) : chip.id;
  const value = typeof chip.value === "string" || typeof chip.value === "number" ? String(chip.value) : null;
  return value ? `${label}: ${value}` : label;
}
