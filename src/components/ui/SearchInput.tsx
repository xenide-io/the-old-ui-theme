import type { ComponentPropsWithoutRef } from "react";
import { useId } from "react";
import { IconSearch } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

export interface SearchInputProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  /** Associated label text — always rendered (visually hidden when `hideLabel`) */
  label?: string;
  hideLabel?: boolean;
  /** Optional shortcut hint shown inside the field (e.g. "⌘K") */
  shortcut?: string;
  density?: "default" | "compact";
  wrapperClassName?: string;
}

/** Labelled search field — use in nav bars and toolbars. */
export function SearchInput({
  id: idProp,
  label = "Search",
  hideLabel = false,
  shortcut,
  density = "default",
  className,
  wrapperClassName,
  placeholder,
  ...props
}: SearchInputProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("relative", wrapperClassName)}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "ph-label mb-1.5 block"}>
        {label}
      </label>
      <div className="relative">
        {shortcut != null ? (
          <span
            className="ph-shortcut pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs"
            aria-hidden
          >
            {shortcut}
          </span>
        ) : null}
        <input
          id={id}
          type="search"
          placeholder={placeholder}
          aria-label={hideLabel ? label : undefined}
          className={cn(
            "ph-input w-full",
            density === "compact" && "max-w-xs !min-h-[2rem] py-1.5 text-sm",
            shortcut != null && "pl-[3.25rem]",
            className,
          )}
          {...props}
        />
      </div>
    </div>
  );
}

export interface SearchGroupProps extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  label?: string;
  submitLabel?: string;
  wrapperClassName?: string;
}

/** Input + primary search — one control shell, 1px vertical seam, matched height to `ph-input`. */
export function SearchGroup({
  id: idProp,
  label = "Search records",
  submitLabel = "Search",
  placeholder = "Persons, actions, flags…",
  wrapperClassName,
  className,
  ...props
}: SearchGroupProps) {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div className={cn("ph-field", wrapperClassName)}>
      <label htmlFor={id} className="ph-label">
        {label}
      </label>
      <div className="ph-search-group flex w-full max-w-lg min-h-[2.3125rem] items-stretch divide-x divide-ph-border">
        <input
          id={id}
          type="search"
          placeholder={placeholder}
          className={cn("ph-input ph-input-group-field min-w-0 flex-1", className)}
          {...props}
        />
        <Button
          type="submit"
          variant="primary"
          icon={<IconSearch className="h-4 w-4" aria-hidden />}
          className="ph-search-group__submit"
          aria-label={submitLabel}
        />
      </div>
    </div>
  );
}
