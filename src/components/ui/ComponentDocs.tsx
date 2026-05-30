import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface ComponentPropRow {
  name: string;
  type: string;
  defaultValue?: string;
  description: ReactNode;
}

export interface ComponentDocsProps {
  title?: string;
  rows: ComponentPropRow[];
  defaultOpen?: boolean;
  className?: string;
}

export function ComponentDocs({ title = "Props & variants", rows, defaultOpen = false, className }: ComponentDocsProps) {
  return (
    <details className={cn("ph-panel group overflow-hidden p-0", className)} open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-ph-border px-4 py-3 transition hover:bg-ph-muted/60 [&::-webkit-details-marker]:hidden">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ph-mutedtext">{title}</h3>
        <span className="rounded-full border border-ph-border bg-ph-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-ph-mutedtext transition group-open:bg-ph-brand group-open:text-white">
          <span className="group-open:hidden">Show</span>
          <span className="hidden group-open:inline">Hide</span>
        </span>
      </summary>
      <div className="overflow-x-auto border-t border-ph-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-ph-muted text-xs uppercase tracking-wider text-ph-mutedtext">
            <tr>
              <th className="px-4 py-2 font-semibold">Prop</th>
              <th className="px-4 py-2 font-semibold">Type</th>
              <th className="px-4 py-2 font-semibold">Default</th>
              <th className="px-4 py-2 font-semibold">Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ph-border">
            {rows.map((row) => (
              <tr key={row.name}>
                <td className="px-4 py-3 align-top font-mono text-xs text-ph-ink">{row.name}</td>
                <td className="px-4 py-3 align-top font-mono text-xs text-ph-subtle">{row.type}</td>
                <td className="px-4 py-3 align-top font-mono text-xs text-ph-subtle">{row.defaultValue ?? "-"}</td>
                <td className="px-4 py-3 align-top text-ph-subtle">{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
