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
const RETURN_MS = 520;

interface ReturnFlight {
  finished: Promise<void>;
}

/**
 * Flies the centre glyph to the destination companion's home and swaps it for
 * the real assistant. The app shell is already rendered behind the iris.
 */
function startReturnFlight(cover: HTMLElement): ReturnFlight | null {
  if (
    typeof Element === "undefined" ||
    typeof Element.prototype.animate !== "function"
  ) {
    return null;
  }
  const glyph = cover.querySelector<HTMLElement>("[data-suite-handoff-glyph]");
  const avatar = document.querySelector<HTMLElement>("[data-assistant-avatar]");
  if (!glyph || !avatar) return null;

  const avatarRect = avatar.getBoundingClientRect();
  const glyphRect = glyph.getBoundingClientRect();
  if (avatarRect.width < 8 || avatarRect.height < 8) return null;

  const stage = avatar.closest<HTMLElement>('[data-test="floating-assistant"]');
  const hideNode = stage ?? avatar;
  const previousVisibility = hideNode.style.visibility;

  const flight = document.createElement("div");
  flight.setAttribute("data-suite-handoff-flight", "");
  flight.setAttribute("aria-hidden", "true");
  flight.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;overflow:hidden;pointer-events:none;";

  const ghost = glyph.cloneNode(true) as HTMLElement;
  ghost.style.position = "absolute";
  ghost.style.left = `${glyphRect.left}px`;
  ghost.style.top = `${glyphRect.top}px`;
  ghost.style.width = `${glyphRect.width}px`;
  ghost.style.height = `${glyphRect.height}px`;
  ghost.style.transform = "none";
  ghost.style.opacity = "1";

  const clone = avatar.cloneNode(true) as HTMLElement;
  clone.removeAttribute("data-assistant-avatar");
  clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  clone.style.position = "absolute";
  clone.style.left = `${avatarRect.left}px`;
  clone.style.top = `${avatarRect.top}px`;
  clone.style.width = `${avatarRect.width}px`;
  clone.style.height = `${avatarRect.height}px`;
  clone.style.display = "grid";
  clone.style.placeItems = "center";
  clone.style.transform = "scale(.78)";
  clone.style.opacity = "0";

  flight.append(ghost, clone);
  document.body.appendChild(flight);
  hideNode.style.visibility = "hidden";

  const dx =
    avatarRect.left +
    avatarRect.width / 2 -
    (glyphRect.left + glyphRect.width / 2);
  const dy =
    avatarRect.top +
    avatarRect.height / 2 -
    (glyphRect.top + glyphRect.height / 2);

  const fly = ghost.animate(
    [
      { transform: "translate(0px,0px) scale(1)", opacity: 1 },
      {
        transform: `translate(${dx * 0.35}px,${dy * 0.35 - 18}px) scale(.92)`,
        offset: 0.4,
        opacity: 1,
      },
      { transform: `translate(${dx}px,${dy}px) scale(.78)`, opacity: 0 },
    ],
    {
      duration: RETURN_MS,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "forwards",
    },
  );
  const materialise = clone.animate(
    [
      { opacity: 0, transform: "scale(.78)" },
      { opacity: 0, offset: 0.55 },
      { opacity: 1, transform: "scale(1)" },
    ],
    { duration: RETURN_MS, easing: "ease-out", fill: "forwards" },
  );

  return {
    finished: Promise.all([
      fly.finished.catch(() => undefined),
      materialise.finished.catch(() => undefined),
    ])
      .then(() => undefined)
      .finally(() => {
        flight.remove();
        hideNode.style.visibility = previousVisibility;
      }),
  };
}

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

  try {
    startReturnFlight(cover);
  } catch {
    // The iris still opens if the return flight cannot run.
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
