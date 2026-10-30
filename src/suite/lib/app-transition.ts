/**
 * Outgoing half of the cross-app handoff.
 *
 * The suite apps live on different origins, so the browser replaces the whole
 * document and no DOM node can survive the switch. The illusion is a match cut:
 * the companion walks to the centre, a brand-coloured iris closes over the
 * screen, and the destination paints the same flat frame from its index.html
 * boot cover before React mounts.
 *
 * `APP_TRANSITION_COLOURS` is duplicated as a literal in each app's index.html
 * because static HTML cannot import this module. Keep them in sync.
 */

import {
  SUITE_GLYPHS,
  type SuiteGlyphElement,
  type SuiteIconName,
} from "../icons/glyphs";
import { SUITE_APP_MAP, type SuiteAppSlug } from "./apps";

export type SuiteTransitionSlug = SuiteAppSlug;

/** Flat colour the iris closes on. Mirrored in each app's index.html. */
export const APP_TRANSITION_COLOURS: Record<SuiteTransitionSlug, string> = {
  shellstack: "#005a9e",
  tides: "#8f2d96",
  turtletime: "#173521",
  kraken: "#191919",
  shelly: "#25232b",
};

const OVERLAY_ID = "suite-app-transition";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const WALK_MS = 460;
const CUE_HOLD_MS = 360;
const MORPH_MS = 200;
const IRIS_CLOSE_MS = 360;
const GLYPH_SIZE = 56;

/**
 * The assistant becomes a small object that means the destination app — not
 * the app's logo tile. The destination boot cover paints the same glyph.
 */
const TRANSITION_GLYPHS: Record<SuiteTransitionSlug, SuiteIconName> = {
  shellstack: "organisation",
  tides: "kanban-wave",
  turtletime: "timer-shell",
  kraken: "squid-doc",
  shelly: "crew-bot",
};

const GLYPH_INK: Record<
  SuiteTransitionSlug,
  { line: string; accent: string }
> = {
  shellstack: { line: "#ffffff", accent: "#bfe3ff" },
  tides: { line: "#ffffff", accent: "#bfe3ff" },
  turtletime: { line: "#f7ead0", accent: "#f3c24e" },
  kraken: { line: "#ffffff", accent: "#d4d4d4" },
  shelly: { line: "#f8f3ef", accent: "#f5a28d" },
};
const SVG_NS = "http://www.w3.org/2000/svg";

/** sessionStorage marker written on the callback load and consumed on arrival. */
export const SUITE_HANDOFF_STORAGE_KEY = "suite:handoff";
/** Id of the pre-paint cover injected by each app's index.html. */
export const SUITE_HANDOFF_COVER_ID = "suite-handoff-cover";

type Box = { left: number; top: number; width: number; height: number };

export interface SuiteAppTransitionHandle {
  /** Resolves when the companion/icon has reached the centre. */
  ready: Promise<void>;
  /** Closes the iris. Resolves once the screen is the target colour. */
  cover: () => Promise<void>;
  /** Removes the overlay and restores the companion immediately. */
  cancel: () => void;
}

const NOOP_HANDLE: SuiteAppTransitionHandle = {
  ready: Promise.resolve(),
  cover: () => Promise.resolve(),
  cancel: () => undefined,
};

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

function isVisible(node: HTMLElement | null): boolean {
  if (!node) return false;
  const rect = node.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return false;
  return window.getComputedStyle(node).visibility !== "hidden";
}

function squareAround(rect: DOMRect, size: number): Box {
  return {
    left: rect.left + rect.width / 2 - size / 2,
    top: rect.top + rect.height / 2 - size / 2,
    width: size,
    height: size,
  };
}

function glyphSvg(app: SuiteTransitionSlug): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "44");
  svg.setAttribute("height", "44");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const ink = GLYPH_INK[app];
  for (const element of SUITE_GLYPHS[TRANSITION_GLYPHS[app]].elements) {
    const colour = element.accent ? ink.accent : ink.line;
    let node: SVGElement;
    if (element.kind === "path") {
      node = document.createElementNS(SVG_NS, "path");
      node.setAttribute("d", element.d);
      if (element.transform) node.setAttribute("transform", element.transform);
    } else if (element.kind === "circle") {
      node = document.createElementNS(SVG_NS, "circle");
      node.setAttribute("cx", String(element.cx));
      node.setAttribute("cy", String(element.cy));
      node.setAttribute("r", String(element.r));
    } else {
      node = document.createElementNS(SVG_NS, "rect");
      node.setAttribute("x", String(element.x));
      node.setAttribute("y", String(element.y));
      node.setAttribute("width", String(element.width));
      node.setAttribute("height", String(element.height));
      if (element.rx !== undefined) node.setAttribute("rx", String(element.rx));
    }
    node.setAttribute("fill", element.filled ? colour : "none");
    node.setAttribute("stroke", element.filled ? "none" : colour);
    svg.appendChild(node);
  }
  return svg;
}

function createGlyphStage(app: SuiteTransitionSlug): HTMLSpanElement {
  const stage = document.createElement("span");
  stage.setAttribute("data-suite-handoff-glyph", "");
  stage.style.cssText = `position:fixed;left:50%;top:50%;width:${GLYPH_SIZE}px;height:${GLYPH_SIZE}px;transform:translate(-50%,-50%) scale(.72);display:grid;place-items:center;opacity:0;pointer-events:none;z-index:3;`;
  stage.appendChild(glyphSvg(app));
  return stage;
}

/**
 * Starts the companion walk. Call `cover()` once the handoff is ready to
 * navigate, or `cancel()` when it failed. No-ops for reduced motion, new tabs
 * (`enabled: false`) or a transition already running.
 */
export function startSuiteAppTransition(
  app: SuiteTransitionSlug,
  options: { enabled?: boolean } = {},
): SuiteAppTransitionHandle {
  if (
    typeof document === "undefined" ||
    typeof window === "undefined" ||
    options.enabled === false ||
    reducedMotion() ||
    document.getElementById(OVERLAY_ID)
  ) {
    return NOOP_HANDLE;
  }

  const colour = APP_TRANSITION_COLOURS[app];
  const avatar = document.querySelector<HTMLElement>("[data-assistant-avatar]");
  const trigger = document.querySelector<HTMLElement>(
    '[data-test="app-switcher-trigger"]',
  );
  const companionVisible = isVisible(avatar);
  const anchor = companionVisible ? avatar : trigger;
  const stage =
    companionVisible && avatar
      ? avatar.closest<HTMLElement>('[data-test="floating-assistant"]')
      : null;
  const rect = anchor?.getBoundingClientRect();
  const box: Box =
    companionVisible && rect
      ? {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        }
      : rect
        ? squareAround(rect, 48)
        : {
            left: window.innerWidth - 88,
            top: window.innerHeight - 88,
            width: 48,
            height: 48,
          };

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483646;overflow:hidden;pointer-events:auto;background:transparent;";

  const vehicle = document.createElement("div");
  vehicle.setAttribute("data-suite-handoff-vehicle", "");
  vehicle.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;display:grid;place-items:center;transform-origin:50% 50%;will-change:transform;`;

  let idleNode: HTMLElement | null = null;
  if (companionVisible && avatar) {
    const clone = avatar.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-assistant-avatar");
    clone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.display = "grid";
    clone.style.placeItems = "center";
    vehicle.appendChild(clone);
    idleNode = clone;
  } else {
    const image = document.createElement("img");
    image.src = SUITE_APP_MAP[app].icon;
    image.alt = "";
    image.style.cssText = "width:100%;height:100%;object-fit:contain;";
    vehicle.appendChild(image);
    idleNode = image;
  }

  const cue = document.createElement("span");
  cue.setAttribute("data-suite-handoff-cue", "");
  cue.textContent = "?";
  cue.style.cssText =
    "position:fixed;left:50%;top:50%;display:grid;place-items:center;width:32px;height:32px;border-radius:999px;background:#fff;color:#111;font:700 18px/1 system-ui,sans-serif;box-shadow:0 10px 28px rgba(0,0,0,.22);opacity:0;transform:translate(-50%,calc(-100% - 72px)) scale(.6);pointer-events:none;z-index:3;";

  const glyph = createGlyphStage(app);
  vehicle.style.zIndex = "1";
  overlay.append(vehicle, cue, glyph);
  document.body.appendChild(overlay);
  document.getElementById("root")?.setAttribute("inert", "");

  const hideNode = companionVisible ? (stage ?? avatar) : null;
  const previousVisibility = hideNode?.style.visibility ?? "";
  if (hideNode) hideNode.style.visibility = "hidden";

  const dx =
    window.innerWidth / 2 - (box.left + box.width / 2);
  const dy =
    window.innerHeight / 2 - (box.top + box.height / 2);
  const scale = Math.min(1.2, Math.max(1, 64 / Math.max(box.width, 1)));

  let ready = Promise.resolve();
  if (typeof vehicle.animate === "function") {
    const walk = vehicle.animate(
      [
        { transform: "translate(0px,0px) scale(1) rotate(0deg)" },
        {
          transform: `translate(${dx * 0.35}px,${dy * 0.35 - 26}px) scale(${1 + (scale - 1) * 0.55}) rotate(-9deg)`,
          offset: 0.45,
        },
        {
          transform: `translate(${dx * 0.82}px,${dy * 0.82 + 8}px) scale(${scale * 1.06}) rotate(7deg)`,
          offset: 0.78,
        },
        { transform: `translate(${dx}px,${dy}px) scale(${scale}) rotate(0deg)` },
      ],
      {
        duration: WALK_MS,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards",
      },
    );
    ready = walk.finished
      .catch(() => undefined)
      .then(() => {
        vehicle.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
        idleNode?.animate(
          [
            { transform: "translateY(0) rotate(0deg)" },
            { transform: "translateY(-5px) rotate(-4deg)", offset: 0.35 },
            { transform: "translateY(-1px) rotate(4deg)", offset: 0.7 },
            { transform: "translateY(0) rotate(0deg)" },
          ],
          { duration: 1400, iterations: Infinity, easing: "ease-in-out" },
        );
        cue.style.transition =
          "opacity 120ms ease, transform 180ms cubic-bezier(.22,1,.36,1)";
        cue.style.opacity = "1";
        cue.style.transform =
          "translate(-50%,calc(-100% - 72px)) scale(1)";
      });
  } else {
    vehicle.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
  }

  let covered = false;
  const cover = async (): Promise<void> => {
    await ready;
    if (covered) return;
    covered = true;
    // Let the confused beat land before the iris swallows it.
    await new Promise((resolve) => window.setTimeout(resolve, CUE_HOLD_MS));
    idleNode?.getAnimations?.().forEach((animation) => animation.cancel());
    vehicle.style.transition = "opacity 150ms ease";
    cue.style.transition = "opacity 120ms ease";
    glyph.style.transition = `opacity ${MORPH_MS}ms ease, transform ${MORPH_MS}ms cubic-bezier(.22,1,.36,1)`;
    vehicle.style.opacity = "0";
    cue.style.opacity = "0";
    glyph.style.opacity = "1";
    glyph.style.transform = "translate(-50%,-50%) scale(1)";
    // Let the assistant become the destination object before the iris closes.
    await new Promise((resolve) => window.setTimeout(resolve, MORPH_MS));
    const disc = document.createElement("div");
    disc.setAttribute("data-suite-handoff-cover", "");
    disc.style.cssText = `position:fixed;inset:0;z-index:2;background:${colour};clip-path:circle(0px at 50% 50%);`;
    overlay.insertBefore(disc, glyph);
    const radius =
      Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 2) + 24;
    if (typeof disc.animate === "function") {
      await disc
        .animate(
          [
            { clipPath: "circle(0px at 50% 50%)" },
            { clipPath: `circle(${radius}px at 50% 50%)` },
          ],
          {
            duration: IRIS_CLOSE_MS,
            easing: "cubic-bezier(.4,0,.2,1)",
            fill: "forwards",
          },
        )
        .finished.catch(() => undefined);
    }
    disc.style.clipPath = `circle(${radius}px at 50% 50%)`;
  };

  const cancel = (): void => {
    if (hideNode) hideNode.style.visibility = previousVisibility;
    document.getElementById("root")?.removeAttribute("inert");
    overlay.remove();
  };

  return { ready, cover, cancel };
}
