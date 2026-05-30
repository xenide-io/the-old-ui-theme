"use client";

import { cn } from "@/lib/cn";
import { IconClose } from "@/components/icons";

interface FilterChip {
  id: string;
  label: string;
  active?: boolean;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  className?: string;
}

export function FilterChips({ chips, onToggle, onRemove, className }: FilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={() => onToggle(chip.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            chip.active
              ? "bg-ph-brand text-white"
              : "bg-ph-muted text-ph-subtle hover:bg-ph-border hover:text-ph-ink"
          )}
        >
          {chip.label}
          {chip.active && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onRemove(chip.id);
              }}
              className="ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-white/20"
            >
              <IconClose className="h-3 w-3" />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
