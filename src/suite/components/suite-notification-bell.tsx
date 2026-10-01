"use client";

import { useState } from "react";
import { Bell } from "iconoir-react";

import type { SuiteDropdownMenuComponent } from "../lib/injected";
import { useSuiteNotifications } from "../lib/suite-notifications";

export type {
  SuiteNotification,
  SuiteNotificationsResponse,
} from "../lib/suite-notifications";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

/**
 * Presentational notification bell. State, polling, caching and navigation
 * live in SuiteNotificationsProvider — this just renders the shared context
 * and forwards user intent back to it.
 */
export function SuiteNotificationBell({
  dropdownMenu: DropdownMenu,
  dataTest = "suite-notifications",
  triggerId,
  triggerDataTest,
}: {
  dropdownMenu: SuiteDropdownMenuComponent;
  dataTest?: string;
  triggerId?: string;
  triggerDataTest?: string;
}) {
  const {
    notifications,
    unreadCount: unread,
    refresh,
    select,
    markAllRead,
  } = useSuiteNotifications();
  const [open, setOpen] = useState(false);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) refresh();
  };

  return (
    <DropdownMenu
      aria-label={
        unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
      }
      triggerId={triggerId ?? `${dataTest}-trigger`}
      triggerDataTest={triggerDataTest ?? `${dataTest}-trigger`}
      align="end"
      panelClassName="w-80 overflow-hidden p-0"
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-visible rounded-full text-ph-mutedtext transition hover:bg-ph-muted hover:text-ph-ink">
          <span className="relative inline-flex h-5 w-5">
            <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            {unread > 0 ? (
              <span className="pointer-events-none absolute -right-2 -top-2 z-[1] flex h-4 min-w-4 items-center justify-center rounded-full bg-ph-brand px-1 text-[9px] font-semibold leading-none text-[var(--ph-on-accent)] ring-2 ring-ph-surface">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
          </span>
        </span>
      }
    >
      <div className="flex items-center justify-between border-b border-ph-border px-3 py-2">
        <span className="text-sm font-semibold text-ph-ink">Notifications</span>
        {unread > 0 ? (
          <button
            type="button"
            id={`${dataTest}-mark-all`}
            data-test={`${dataTest}-mark-all`}
            onClick={markAllRead}
            className="text-xs font-medium text-ph-brand hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <div className="max-h-80 overflow-y-auto py-1">
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ph-mutedtext">
            You&apos;re all caught up.
          </p>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              id={`${dataTest}-item-${n.id}`}
              data-test={`${dataTest}-item-${n.id}`}
              onClick={() => {
                setOpen(false);
                select(n);
              }}
              className="flex w-full flex-col gap-0.5 px-3 py-2 text-left transition hover:bg-ph-muted"
            >
              <span className="flex items-center gap-2">
                {!n.read_at ? (
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-ph-brand"
                    aria-hidden
                  />
                ) : null}
                <span className="truncate text-sm font-medium text-ph-ink">
                  {n.title}
                </span>
              </span>
              {n.body ? (
                <span className="line-clamp-2 text-xs text-ph-mutedtext">
                  {n.body}
                </span>
              ) : null}
              <span className="text-[11px] uppercase tracking-wide text-ph-subtle">
                {n.source_app} · {timeAgo(n.created_at)}
              </span>
            </button>
          ))
        )}
      </div>
    </DropdownMenu>
  );
}
