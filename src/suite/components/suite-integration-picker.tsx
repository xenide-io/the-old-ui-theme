"use client";

import { useMemo, useState, type ReactNode } from "react";
import { NavArrowDown, NavArrowUp, Server as Plug, Xmark } from "iconoir-react";
import { Button, Input, Modal } from "@/components/ui";

export interface SuiteIntegrationPickerItem {
  id: string;
  label: string;
  description: string;
  icon?: ReactNode;
  categories?: string[];
  connecting?: boolean;
  unavailableReason?: string;
}

export interface SuiteIntegrationPickerProps {
  open: boolean;
  items: SuiteIntegrationPickerItem[];
  connectedItems?: SuiteIntegrationPickerItem[];
  loading?: boolean;
  onClose: () => void;
  onConnect: (item: SuiteIntegrationPickerItem) => void;
  onDisconnect?: (item: SuiteIntegrationPickerItem) => void;
  title?: string;
  description?: string;
  dataTest?: string;
}

const DESCRIPTION_LIMIT = 90;

export function SuiteIntegrationPicker({
  open,
  items,
  connectedItems = [],
  loading = false,
  onClose,
  onConnect,
  onDisconnect,
  title = "Integrate an app",
  description = "Connect an app to this workspace securely.",
  dataTest = "suite-integration-picker",
}: SuiteIntegrationPickerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const categories = useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.categories ?? []))).sort(),
    [items],
  );
  const filtered = items.filter((item) => {
    const haystack = `${item.label} ${item.description}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase()) && (category === "all" || (item.categories ?? []).includes(category));
  });

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="xl" dataTest={dataTest}>
      <div className="space-y-4">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search apps..." aria-label="Search apps" />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Integration categories">
          {["all", ...categories].map((value) => <button key={value} type="button" onClick={() => setCategory(value)} className={category === value ? "rounded-full bg-ph-brand px-3 py-1.5 text-xs font-semibold text-white" : "rounded-full border border-ph-border px-3 py-1.5 text-xs text-ph-subtle hover:bg-ph-muted"}>{value === "all" ? "All apps" : value}</button>)}
        </div>
        {loading ? <p className="text-sm text-ph-subtle">Loading apps...</p> : <div className="grid max-h-[60vh] gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => { const isExpanded = expanded === item.id; const longDescription = item.description.length > DESCRIPTION_LIMIT; const text = isExpanded || !longDescription ? item.description : `${item.description.slice(0, DESCRIPTION_LIMIT).trimEnd()}...`; return <div key={item.id} className="flex min-h-36 flex-col justify-between rounded-xl border border-ph-border bg-ph-surface p-4"><button type="button" className="text-left" onClick={() => longDescription && setExpanded(isExpanded ? null : item.id)} aria-expanded={isExpanded}><span className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ph-muted text-ph-ink">{item.icon ?? <Plug className="h-5 w-5" aria-hidden />}</span><span className="min-w-0"><span className="block font-medium text-ph-ink">{item.label}</span><span className="mt-1 block text-xs text-ph-subtle">{text}</span>{longDescription ? <span className="mt-1 block text-xs font-medium text-ph-brand">{isExpanded ? "See less" : "See more"} {isExpanded ? <NavArrowUp className="inline h-3 w-3" /> : <NavArrowDown className="inline h-3 w-3" />}</span> : null}</span></span></button><Button type="button" variant="primary" className="mt-3 self-start" disabled={Boolean(item.unavailableReason) || item.connecting} onClick={() => onConnect(item)}><span className="flex items-center gap-1.5"><Plug className="h-3.5 w-3.5" aria-hidden />{item.connecting ? "Connecting..." : item.unavailableReason ?? "Connect"}</span></Button></div>; })}</div>}
        {connectedItems.length > 0 && onDisconnect ? <div className="space-y-2 border-t border-ph-border pt-4"><h3 className="font-medium text-ph-ink">Connected apps</h3>{connectedItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-ph-border bg-ph-muted p-3"><span className="flex min-w-0 items-center gap-2 text-sm text-ph-ink">{item.icon}<span className="truncate">{item.label}</span></span><Button type="button" variant="danger" onClick={() => onDisconnect(item)}><span className="flex items-center gap-1.5"><Xmark className="h-4 w-4" aria-hidden />Disconnect</span></Button></div>)}</div> : null}
      </div>
    </Modal>
  );
}
