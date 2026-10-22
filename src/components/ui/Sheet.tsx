"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ChevronDown as NavArrowDown, ChevronRight as NavArrowRight } from 'lucide-react';

import { IconCheck } from "@/components/icons";

import { cn } from "@/lib/cn";

import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

export type SheetAlign = "left" | "center" | "right";

export interface SheetColumn<T> {
  key: string;
  header: ReactNode;
  /** Small icon shown before the header text. */
  icon?: ReactNode;
  cell: (row: T) => ReactNode;
  /** Pixel width; pinned columns need one so later pins know their offset. */
  width?: number;
  /** Pin to the left edge while scrolling sideways. */
  pinned?: boolean;
  align?: SheetAlign;
  className?: string;
}

export interface SheetGroup<T> {
  key: string;
  /** Null skips the group header row, for a flat sheet. */
  label: ReactNode;
  rows: T[];
  /** Summary content for the group header row, keyed by column. */
  cells?: Record<string, ReactNode>;
  defaultCollapsed?: boolean;
}

export interface SheetProps<T> {
  columns: SheetColumn<T>[];
  groups: SheetGroup<T>[];
  getRowKey: (row: T) => string;
  caption: string;
  emptyState?: ReactNode;
  className?: string;
  /** Rendered as the last body row of each group, e.g. an "Add row" control. */
  groupFooter?: (group: SheetGroup<T>) => ReactNode;
}

function alignClass(align: SheetAlign | undefined): string {
  if (align === "right") return "text-right tabular-nums";
  if (align === "center") return "text-center";
  return "text-left";
}

function pinnedOffsets<T>(columns: SheetColumn<T>[]): Map<string, number> {
  const offsets = new Map<string, number>();
  let left = 0;
  for (const column of columns) {
    if (!column.pinned) continue;
    offsets.set(column.key, left);
    left += column.width ?? 0;
  }
  return offsets;
}

/**
 * Sheet — a spreadsheet-style grid for editing many records at once.
 *
 * Rows are grouped (a member, a client) with collapsible header rows that can
 * carry totals. Pair with the `Sheet*Cell` editors for inline editing; each
 * cell commits on its own so a failed save only marks that cell.
 */
export function Sheet<T>({
  columns,
  groups,
  getRowKey,
  caption,
  emptyState = "Nothing to show yet.",
  className,
  groupFooter,
}: SheetProps<T>) {
  const offsets = pinnedOffsets(columns);
  const [collapsed, setCollapsed] = useState<Set<string>>(
    () => new Set(groups.filter((g) => g.defaultCollapsed).map((g) => g.key)),
  );

  const cellStyle = (column: SheetColumn<T>): CSSProperties => ({
    width: column.width,
    minWidth: column.width,
    maxWidth: column.width,
    left: offsets.get(column.key),
  });
  const pinClass = (column: SheetColumn<T>) =>
    column.pinned ? "sticky z-[1] bg-inherit" : undefined;

  const toggle = (key: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div
      className={cn(
        "relative overflow-auto rounded-lg border border-ph-border bg-ph-surface",
        className,
      )}
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                style={cellStyle(column)}
                className={cn(
                  "sticky top-0 z-[2] h-10 whitespace-nowrap border-b border-r border-ph-border bg-[var(--ph-surface-inset)] px-3 text-[length:var(--ph-type-meta)] font-semibold uppercase tracking-[0.03125rem] text-[var(--ph-text-tertiary)] last:border-r-0",
                  column.pinned && "z-[3]",
                  alignClass(column.align),
                  column.className,
                )}
              >
                {column.icon ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="inline-flex h-3.5 w-3.5 shrink-0 items-center"
                      aria-hidden
                    >
                      {column.icon}
                    </span>
                    {column.header}
                  </span>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-10 text-center text-ph-subtle"
              >
                {emptyState}
              </td>
            </tr>
          ) : (
            groups.map((group) => {
              const isCollapsed = collapsed.has(group.key);
              const footer = groupFooter?.(group);
              return (
                <Fragment key={group.key}>
                  {group.label == null ? null : (
                    <tr className="bg-ph-muted">
                      {columns.map((column, index) => (
                        <th
                          key={column.key}
                          scope={index === 0 ? "rowgroup" : undefined}
                          style={cellStyle(column)}
                          className={cn(
                            "h-9 border-b border-r border-ph-border px-2 font-semibold text-ph-ink last:border-r-0",
                            pinClass(column),
                            alignClass(index === 0 ? "left" : column.align),
                          )}
                        >
                          {index === 0 ? (
                            <button
                              type="button"
                              onClick={() => toggle(group.key)}
                              aria-expanded={!isCollapsed}
                              className="flex w-full items-center gap-1.5 text-left"
                            >
                              {isCollapsed ? (
                                <NavArrowRight
                                  className="h-4 w-4 shrink-0"
                                  aria-hidden
                                />
                              ) : (
                                <NavArrowDown
                                  className="h-4 w-4 shrink-0"
                                  aria-hidden
                                />
                              )}
                              <span className="min-w-0 flex-1 truncate">
                                {group.label}
                              </span>
                              {group.cells?.[column.key]}
                            </button>
                          ) : (
                            group.cells?.[column.key]
                          )}
                        </th>
                      ))}
                    </tr>
                  )}
                  {isCollapsed
                    ? null
                    : group.rows.map((row) => (
                        <tr
                          key={getRowKey(row)}
                          className="bg-ph-surface hover:bg-ph-canvas"
                        >
                          {columns.map((column) => (
                            <td
                              key={column.key}
                              style={cellStyle(column)}
                              className={cn(
                                "h-11 border-b border-r border-ph-border px-2 text-ph-ink last:border-r-0",
                                pinClass(column),
                                alignClass(column.align),
                                column.className,
                              )}
                            >
                              {column.cell(row)}
                            </td>
                          ))}
                        </tr>
                      ))}
                  {!isCollapsed && footer ? (
                    <tr className="bg-ph-surface">
                      <td
                        colSpan={columns.length}
                        className="border-b border-ph-border px-2 py-1"
                      >
                        <div className="sticky left-2 inline-block">
                          {footer}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

type CellState = "idle" | "saving" | "error";

const cellInputClass =
  "h-8 w-full rounded border border-transparent bg-transparent px-1.5 text-inherit outline-none transition-colors hover:border-ph-border focus:border-ph-brand focus:bg-ph-surface disabled:cursor-not-allowed disabled:opacity-60";

function stateClass(state: CellState): string | undefined {
  if (state === "saving") return "opacity-60";
  if (state === "error") return "border-ph-danger";
  return undefined;
}

/** Moves focus to the same column's editor in the next or previous row. */
function moveFocus(from: HTMLElement, column: string, step: 1 | -1): void {
  const table = from.closest("table");
  if (!table) return;
  const cells = Array.from(
    table.querySelectorAll<HTMLElement>(
      `[data-sheet-col="${CSS.escape(column)}"]`,
    ),
  );
  cells[cells.indexOf(from) + step]?.focus();
}

async function runCommit(
  commit: () => void | Promise<void>,
  setState: (state: CellState) => void,
): Promise<boolean> {
  setState("saving");
  try {
    await commit();
    setState("idle");
    return true;
  } catch {
    setState("error");
    return false;
  }
}

export interface SheetNumberCellProps {
  value: number | null;
  onCommit: (value: number | null) => void | Promise<void>;
  /** Column key; Enter and the arrow keys move between cells sharing it. */
  column: string;
  label: string;
  min?: number;
  max?: number;
  placeholder?: string;
  disabled?: boolean;
  /** Blank input means null rather than zero. */
  nullable?: boolean;
  className?: string;
}

export function SheetNumberCell({
  value,
  onCommit,
  column,
  label,
  min = 0,
  max,
  placeholder,
  disabled,
  nullable = false,
  className,
}: SheetNumberCellProps) {
  const shown =
    value === null || (value === 0 && !nullable) ? "" : String(value);
  const [draft, setDraft] = useState(shown);
  const [state, setState] = useState<CellState>("idle");
  // Focus moves blur the input, so the same edit can arrive twice before `value` updates.
  const sent = useRef<number | null | undefined>(undefined);
  useEffect(() => {
    setDraft(shown);
    sent.current = undefined;
  }, [shown]);

  const parse = (): number | null | undefined => {
    const text = draft.trim();
    if (text === "") return nullable ? null : 0;
    const parsed = Number(text);
    if (
      !Number.isFinite(parsed) ||
      parsed < min ||
      (max !== undefined && parsed > max)
    ) {
      return undefined;
    }
    return parsed;
  };

  const commit = async () => {
    const next = parse();
    if (next === undefined) {
      setState("error");
      return;
    }
    if (next === (value ?? (nullable ? null : 0)) || next === sent.current) {
      if (next !== sent.current) setState("idle");
      return;
    }
    sent.current = next;
    const ok = await runCommit(() => onCommit(next), setState);
    if (!ok) {
      sent.current = undefined;
      setDraft(shown);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setDraft(shown);
      setState("idle");
      event.currentTarget.blur();
    } else if (
      event.key === "Enter" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      // The last row has nowhere to move, so no blur would save it.
      if (event.key === "Enter") void commit();
      moveFocus(event.currentTarget, column, event.key === "ArrowUp" ? -1 : 1);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      data-sheet-col={column}
      aria-label={label}
      aria-invalid={state === "error" || undefined}
      value={draft}
      placeholder={placeholder}
      disabled={disabled || state === "saving"}
      onChange={(event) => {
        setDraft(event.target.value);
        if (state === "error") setState("idle");
      }}
      onFocus={(event) => event.currentTarget.select()}
      onBlur={() => void commit()}
      onKeyDown={onKeyDown}
      className={cn(
        cellInputClass,
        "text-right tabular-nums",
        stateClass(state),
        className,
      )}
    />
  );
}

export interface SheetSelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
  /** Second line in the picker, e.g. what a role can do. */
  description?: string;
}

export interface SheetSelectCellProps {
  value: string;
  options: SheetSelectOption[];
  onCommit: (value: string) => void | Promise<void>;
  label: string;
  disabled?: boolean;
  className?: string;
}

function OptionIcon({ icon }: { icon?: ReactNode }) {
  return icon ? (
    <span
      className="inline-flex h-4 w-4 shrink-0 items-center justify-center"
      aria-hidden
    >
      {icon}
    </span>
  ) : null;
}

export function SheetSelectCell({
  value,
  options,
  onCommit,
  label,
  disabled,
  className,
}: SheetSelectCellProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CellState>("idle");
  const current = options.find((option) => option.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        disabled={disabled || state === "saving"}
        className={cn(
          cellInputClass,
          "group flex cursor-pointer items-center gap-2 text-left",
          stateClass(state),
          className,
        )}
      >
        <OptionIcon icon={current?.icon} />
        <span className="min-w-0 flex-1 truncate">
          {current?.label ?? value}
        </span>
        <NavArrowDown
          className="h-3.5 w-3.5 shrink-0 text-ph-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100"
          aria-hidden
        />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        <div role="listbox" aria-label={label}>
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setOpen(false);
                  if (!selected)
                    void runCommit(() => onCommit(option.value), setState);
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-ph-muted",
                  selected && "bg-ph-muted",
                )}
              >
                <span className="mt-0.5">
                  <OptionIcon icon={option.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ph-ink">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="block text-xs text-ph-mutedtext">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                {selected ? (
                  <IconCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-ph-brand"
                    aria-hidden
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface SheetCheckboxCellProps {
  checked: boolean;
  onCommit: (checked: boolean) => void | Promise<void>;
  label: string;
  disabled?: boolean;
}

export function SheetCheckboxCell({
  checked,
  onCommit,
  label,
  disabled,
}: SheetCheckboxCellProps) {
  const [state, setState] = useState<CellState>("idle");
  return (
    <span className="ph-checkbox-wrap">
      <input
        type="checkbox"
        aria-label={label}
        aria-invalid={state === "error" || undefined}
        checked={checked}
        disabled={disabled || state === "saving"}
        onChange={(event) =>
          void runCommit(() => onCommit(event.target.checked), setState)
        }
        className={cn(
          "ph-checkbox",
          stateClass(state),
          disabled && "cursor-not-allowed opacity-60",
        )}
      />
      <IconCheck className="ph-checkbox-icon" aria-hidden />
    </span>
  );
}

export interface SheetMultiOption {
  value: string;
  label: string;
  /** Options sharing a group render under one heading. */
  group?: string;
  /** Indents the option under the previous one (a project under its client). */
  nested?: boolean;
  color?: string | null;
  icon?: ReactNode;
  /** Shown ticked and locked while any of these values is selected, e.g. a project under a
   * ticked client. */
  impliedBy?: string[];
}

/** One selected value as a compact pill (icon or colour dot, then the label). */
export function SheetPill({
  option,
}: {
  option: Pick<SheetMultiOption, "label" | "color" | "icon">;
}) {
  return (
    <span className="inline-flex max-w-[11rem] shrink-0 items-center gap-1 rounded-full border border-ph-border bg-ph-canvas py-0.5 pl-1 pr-2 text-xs font-medium text-ph-ink">
      {option.icon ? (
        <OptionIcon icon={option.icon} />
      ) : (
        <span
          className="ml-1 h-2 w-2 shrink-0 rounded-full bg-ph-subtle"
          style={option.color ? { background: option.color } : undefined}
          aria-hidden
        />
      )}
      <span className="truncate">{option.label}</span>
    </span>
  );
}

export interface SheetMultiSelectCellProps {
  values: string[];
  options: SheetMultiOption[];
  /** Called once when the picker closes with a changed selection. */
  onCommit: (values: string[]) => void | Promise<void>;
  label: string;
  /** Trigger text when nothing is selected. */
  emptyLabel?: string;
  disabled?: boolean;
  /** Overrides the trigger summary. */
  summary?: ReactNode;
  /** Show the selection as pills, at most `maxPills` before a "+N". */
  pills?: boolean;
  maxPills?: number;
}

export function SheetMultiSelectCell({
  values,
  options,
  onCommit,
  label,
  emptyLabel = "None",
  disabled,
  summary,
  pills = false,
  maxPills = 3,
}: SheetMultiSelectCellProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Set<string>>(() => new Set(values));
  const [state, setState] = useState<CellState>("idle");

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setDraft(new Set(values));
      return;
    }
    const before = new Set(values);
    const changed =
      draft.size !== before.size || [...draft].some((v) => !before.has(v));
    if (changed) void runCommit(() => onCommit([...draft]), setState);
  };

  const selected = options.filter((o) => values.includes(o.value));
  const groups = new Map<string, SheetMultiOption[]>();
  for (const option of options) {
    const key = option.group ?? "";
    groups.set(key, [...(groups.get(key) ?? []), option]);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        type="button"
        aria-label={label}
        disabled={disabled || state === "saving"}
        className={cn(
          cellInputClass,
          "flex items-center gap-1 overflow-hidden text-left",
          stateClass(state),
        )}
      >
        {summary ??
          (selected.length === 0 ? (
            <span className="text-ph-subtle">{emptyLabel}</span>
          ) : pills ? (
            <>
              {selected.slice(0, maxPills).map((option) => (
                <SheetPill key={option.value} option={option} />
              ))}
              {selected.length > maxPills ? (
                <span className="shrink-0 text-xs text-ph-mutedtext">
                  +{selected.length - maxPills}
                </span>
              ) : null}
            </>
          ) : (
            <span className="truncate">
              {selected.map((o) => o.label).join(", ")}
            </span>
          ))}
      </PopoverTrigger>
      <PopoverContent className="max-h-80 w-72 overflow-y-auto p-1">
        {[...groups.entries()].map(([group, items]) => (
          <div key={group || "_"} role="group" aria-label={group || label}>
            {group ? (
              <p className="px-2 pb-1 pt-2 text-xs font-medium uppercase text-ph-subtle">
                {group}
              </p>
            ) : null}
            {items.map((option) => {
              const implied =
                option.impliedBy?.some((value) => draft.has(value)) ?? false;
              const checked = implied || draft.has(option.value);
              return (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-ph-muted",
                    option.nested && "pl-7",
                    implied && "cursor-default opacity-60",
                  )}
                >
                  <span className="ph-checkbox-wrap">
                    <input
                      type="checkbox"
                      className="ph-checkbox"
                      checked={checked}
                      disabled={implied}
                      onChange={(event) =>
                        setDraft((current) => {
                          const next = new Set(current);
                          if (event.target.checked) next.add(option.value);
                          else next.delete(option.value);
                          return next;
                        })
                      }
                    />
                    <IconCheck className="ph-checkbox-icon" aria-hidden />
                  </span>
                  {option.icon ? (
                    <OptionIcon icon={option.icon} />
                  ) : option.color ? (
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: option.color }}
                      aria-hidden
                    />
                  ) : null}
                  <span className="truncate">{option.label}</span>
                </label>
              );
            })}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
