"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  resolveSuiteNotificationHref,
  suiteAppBaseUrl,
  suiteAppSlugForNotificationSource,
} from "./apps";

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

export interface SuiteNotificationsContextValue {
  notifications: SuiteNotification[];
  unreadCount: number;
  refresh: () => void;
  select: (notification: SuiteNotification) => void;
  markAllRead: () => void;
}

export const SUITE_NOTIFICATIONS_POLL_MS = 60_000;

const SuiteNotificationsContext =
  createContext<SuiteNotificationsContextValue | null>(null);

/**
 * Read the shared notification state. Must be rendered inside a
 * `SuiteNotificationsProvider`: one provider per app owns the single poller,
 * however many bells consume it.
 */
export function useSuiteNotifications(): SuiteNotificationsContextValue {
  const value = useContext(SuiteNotificationsContext);
  if (!value) {
    throw new Error(
      "useSuiteNotifications must be used within a SuiteNotificationsProvider",
    );
  }
  return value;
}

/**
 * Application-layer notification runtime. Owns fetching, polling cadence,
 * tab-visibility gating, stale-while-revalidate caching, optimistic read
 * state, and cross-app navigation. The UI (SuiteNotificationBell) stays
 * presentational and consumes this context, so multiple bells share one
 * request per interval instead of polling independently.
 */
export function SuiteNotificationsProvider({
  fetchNotifications,
  markRead,
  markAllRead: markAllReadRequest,
  pollMs = SUITE_NOTIFICATIONS_POLL_MS,
  cacheKey = "suite-notifications-cache",
  enabled = true,
  children,
}: {
  fetchNotifications: () => Promise<SuiteNotificationsResponse>;
  markRead: (id: string) => Promise<unknown>;
  markAllRead: () => Promise<unknown>;
  /** Poll cadence while the tab is visible. Defaults to 60s. */
  pollMs?: number;
  /** sessionStorage key for stale-while-revalidate; `null` disables caching. */
  cacheKey?: string | null;
  /** Set false to suspend fetching entirely (e.g. before auth resolves). */
  enabled?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<SuiteNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
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
    if (!enabled) return;

    if (cacheKey) {
      queueMicrotask(() => {
        try {
          const raw = sessionStorage.getItem(cacheKey);
          if (!raw) return;
          const cached = JSON.parse(raw) as {
            notifications?: SuiteNotification[];
            unread_count?: number;
          };
          if (Array.isArray(cached.notifications)) {
            setNotifications(cached.notifications);
            setUnreadCount(cached.unread_count ?? 0);
          }
        } catch {
          // ignore
        }
      });
    }

    let timer: number | undefined;
    const stop = () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };
    const start = () => {
      if (timer !== undefined) return;
      void load();
      timer = window.setInterval(() => void load(), pollMs);
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, load, pollMs, cacheKey]);

  const select = useCallback(
    (notification: SuiteNotification) => {
      if (!notification.read_at) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, read_at: new Date().toISOString() }
              : item,
          ),
        );
        setUnreadCount((count) => Math.max(0, count - 1));
        void (async () => {
          try {
            await markRead(notification.id);
          } catch {
            // ignore
          }
        })();
      }

      const target = resolveSuiteNotificationHref(
        notification.href,
        notification.source_app,
      );
      if (!target) return;
      if (/^https?:\/\//i.test(target)) {
        try {
          const url = new URL(target);
          const sourceApp = suiteAppSlugForNotificationSource(
            notification.source_app,
          );
          const path = `${url.pathname}${url.search}${url.hash}`;
          if (url.origin === window.location.origin) {
            router.push(path);
            return;
          }
          if (sourceApp && sourceApp !== "shellstack") {
            const sourceOrigin = new URL(suiteAppBaseUrl(sourceApp)).origin;
            if (url.origin === sourceOrigin) {
              const launchUrl = new URL(
                `/launch/${sourceApp}`,
                suiteAppBaseUrl("shellstack"),
              );
              launchUrl.searchParams.set("next", path);
              window.location.assign(launchUrl.toString());
              return;
            }
          }
        } catch {
          // Fall through to the original external link.
        }
        window.location.assign(target);
        return;
      }
      router.push(target);
    },
    [router, markRead],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read_at: item.read_at ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
    void (async () => {
      try {
        await markAllReadRequest();
      } catch {
        // ignore
      }
    })();
  }, [markAllReadRequest]);

  const value = useMemo<SuiteNotificationsContextValue>(
    () => ({
      notifications,
      unreadCount,
      refresh: () => void load(),
      select,
      markAllRead,
    }),
    [notifications, unreadCount, load, select, markAllRead],
  );

  return (
    <SuiteNotificationsContext.Provider value={value}>
      {children}
    </SuiteNotificationsContext.Provider>
  );
}
