"use client";

import { cn } from "@/lib/cn";

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-lg bg-ph-muted p-1",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative flex items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-all",
            value === option.value
              ? "bg-ph-surface text-ph-ink shadow-ph"
              : "text-ph-subtle hover:text-ph-ink"
          )}
        >
          {option.icon && <span className="h-4 w-4">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
}
