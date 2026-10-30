import { useEffect } from "react";

import { SUITE_HANDOFF_COVER_ID } from "./app-transition";
import { playSuiteHandoffEnter } from "./suite-handoff";

/** How long to hold the cover waiting for the destination shell to render. */
const READY_TIMEOUT_MS = 2500;

/**
 * Opens the handoff cover once the destination app has rendered. Mount this in
 * each app's root component; it no-ops on normal loads and on the callback
 * page, which must keep the cover closed while it redeems the handoff code.
 *
 * `readySelector` is the app shell landmark (for example
 * `[data-test="app-shell"]`). Waiting for it hides the provider's full-page
 * spinner behind the cover instead of irising open onto it. A slow or failed
 * session reveals the page anyway after `READY_TIMEOUT_MS`.
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
      const ready =
        Boolean(root && root.childElementCount > 0) &&
        (!readySelector || Boolean(document.querySelector(readySelector)));
      if (ready || performance.now() - started > READY_TIMEOUT_MS) {
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
