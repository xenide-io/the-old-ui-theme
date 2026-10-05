"use client";

import type { CSSProperties, Key, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TableVariant = "default" | "report";

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  zebra?: boolean;
  compact?: boolean;
  ribbon?: boolean;
  getRowStyle?: (row: T) => CSSProperties | undefined;
  getRowKey?: (row: T, index: number) => Key;
  className?: string;
  tableClassName?: string;
  variant?: TableVariant;
  caption?: string;
  emptyState?: ReactNode;
}

export function Table<T>({
  data,
  columns,
  zebra = false,
  compact = false,
  ribbon = false,
  getRowStyle,
  getRowKey,
  className,
  tableClassName,
  variant = "default",
  caption,
  emptyState = "No data available.",
}: TableProps<T>) {
  return (
    <div
      className={cn(
        variant === "report" ? "ph-table-report-wrap" : "ph-table-wrap",
        compact && "ph-table-compact",
        className,
      )}
      role="region"
      aria-label={caption ?? "Data table"}
      tabIndex={0}
    >
      <table
        className={cn(
          variant === "report" ? "ph-table-report" : "ph-table",
          zebra && "ph-table-zebra",
          ribbon && "ph-table--ribbon",
          tableClassName,
        )}
      >
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            emptyState === null ? null : (
              <tr>
                <td colSpan={columns.length} className="ph-table-empty">
                  {emptyState}
                </td>
              </tr>
            )
          ) : (
            data.map((row, i) => (
              <tr key={getRowKey?.(row, i) ?? i} style={getRowStyle?.(row)}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
