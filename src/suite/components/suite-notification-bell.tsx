'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'iconoir-react';

import type { SuiteDropdownMenuComponent } from '../lib/injected';
import { resolveSuiteNotificationHref } from '../lib/apps';

const POLL_MS = 60_000;

/** Cross-app (suite) notification from `/api/notifications/` — shared across ShellStack apps. */
export interface SuiteNotification {
  id: string;
  title: string;
  body: string;
  href: string;
  kind: string;
  source_app: string;
  read_at: string | null;
  created_at: string;
  workspace: string | null;
  organisation: string | null;
}

export interface SuiteNotificationsResponse {
  notifications: SuiteNotification[];
  unread_count: number;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (secs < 60) return 'just now';
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export function SuiteNotificationBell({
  fetchNotifications,
  markRead,
  markAllRead,
  dropdownMenu: DropdownMenu,
  cacheKey = 'suite-notifications-cache',
}: {
  fetchNotifications: () => Promise<SuiteNotificationsResponse>;
  markRead: (id: string) => Promise<unknown>;
  markAllRead: () => Promise<unknown>;
  dropdownMenu: SuiteDropdownMenuComponent;
  /** sessionStorage key for stale-while-revalidate; `null` disables caching. */
  cacheKey?: string | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SuiteNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setItems(data.notifications);
      setUnread(data.unread_count);
      // Stale-while-revalidate: keep last inbox for instant paint next visit.
      if (cacheKey) {
        try {
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              notifications: data.notifications,
              unread_count: data.unread_count,
            }),
          );
        } catch {
          // ignore quota / private mode
        }
      }
    } catch {
      // Non-critical chrome — never surface bell errors to the user.
    }
  }, [fetchNotifications, cacheKey]);

  useEffect(() => {
    if (cacheKey) {
      queueMicrotask(() => {
        try {
          const raw = sessionStorage.getItem(cacheKey);
          if (raw) {
            const cached = JSON.parse(raw) as {
              notifications?: SuiteNotification[];
              unread_count?: number;
            };
            if (Array.isArray(cached.notifications)) {
              setItems(cached.notifications);
              setUnread(cached.unread_count ?? 0);
            }
          }
        } catch {
          // ignore
        }
      });
    }
    const kick = window.setTimeout(() => void load(), 0);
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => {
      window.clearTimeout(kick);
      window.clearInterval(id);
    };
  }, [load, cacheKey]);

  const onOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (next) void load();
    },
    [load],
  );

  const openItem = useCallback(
    async (n: SuiteNotification) => {
      setOpen(false);
      if (!n.read_at) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === n.id ? { ...i, read_at: new Date().toISOString() } : i,
          ),
        );
        setUnread((u) => Math.max(0, u - 1));
        try {
          await markRead(n.id);
        } catch {
          // ignore
        }
      }
      const target = resolveSuiteNotificationHref(n.href, n.source_app);
      if (!target) return;
      // Cross-app notifications must leave this product origin.
      if (/^https?:\/\//i.test(target)) {
        window.location.assign(target);
        return;
      }
      router.push(target);
    },
    [router, markRead],
  );

  const markAll = useCallback(async () => {
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        read_at: i.read_at ?? new Date().toISOString(),
      })),
    );
    setUnread(0);
    try {
      await markAllRead();
    } catch {
      // ignore
    }
  }, [markAllRead]);

  return (
    <DropdownMenu
      aria-label="Notifications"
      align="end"
      panelClassName="w-80 overflow-hidden p-0"
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-ph-mutedtext transition hover:bg-ph-muted hover:text-ph-ink">
          <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          {unread > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ph-brand px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-ph-surface">
              {unread > 9 ? '9+' : unread}
            </span>
          ) : null}
        </span>
      }
    >
      <div className="flex items-center justify-between border-b border-ph-border px-3 py-2">
        <span className="text-sm font-semibold text-ph-ink">Notifications</span>
        {unread > 0 ? (
          <button
            type="button"
            onClick={markAll}
            className="text-xs font-medium text-ph-brand hover:underline"
          >
            Mark all read
          </button>
        ) : null}
      </div>
      <div className="max-h-80 overflow-y-auto py-1">
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ph-mutedtext">
            You&apos;re all caught up.
          </p>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => void openItem(n)}
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
