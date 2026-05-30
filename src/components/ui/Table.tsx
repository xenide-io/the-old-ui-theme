import type { CSSProperties, ReactNode } from "react";
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
  className,
  caption,
}: TableProps<T>) {
  return (
    <div className={cn("ph-table-wrap", compact && "ph-table-compact", className)}>
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
            <tr key={i} style={getRowStyle?.(row)}>
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
