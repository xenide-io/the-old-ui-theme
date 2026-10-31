import { useEffect } from "react";

import { SUITE_HANDOFF_COVER_ID } from "./app-transition";
import { playSuiteHandoffEnter } from "./suite-handoff";

const READY_TIMEOUT_MS = 20000;

/**
 * Opens the handoff cover once the destination app shell and the rendered
 * companion face are ready. Waiting for the face prevents an empty companion
 * clone from flying home, and keeps the full-page auth spinner behind the cover.
 */
export function useSuiteHandoffEnter(readySelector?: string): void {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/auth/portal/callback")) return;
    if (!document.getElementById(SUITE_HANDOFF_COVER_ID)) return;
    if (typeof requestAnimationFrame !== "function") {
      playSuiteHandoffEnter();
      return;
    }

    let cancelled = false;
    const started = performance.now();
    const tick = (): void => {
      if (cancelled) return;
      const root = document.getElementById("root");
      const elapsed = performance.now() - started;
      const shellReady =
        Boolean(root && root.childElementCount > 0) &&
        (!readySelector || Boolean(document.querySelector(readySelector)));
      const companionReady = Boolean(
        document.querySelector("[data-assistant-avatar] .face-pose"),
      );
      if (
        (shellReady && (companionReady || elapsed > 4000)) ||
        elapsed > READY_TIMEOUT_MS
      ) {
        playSuiteHandoffEnter();
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelled = true;
    };
  }, [readySelector]);
}
