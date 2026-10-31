/**
 * Incoming half of the cross-app handoff.
 *
 * The destination index.html paints a themed cover with a companion silhouette
 * before React mounts. Once the app shell and the real companion are rendered,
 * this module opens the iris and flies the real companion from the centre back
 * to its home.
 */

import {
  SUITE_HANDOFF_COVER_ID,
  SUITE_HANDOFF_LINK_DOT,
  SUITE_HANDOFF_LINK_PATH,
  SUITE_HANDOFF_STORAGE_KEY,
} from "./app-transition";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IRIS_OPEN_MS = 420;
const REVERSE_MS = 340;
const RETURN_MS = 520;

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
    /* optional */
  }
}

function unlockBootPaint(): void {
  document.documentElement.style.overflow = "";
  document.documentElement.style.backgroundColor = "";
}



function startReturnFlight(cover: HTMLElement): void {
  if (
    typeof Element === "undefined" ||
    typeof Element.prototype.animate !== "function"
  ) {
    return;
  }
  const avatar = document.querySelector<HTMLElement>("[data-assistant-avatar]");
  if (!avatar) return;
  const avatarRect = avatar.getBoundingClientRect();
  if (avatarRect.width < 8 || avatarRect.height < 8) return;

  const centre = cover.querySelector<HTMLElement>(
    "[data-suite-handoff-companion]",
  );
  const startRect =
    centre?.getBoundingClientRect() ??
    ({
      left: window.innerWidth / 2 - 32,
      top: window.innerHeight / 2 - 32,
      width: 64,
      height: 64,
    } as DOMRect);

  const stage = avatar.closest<HTMLElement>('[data-test="floating-assistant"]');
  const hideNode = stage ?? avatar;
  const previousVisibility = hideNode.style.visibility;

  const flight = document.createElement("div");
  flight.setAttribute("data-suite-handoff-flight", "");
  flight.setAttribute("aria-hidden", "true");
  flight.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;overflow:hidden;pointer-events:none;";

  const ghost = avatar.cloneNode(true) as HTMLElement;
  ghost.removeAttribute("data-assistant-avatar");
  ghost.style.position = "absolute";
  ghost.style.left = `${startRect.left}px`;
  ghost.style.top = `${startRect.top}px`;
  ghost.style.width = `${startRect.width}px`;
  ghost.style.height = `${startRect.height}px`;
  ghost.style.display = "grid";
  ghost.style.placeItems = "center";
  ghost.style.transform = "scale(.9)";
  ghost.style.opacity = "1";
  ghost.querySelector("svg")?.setAttribute("width", "100%");
  ghost.querySelector("svg")?.setAttribute("height", "100%");

  const clone = ghost.cloneNode(true) as HTMLElement;
  clone.style.left = `${avatarRect.left}px`;
  clone.style.top = `${avatarRect.top}px`;
  clone.style.width = `${avatarRect.width}px`;
  clone.style.height = `${avatarRect.height}px`;
  clone.style.transform = "scale(.9)";
  clone.style.opacity = "0";

  flight.append(ghost, clone);
  document.body.appendChild(flight);
  hideNode.style.visibility = "hidden";

  const svg = ghost.querySelector<SVGSVGElement>("svg[data-companion]");
  const body = svg?.querySelector<SVGPathElement>(
    ".terminal-body > path:not(.friend-detail)",
  );
  const face = svg?.querySelector<SVGGElement>(".face-pose");
  const originalPath = body?.getAttribute("d") ?? "";
  const startAsLink = Boolean(body && originalPath);
  if (body && originalPath) {
    svg?.querySelector(".friend-detail")?.remove();
    body.setAttribute("d", SUITE_HANDOFF_LINK_PATH);
    face?.style.setProperty("opacity", "0");
    face?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      delay: 80,
      fill: "forwards",
    });

    const dot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    dot.setAttribute("d", SUITE_HANDOFF_LINK_DOT);
    dot.setAttribute("fill", body.getAttribute("fill") ?? "none");
    dot.setAttribute("stroke", body.getAttribute("stroke") ?? "currentColor");
    dot.setAttribute("stroke-width", "3.5");
    dot.setAttribute("stroke-linejoin", "round");
    dot.classList.add("suite-handoff-dot");
    body.parentElement?.appendChild(dot);
    dot.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 180,
      delay: 120,
      fill: "forwards",
    });

    try {
      body
        .animate(
          [
            { d: `path("${SUITE_HANDOFF_LINK_PATH}")` },
            { d: `path("${originalPath}")` },
          ],
          { duration: REVERSE_MS, easing: "ease-in-out", fill: "forwards" },
        )
        .finished.then(() => {
          body.setAttribute("d", originalPath);
          dot.remove();
          face?.style.setProperty("opacity", "1");
        })
        .catch(() => {
          body.setAttribute("d", originalPath);
          dot.remove();
          face?.style.setProperty("opacity", "1");
        });
    } catch {
      body.setAttribute("d", originalPath);
      dot.remove();
      face?.style.setProperty("opacity", "1");
    }
  }

  const startFlight = (): void => {
  const dx =
    avatarRect.left +
    avatarRect.width / 2 -
    (startRect.left + startRect.width / 2);
  const dy =
    avatarRect.top +
    avatarRect.height / 2 -
    (startRect.top + startRect.height / 2);

  const fly = ghost.animate(
    [
      { transform: "translate(0px,0px) scale(.9)", opacity: 1 },
      {
        transform: `translate(${dx * 0.35}px,${dy * 0.35 - 18}px) scale(.96)`,
        offset: 0.4,
        opacity: 1,
      },
      { transform: `translate(${dx}px,${dy}px) scale(1)`, opacity: 0 },
    ],
    {
      duration: RETURN_MS,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "forwards",
    },
  );
  const materialise = clone.animate(
    [
      { opacity: 0, transform: "scale(.9)" },
      { opacity: 0, offset: 0.55 },
      { opacity: 1, transform: "scale(1)" },
    ],
    { duration: RETURN_MS, easing: "ease-out", fill: "forwards" },
  );

  void Promise.all([
    fly.finished.catch(() => undefined),
    materialise.finished.catch(() => undefined),
  ]).finally(() => {
    flight.remove();
    hideNode.style.visibility = previousVisibility;
  });
  };
  window.setTimeout(
    startFlight,
    startAsLink ? Math.max(REVERSE_MS, IRIS_OPEN_MS) : 0,
  );
}

export function clearSuiteHandoffCover(): void {
  if (typeof document === "undefined") return;
  forgetHandoff();
  unlockBootPaint();
  document.getElementById(SUITE_HANDOFF_COVER_ID)?.remove();
}

export function playSuiteHandoffEnter(): void {
  if (typeof document === "undefined") return;
  let hadMarker = false;
  try {
    hadMarker = sessionStorage.getItem(SUITE_HANDOFF_STORAGE_KEY) === "1";
  } catch {
    /* optional */
  }
  const cover = document.getElementById(SUITE_HANDOFF_COVER_ID);
  forgetHandoff();
  if (!cover) {
    if (hadMarker) unlockBootPaint();
    return;
  }
  if (
    reducedMotion() ||
    typeof requestAnimationFrame !== "function" ||
    typeof Element.prototype.animate !== "function"
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
