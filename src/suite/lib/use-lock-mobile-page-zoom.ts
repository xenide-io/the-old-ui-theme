"use client";

import { useEffect } from "react";

const MOBILE_PAGE_ZOOM_QUERY = "(hover: none) and (pointer: coarse)";
const LOCKED_VIEWPORT =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

function preventGesture(event: Event) {
  event.preventDefault();
}

/**
 * App-like mobile chrome: no pinch/page zoom. Desktop zoom is unchanged.
 * CSS `touch-action` covers Chromium; viewport + gesture events cover iOS.
 */
export function useLockMobilePageZoom() {
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(MOBILE_PAGE_ZOOM_QUERY);
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute("content");

    const apply = () => {
      const lock = media.matches;
      document.documentElement.toggleAttribute(
        "data-suite-lock-page-zoom",
        lock,
      );
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      if (lock) {
        meta?.setAttribute("content", LOCKED_VIEWPORT);
        document.addEventListener("gesturestart", preventGesture);
        document.addEventListener("gesturechange", preventGesture);
        return;
      }
      if (original) meta?.setAttribute("content", original);
    };

    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      document.documentElement.removeAttribute("data-suite-lock-page-zoom");
      if (original) meta?.setAttribute("content", original);
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
    };
  }, []);
}
