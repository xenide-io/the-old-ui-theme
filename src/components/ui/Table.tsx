"use client";

import type { CSSProperties, Key, ReactNode } from "react";
import { cn } from "@/lib/cn";

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
  caption?: string;
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
  caption,
}: TableProps<T>) {
  return (
    <div
      className={cn("ph-table-wrap", compact && "ph-table-compact", className)}
      tabIndex={0}
    >
      <table className={cn("ph-table", zebra && "ph-table-zebra", ribbon && "ph-table--ribbon")}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={getRowKey?.(row, i) ?? i} style={getRowStyle?.(row)}>
              {columns.map((col) => (
                <td key={col.key} className={col.className}>{col.cell(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
