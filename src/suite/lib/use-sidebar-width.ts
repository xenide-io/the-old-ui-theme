"use client";

import {
  useCallback,
  useLayoutEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export const SIDEBAR_RAIL_WIDTH = 56;
export const SIDEBAR_COLLAPSE_THRESHOLD = 80;
export const SIDEBAR_MIN_EXPANDED_WIDTH = 180;
export const SIDEBAR_MAX_WIDTH = 640;
export const SIDEBAR_DEFAULT_WIDTH = 320;

/** Shared across Tides / TurtleTime / Kraken / ShellStack / Nakama. */
export const SUITE_SIDEBAR_WIDTH_KEY = "shellstack:sidebar-width";
export const SUITE_SIDEBAR_WIDTH_COOKIE = "shellstack_sidebar_width";

const LEGACY_SIDEBAR_WIDTH_KEYS = [
  "tides-sidebar-width",
  "tt-sidebar-width",
  "kraken-sidebar-width",
  "shellstack-sidebar-width",
  "nakama-sidebar-width",
] as const;

function isSuiteSidebarKey(storageKey: string): boolean {
  return (
    storageKey === SUITE_SIDEBAR_WIDTH_KEY ||
    LEGACY_SIDEBAR_WIDTH_KEYS.includes(
      storageKey as (typeof LEGACY_SIDEBAR_WIDTH_KEYS)[number],
    )
  );
}

/** Desktop column width: icon rail when collapsed, otherwise the persisted width. */
export function sidebarColumnWidth(
  width: number,
  collapsed: boolean,
  _chatOpen = false,
): number {
  if (collapsed) return SIDEBAR_RAIL_WIDTH;
  return width;
}

function clampWidth(width: number): number {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_RAIL_WIDTH, width));
}

function snapWidth(width: number): number {
  if (width <= SIDEBAR_COLLAPSE_THRESHOLD) return SIDEBAR_RAIL_WIDTH;
  if (width < SIDEBAR_MIN_EXPANDED_WIDTH) return SIDEBAR_MIN_EXPANDED_WIDTH;
  return Math.min(SIDEBAR_MAX_WIDTH, width);
}

function parseWidth(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function suiteCookieDomainAttr(): string {
  const host = window.location.hostname;
  if (host === "localhost" || /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    return "";
  }
  // tides.localhost / turtletime.localhost must share one cookie.
  if (host.endsWith(".localhost")) {
    return "; Domain=.localhost";
  }
  const known = new Set([
    "tides",
    "kraken",
    "turtletime",
    "time",
    "nakama",
    "app",
    "shellstack",
    "portal",
  ]);
  const parts = host.split(".");
  if (parts.length >= 3 && known.has(parts[0] ?? "")) {
    return `; Domain=.${parts.slice(1).join(".")}`;
  }
  if (parts.length >= 2) return `; Domain=.${parts.slice(1).join(".")}`;
  return "";
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length));
    }
  }
  return null;
}

function writeCookie(name: string, value: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax${suiteCookieDomainAttr()}${secure}`;
}

function clearCookie(name: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${suiteCookieDomainAttr()}${secure}`;
}

export function readSidebarWidth(storageKey: string): number | null {
  try {
    if (isSuiteSidebarKey(storageKey)) {
      const fromCookie = parseWidth(readCookie(SUITE_SIDEBAR_WIDTH_COOKIE));
      if (fromCookie != null) return fromCookie;
      const shared = parseWidth(localStorage.getItem(SUITE_SIDEBAR_WIDTH_KEY));
      if (shared != null) return shared;
      for (const key of LEGACY_SIDEBAR_WIDTH_KEYS) {
        const legacy = parseWidth(localStorage.getItem(key));
        if (legacy != null) return legacy;
      }
    }
    return parseWidth(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
}

export function persistSidebarWidth(storageKey: string, value: number): void {
  try {
    localStorage.setItem(storageKey, String(value));
    if (isSuiteSidebarKey(storageKey)) {
      localStorage.setItem(SUITE_SIDEBAR_WIDTH_KEY, String(value));
    }
  } catch {
    // localStorage can be unavailable; the cookie still crosses apps.
  }
  if (isSuiteSidebarKey(storageKey)) {
    try {
      writeCookie(SUITE_SIDEBAR_WIDTH_COOKIE, String(value));
    } catch {
      // Cookie write can fail in restricted browser contexts.
    }
  }
}

export function resetSuiteSidebarWidth(): void {
  try {
    localStorage.removeItem(SUITE_SIDEBAR_WIDTH_KEY);
    for (const key of LEGACY_SIDEBAR_WIDTH_KEYS) {
      localStorage.removeItem(key);
    }
    localStorage.removeItem("kraken-sidebar-collapsed");
  } catch {
    // Ignore storage failures.
  }
  try {
    clearCookie(SUITE_SIDEBAR_WIDTH_COOKIE);
  } catch {
    // Ignore cookie failures.
  }
}

/**
 * Shared suite sidebar resizing: drag below the threshold to collapse,
 * drag the rail edge out to expand, and double-click to reset.
 * Suite app keys share one width via cookie so app-switch keeps it.
 */
export function useSidebarWidth(
  storageKey = SUITE_SIDEBAR_WIDTH_KEY,
  defaultWidth = SIDEBAR_DEFAULT_WIDTH,
) {
  const fallbackWidth = snapWidth(clampWidth(defaultWidth));
  // ponytail: always start at the default so SSR and the first client render
  // match. Reading the cookie in useState() hydrates 320 vs 412 and React
  // keeps the server width — TurtleTime / ShellStack / Nakama stay stuck.
  const [width, setWidth] = useState(fallbackWidth);
  const [narrowViewport, setNarrowViewport] = useState(false);
  const collapsed = narrowViewport || width <= SIDEBAR_COLLAPSE_THRESHOLD;

  useLayoutEffect(() => {
    const sync = () => {
      const stored = readSidebarWidth(storageKey);
      if (stored == null) return;
      setWidth(snapWidth(clampWidth(stored)));
    };
    sync();
    // App switch can restore a bf-cached page. Re-read the shared cookie.
    window.addEventListener("pageshow", sync);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("pageshow", sync);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [storageKey]);

  useLayoutEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrowViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const persist = useCallback(
    (value: number) => {
      persistSidebarWidth(storageKey, value);
    },
    [storageKey],
  );

  const setCollapsed = useCallback(
    (value: boolean) => {
      setWidth((current) => {
        const next = value
          ? SIDEBAR_RAIL_WIDTH
          : current <= SIDEBAR_COLLAPSE_THRESHOLD
            ? fallbackWidth
            : snapWidth(current);
        persist(next);
        return next;
      });
    },
    [fallbackWidth, persist],
  );

  const resetWidth = useCallback(() => {
    setWidth(fallbackWidth);
    persist(fallbackWidth);
  }, [fallbackWidth, persist]);

  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = width;

      const onMove = (moveEvent: PointerEvent) => {
        setWidth(clampWidth(startWidth + moveEvent.clientX - startX));
      };
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        setWidth((current) => {
          const snapped = snapWidth(current);
          persist(snapped);
          return snapped;
        });
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [persist, width],
  );

  const resizeBy = useCallback(
    (delta: number) => {
      setWidth((current) => {
        const next = clampWidth(current + delta);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  return { width, collapsed, setCollapsed, resetWidth, startResize, resizeBy };
}
