import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FilterBar, type FilterBarProps } from "@/components/ui/FilterBar";
import { FilterChips, type FilterChipsProps } from "@/components/ui/FilterChips";

export interface FilterControlsProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  barProps?: Omit<FilterBarProps, "children">;
  chipsProps?: FilterChipsProps;
  emptyState?: ReactNode;
}

/** Combines filter controls and their applied chips without owning filter state. */
export function FilterControls({
  children,
  barProps,
  chipsProps,
  emptyState,
  className,
  ...props
}: FilterControlsProps) {
  const hasChips = Boolean(chipsProps?.chips.length);

  return (
    <div className={cn("ph-filter-controls", className)} {...props}>
      <FilterBar {...barProps}>{children}</FilterBar>
      {hasChips && chipsProps ? <FilterChips {...chipsProps} /> : emptyState ?? null}
    </div>
  );
}
