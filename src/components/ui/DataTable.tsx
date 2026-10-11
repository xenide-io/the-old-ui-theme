"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { NavArrowDown, NavArrowUp, Sort } from "iconoir-react";

import { cn } from "@/lib/cn";
import type { TableVariant } from "./Table";

export type DataTableAlign = "left" | "center" | "right";

export interface DataTableColumn<T> {
  /** Stable id — also the sort key. */
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Enables sorting; omit for static columns. */
  accessor?: (row: T) => string | number | boolean | null | undefined;
  /** Override sortability (defaults to true when `accessor` is set). */
  sortable?: boolean;
  align?: DataTableAlign;
  width?: string;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId?: (row: T) => string;
  initialSort?: SortingState;
  /** Zebra striping for long, dense lists. */
  zebra?: boolean;
  /** Tighter row height. */
  compact?: boolean;
  /** Pin the header row while scrolling. */
  stickyHeader?: boolean;
  /** Colour ribbon on the first cell (uses `getRowStyle`). */
  ribbon?: boolean;
  variant?: TableVariant;
  caption?: string;
  emptyState?: ReactNode;
  className?: string;
  tableClassName?: string;
  getRowStyle?: (row: T) => CSSProperties | undefined;
  getRowClassName?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
}

function alignClass(align: DataTableAlign | undefined): string {
  if (align === "right") return "text-right tabular-nums";
  if (align === "center") return "text-center";
  return "text-left";
}

/**
 * DataTable — the shared, beautified grid.
 *
 * Headless logic and state come from TanStack Table (sorting, future paging /
 * filtering / selection); all chrome comes from the `ph-table` design tokens so
 * every product table looks identical. Prefer this over raw `<table>`.
 */
export function DataTable<T>({
  data,
  columns,
  getRowId,
  initialSort,
  zebra = false,
  compact = false,
  stickyHeader = false,
  ribbon = false,
  variant = "default",
  caption,
  emptyState = "No data available.",
  className,
  tableClassName,
  getRowStyle,
  getRowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSort ?? []);

  const tableColumns = useMemo<ColumnDef<T, unknown>[]>(
    () =>
      columns.map((col) => ({
        id: col.id,
        header: () => col.header,
        cell: ({ row }) => col.cell(row.original),
        accessorFn: col.accessor,
        enableSorting: col.sortable ?? Boolean(col.accessor),
        meta: { align: col.align, width: col.width },
      })),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
  });

  const isReport = variant === "report";

  return (
    <div
      className={cn(
        isReport ? "ph-table-report-wrap" : "ph-table-wrap",
        compact && "ph-table-compact",
        className,
      )}
      role="region"
      aria-label={caption ?? "Data table"}
      tabIndex={0}
    >
      <table
        className={cn(
          isReport ? "ph-table-report" : "ph-table",
          zebra && "ph-table-zebra",
          ribbon && "ph-table--ribbon",
          tableClassName,
        )}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | { align?: DataTableAlign; width?: string }
                  | undefined;
                const col = columns.find((c) => c.id === header.column.id);
                const sorted = header.column.getIsSorted();
                const canSort = header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    scope="col"
                    style={meta?.width ? { width: meta.width } : undefined}
                    className={cn(
                      alignClass(meta?.align),
                      col?.headerClassName,
                    )}
                    aria-sort={
                      sorted === "asc"
                        ? "ascending"
                        : sorted === "desc"
                          ? "descending"
                          : canSort
                            ? "none"
                            : undefined
                    }
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "group inline-flex items-center gap-1.5 rounded-sm uppercase tracking-[0.03125rem] transition-colors",
                          "hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand",
                          sorted ? "text-ph-ink" : "text-ph-subtle",
                          meta?.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <span
                          className="inline-flex h-3 w-3 shrink-0 items-center justify-center opacity-60 group-hover:opacity-100"
                          aria-hidden
                        >
                          {sorted === "asc" ? (
                            <NavArrowUp className="h-3 w-3" strokeWidth={2.5} />
                          ) : sorted === "desc" ? (
                            <NavArrowDown
                              className="h-3 w-3"
                              strokeWidth={2.5}
                            />
                          ) : (
                            <Sort className="h-3 w-3 opacity-50" />
                          )}
                        </span>
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            emptyState === null ? null : (
              <tr>
                <td colSpan={columns.length} className="ph-table-empty">
                  {emptyState}
                </td>
              </tr>
            )
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                style={getRowStyle?.(row.original)}
                className={cn(
                  onRowClick && "cursor-pointer",
                  getRowClassName?.(row.original),
                )}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | { align?: DataTableAlign }
                    | undefined;
                  const col = columns.find((c) => c.id === cell.column.id);
                  return (
                    <td
                      key={cell.id}
                      className={cn(alignClass(meta?.align), col?.className)}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
