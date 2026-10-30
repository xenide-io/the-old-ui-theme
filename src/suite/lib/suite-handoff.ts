/**
 * Incoming half of the cross-app handoff.
 *
 * Each app's index.html paints a flat brand cover before React mounts (see the
 * `suite-handoff-cover` script there). This module waits until the destination
 * has rendered, then opens a circular hole from the centre so the app appears
 * to grow out of the companion.
 */

import {
  SUITE_HANDOFF_COVER_ID,
  SUITE_HANDOFF_STORAGE_KEY,
} from "./app-transition";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IRIS_OPEN_MS = 420;

function reducedMotion(): boolean {
  try {
    return (
      window.matchMedia(REDUCED_MOTION_QUERY).matches ||
      document.documentElement.dataset.reduceMotion === "true"
    );
  } catch {
    return false;
  }
}

function forgetHandoff(): void {
  try {
    sessionStorage.removeItem(SUITE_HANDOFF_STORAGE_KEY);
  } catch {
    /* sessionStorage is optional */
  }
}

function unlockBootPaint(): void {
  document.documentElement.style.overflow = "";
  // The boot script paints <html> so the first frame matches the iris. Once
  // the app is visible that colour must not leak into overscroll or gaps.
  document.documentElement.style.backgroundColor = "";
}

/** Removes the cover immediately. Use on a failed or abandoned handoff. */
export function clearSuiteHandoffCover(): void {
  if (typeof document === "undefined") return;
  forgetHandoff();
  unlockBootPaint();
  document.getElementById(SUITE_HANDOFF_COVER_ID)?.remove();
}

/** Irises the pre-paint cover open onto the rendered destination. */
export function playSuiteHandoffEnter(): void {
  if (typeof document === "undefined") return;
  let hadMarker = false;
  try {
    hadMarker = sessionStorage.getItem(SUITE_HANDOFF_STORAGE_KEY) === "1";
  } catch {
    /* sessionStorage is optional */
  }
  const cover = document.getElementById(SUITE_HANDOFF_COVER_ID);
  forgetHandoff();
  if (!cover) {
    // A partial boot (paint without the cover) still needs its scroll lock and
    // background cleared; a normal load must keep whatever the app set.
    if (hadMarker) unlockBootPaint();
    return;
  }
  if (
    reducedMotion() ||
    typeof requestAnimationFrame !== "function"
  ) {
    clearSuiteHandoffCover();
    return;
  }

  const radius =
    Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 2) + 24;
  const started = performance.now();
  const frame = (now: number): void => {
    const progress = Math.min(1, (now - started) / IRIS_OPEN_MS);
    const eased = 1 - Math.pow(1 - progress, 3);
    const r = radius * eased;
    const mask = `radial-gradient(circle at 50% 50%, transparent 0, transparent ${r}px, #000 ${r + 1}px)`;
    cover.style.setProperty("-webkit-mask-image", mask);
    cover.style.setProperty("mask-image", mask);
    if (progress < 1) {
      requestAnimationFrame(frame);
      return;
    }
    cover.remove();
    unlockBootPaint();
  };
  requestAnimationFrame(frame);
}
