"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: ReactNode;
  id?: string;
  dataTest?: string;
  badge?: ReactNode;
}

export interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
  "aria-controls"?: string;
  variant?: "segmented" | "tabs";
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
  "aria-controls": ariaControls,
  variant = "segmented",
}: SegmentedControlProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = options.findIndex((option) => option.value === value);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index - 1 + options.length) % options.length;
        break;
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % options.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = options.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextOption = options[nextIndex];
    if (!nextOption) return;
    onChange(nextOption.value);
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role={variant === "tabs" ? "tablist" : "radiogroup"}
      aria-label={ariaLabel}
      className={cn(
        variant === "tabs" ? "ph-tab-control" : "ph-segmented-control",
        className,
      )}
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          id={option.id}
          data-test={option.dataTest}
          ref={(node) => {
            itemRefs.current[index] = node;
          }}
          type="button"
          role={variant === "tabs" ? "tab" : "radio"}
          aria-checked={variant === "tabs" ? undefined : value === option.value}
          aria-selected={
            variant === "tabs" ? value === option.value : undefined
          }
          aria-controls={ariaControls}
          tabIndex={
            selectedIndex === index || (selectedIndex < 0 && index === 0)
              ? 0
              : -1
          }
          onClick={() => onChange(option.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          className={cn(
            variant === "tabs"
              ? "ph-tab-control__item"
              : "ph-segmented-control__item",
            value === option.value &&
              (variant === "tabs"
                ? "ph-tab-control__item--selected"
                : "ph-segmented-control__item--selected"),
          )}
        >
          {option.icon ? (
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4",
                variant === "tabs" ? "h-5 w-5" : "h-4 w-4",
              )}
              aria-hidden
            >
              {option.icon}
            </span>
          ) : null}
          <span className="truncate">{option.label}</span>
          {option.badge != null ? (
            <span className="ph-tab-control__badge">{option.badge}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
