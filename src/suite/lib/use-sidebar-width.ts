"use client";

import {
  useCallback,
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export const SIDEBAR_RAIL_WIDTH = 56;
export const SIDEBAR_COLLAPSE_THRESHOLD = 80;
export const SIDEBAR_MIN_EXPANDED_WIDTH = 180;
export const SIDEBAR_MAX_WIDTH = 320;
export const SIDEBAR_DEFAULT_WIDTH = 320;

function clampWidth(width: number): number {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_RAIL_WIDTH, width));
}

function snapWidth(width: number): number {
  if (width <= SIDEBAR_COLLAPSE_THRESHOLD) return SIDEBAR_RAIL_WIDTH;
  if (width < SIDEBAR_MIN_EXPANDED_WIDTH) return SIDEBAR_MIN_EXPANDED_WIDTH;
  return Math.min(SIDEBAR_MAX_WIDTH, width);
}

/**
 * Shared suite sidebar resizing: drag below the threshold to collapse,
 * drag the rail edge out to expand, and double-click to reset.
 */
export function useSidebarWidth(
  storageKey: string,
  defaultWidth = SIDEBAR_DEFAULT_WIDTH,
) {
  const fallbackWidth = snapWidth(clampWidth(defaultWidth));
  const [width, setWidth] = useState(fallbackWidth);
  const [narrowViewport, setNarrowViewport] = useState(false);
  const collapsed = narrowViewport || width <= SIDEBAR_COLLAPSE_THRESHOLD;

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(storageKey);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
    if (!stored) return;
    const parsed = Number.parseInt(stored, 10);
    if (!Number.isNaN(parsed)) {
      queueMicrotask(() => setWidth(snapWidth(clampWidth(parsed))));
    }
  }, [storageKey]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const sync = () => setNarrowViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const persist = useCallback(
    (value: number) => {
      try {
        localStorage.setItem(storageKey, String(value));
      } catch {
        // A persisted preference is optional; resizing should still work.
      }
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
