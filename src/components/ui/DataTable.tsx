"use client";

import { useState, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = "Search...",
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let items = data;
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((item) =>
        Object.values(item).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      items = [...items].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return items;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className={cn("ph-data-table", className)}>
      {searchable && (
        <div className="ph-data-table__toolbar">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={searchPlaceholder}
            className="ph-input ph-input-sm"
          />
        </div>
      )}
      <div className="ph-table-wrap">
        <table className="ph-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(col.sortable && "cursor-pointer select-none", col.className)}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (
                    <span className="ml-1 inline-block">{sortDir === "asc" ? "\u2191" : "\u2193"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center text-ph-mutedtext py-8">No results</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="ph-data-table__pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="ph-data-table__page-btn">
            Previous
          </button>
          <span className="text-xs text-ph-mutedtext">
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="ph-data-table__page-btn">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

DataTable.displayName = "DataTable";
