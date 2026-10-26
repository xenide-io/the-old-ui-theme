"use client";

import { useState } from "react";
import { Bell, Check, Search } from "lucide-react";
import { Button, Input, SegmentedControl } from "../../components/ui";
import { SuitePage, SuitePageHeader } from "./suite-layout";
import type { SuiteNotification } from "../lib/suite-notifications";
import { formatDateTime } from "../lib/dates";

export function SuiteNotificationInbox({ notifications, loading, error, busy, onRetry, onOpen, onMarkRead, description }: {
  notifications: SuiteNotification[];
  loading: boolean;
  error?: string;
  busy?: boolean;
  onRetry(): void;
  onOpen(notification: SuiteNotification): void;
  onMarkRead(ids: string[]): void;
  description: string;
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const visible = notifications.filter((item) => (tab !== "unread" || !item.read_at) && `${item.title} ${item.body}`.toLowerCase().includes(search.trim().toLowerCase()));
  const unread = visible.filter((item) => !item.read_at).map((item) => item.id);
  return (
    <SuitePage dataTest="notifications-page">
      <SuitePageHeader title="Notifications" description={description} actions={<Button variant="secondary" size="sm" disabled={busy || !unread.length} onClick={() => onMarkRead(unread)} icon={<Check className="h-4 w-4" aria-hidden />}>Mark shown read</Button>} />
      <div className="suite-page-body space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl aria-label="Notification status" value={tab} onChange={setTab} options={[{ value: "all", label: "All" }, { value: "unread", label: "Unread" }]} />
          <div className="relative w-full sm:ml-auto sm:w-72"><Search className="text-ph-mutedtext pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" aria-hidden /><Input aria-label="Search notifications" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" placeholder="Search notifications…" /></div>
        </div>
        {error ? <p role="alert" className="text-ph-danger text-sm">{error} <button type="button" className="underline" onClick={onRetry}>Retry</button></p> : null}
        {loading ? <p role="status" className="text-ph-mutedtext py-8 text-sm">Loading notifications…</p> : error && !notifications.length ? null : !visible.length ? <div className="text-ph-mutedtext py-12 text-center"><Bell className="mx-auto mb-3 h-6 w-6" aria-hidden /><p>{search ? "No matching notifications." : "You’re all caught up."}</p></div> : (
          <ul className="divide-ph-border divide-y">
            {visible.map((item) => <li key={item.id} data-test="notification-row" className="flex items-center gap-2 py-2">
              <button type="button" onClick={() => onOpen(item)} className="hover:bg-ph-muted flex min-w-0 flex-1 items-start gap-3 rounded-md p-3 text-left focus-visible:outline focus-visible:outline-2">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read_at ? "bg-transparent" : "bg-ph-brand"}`} aria-label={item.read_at ? "Read" : "Unread"} />
                <span className="min-w-0 flex-1"><span className="text-ph-ink block text-sm font-medium">{item.title}</span><span className="text-ph-mutedtext mt-1 block text-sm whitespace-pre-wrap">{item.body}</span><span className="text-ph-subtle mt-1 block text-xs">{formatDateTime(item.created_at)}</span></span>
              </button>
              {!item.read_at ? <Button variant="ghost" size="sm" disabled={busy} aria-label={`Mark ${item.title} read`} onClick={() => onMarkRead([item.id])}><Check className="h-4 w-4" aria-hidden /></Button> : null}
            </li>)}
          </ul>
        )}
      </div>
    </SuitePage>
  );
}
