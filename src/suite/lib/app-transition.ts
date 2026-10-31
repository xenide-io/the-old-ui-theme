/**
 * Outgoing half of the cross-app handoff.
 *
 * The suite apps live on different origins, so the browser replaces the whole
 * document. The floating companion travels to the centre, adopts the
 * destination app's companion palette, and an iris closes in that palette's
 * surface colour. No app icon or glyph is used.
 */

import type { SuiteAppSlug } from "./apps";

export type SuiteTransitionSlug = SuiteAppSlug;
export type SuiteColourMode = "light" | "dark";

export interface SuiteTransitionPalette {
  bg: string;
  fg: string;
  accents: string[];
}

const PALETTES: Record<
  SuiteTransitionSlug,
  Record<SuiteColourMode, SuiteTransitionPalette>
> = {
  shellstack: {
    light: {
      bg: "#edf6ff",
      fg: "#355773",
      accents: ["#80acd2", "#a69bd5", "#73b6b3", "#dba18d", "#c9b56e"],
    },
    dark: {
      bg: "#012456",
      fg: "#cccccc",
      accents: ["#3b78ff", "#61d6d6", "#f9f1a5", "#f2f2f2", "#e74856"],
    },
  },
  tides: {
    light: {
      bg: "#f6efff",
      fg: "#643080",
      accents: ["#80397b", "#a66ed2", "#cc91ba", "#899bce", "#c2a0dd"],
    },
    dark: {
      bg: "#232136",
      fg: "#e0def4",
      accents: ["#eb6f92", "#f6c177", "#9ccfd8", "#c4a7e7", "#ea9a97"],
    },
  },
  turtletime: {
    light: {
      bg: "#edf7ef",
      fg: "#185a35",
      accents: ["#34a853", "#81c995", "#47a89a", "#a7b85c", "#60b0c9"],
    },
    dark: {
      bg: "#173521",
      fg: "#f7ead0",
      accents: ["#69b879", "#f3c24e", "#a7d7b0", "#e4a18c", "#8fc9bf"],
    },
  },
  kraken: {
    light: {
      bg: "#f4ead5",
      fg: "#514332",
      accents: ["#91643b", "#68724c", "#aa6046", "#8c6373", "#a27b3e"],
    },
    dark: {
      bg: "#29231d",
      fg: "#f0dfbd",
      accents: ["#d5ab75", "#b7bd92", "#dc9273", "#c5a6a0", "#e8c99b"],
    },
  },
  shelly: {
    light: {
      bg: "#fff0e9",
      fg: "#783925",
      accents: ["#d24726", "#ed8a59", "#e7b36a", "#c97c80", "#b48ba3"],
    },
    dark: {
      bg: "#300a24",
      fg: "#eeeeec",
      accents: ["#e95420", "#ad7fa8", "#eeeeec", "#729fcf", "#8ae234"],
    },
  },
};

const SURFACES: Record<
  SuiteTransitionSlug,
  Record<SuiteColourMode, string>
> = {
  shellstack: { light: "#f5f7fa", dark: "#0a0f14" },
  tides: { light: "#f8f6fc", dark: "#191724" },
  turtletime: { light: "#f2f3f0", dark: "#0d120f" },
  kraken: { light: "#fafafa", dark: "#191919" },
  shelly: { light: "#faf6f2", dark: "#1d1b22" },
};

const GLOWS: Record<SuiteTransitionSlug, string> = {
  shellstack: "#0078d4",
  tides: "#7719aa",
  turtletime: "#419359",
  kraken: "#737373",
  shelly: "#ac3e26",
};

/** The destination app canvas, used behind the iris rather than a companion tint. */
export function suiteTransitionSurface(
  app: SuiteTransitionSlug,
  mode: SuiteColourMode = readSuiteColourMode(),
): string {
  return SURFACES[app][mode];
}

/** Subtle app-accent glow and a thin ring on the app canvas. */
export function suiteTransitionBackground(
  app: SuiteTransitionSlug,
  mode: SuiteColourMode = readSuiteColourMode(),
): string {
  const surface = SURFACES[app][mode];
  const glow = GLOWS[app];
  return [
    `radial-gradient(circle at 50% 46%, ${glow}30 0px, ${glow}12 38%, transparent 72%)`,
    surface,
  ].join(", ");
}

/** Light-mode surface colours for callers that only need one value. */
export const APP_TRANSITION_COLOURS: Record<SuiteTransitionSlug, string> = {
  shellstack: PALETTES.shellstack.light.bg,
  tides: PALETTES.tides.light.bg,
  turtletime: PALETTES.turtletime.light.bg,
  kraken: PALETTES.kraken.light.bg,
  shelly: PALETTES.shelly.light.bg,
};

const OVERLAY_ID = "suite-app-transition";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const WALK_MS = 460;
const CENTER_HOLD_MS = 220;
const IRIS_CLOSE_MS = 360;
const COMPANION_SIZE = 56;
const MORPH_MS = 340;
const SVG_NS = "http://www.w3.org/2000/svg";
export const SUITE_HANDOFF_LINK_PATH =
  "M13.393 16.393 C16.206 13.580 20.022 12.000 24.000 12.000 C27.978 12.000 31.794 13.580 34.607 16.393 C35.534 17.320 36.335 18.365 36.990 19.500 C38.307 21.780 39.000 24.367 39.000 27.000 C39.000 29.633 38.307 32.220 36.990 34.500 C36.335 35.635 35.534 36.680 34.607 37.607 C31.794 40.420 27.978 42.000 24.000 42.000 C20.022 42.000 16.206 40.420 13.393 37.607 C12.466 36.680 11.665 35.635 11.010 34.500 C9.693 32.220 9.000 29.633 9.000 27.000 C9.000 24.367 9.693 21.780 11.010 19.500 C11.665 18.365 12.466 17.320 13.393 16.393 Z";
export const SUITE_HANDOFF_LINK_DOT =
  "M29.393 26.393 C32.206 23.580 36.022 22.000 40.000 22.000 C43.978 22.000 47.794 23.580 50.607 26.393 C51.534 27.320 52.335 28.365 52.990 29.500 C54.307 31.780 55.000 34.367 55.000 37.000 C55.000 39.633 54.307 42.220 52.990 44.500 C52.335 45.635 51.534 46.680 50.607 47.607 C47.794 50.420 43.978 52.000 40.000 52.000 C36.022 52.000 32.206 50.420 29.393 47.607 C28.466 46.680 27.665 45.635 27.010 44.500 C25.693 42.220 25.000 39.633 25.000 37.000 C25.000 34.367 25.693 31.780 27.010 29.500 C27.665 28.365 28.466 27.320 29.393 26.393 Z";

export const SUITE_HANDOFF_STORAGE_KEY = "suite:handoff";
export const SUITE_HANDOFF_COVER_ID = "suite-handoff-cover";

type Box = { left: number; top: number; width: number; height: number };

export interface SuiteAppTransitionHandle {
  ready: Promise<void>;
  cover: () => Promise<void>;
  cancel: () => void;
}

const NOOP_HANDLE: SuiteAppTransitionHandle = {
  ready: Promise.resolve(),
  cover: () => Promise.resolve(),
  cancel: () => undefined,
};

export function readSuiteColourMode(): SuiteColourMode {
  try {
    const stored = document.cookie
      .match(/(?:^|;\s*)xenide-suite-theme=(light|dark|system)/)?.[1]
      ?.toLowerCase();
    if (stored === "light" || stored === "dark") return stored;
    if (stored === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    const theme = document.documentElement.getAttribute("data-theme") ?? "";
    if (document.documentElement.classList.contains("dark")) return "dark";
    if (theme.toLowerCase().includes("dark")) return "dark";
  } catch {
    /* optional */
  }
  return "light";
}

export function suiteTransitionPalette(
  app: SuiteTransitionSlug,
  mode: SuiteColourMode = readSuiteColourMode(),
): SuiteTransitionPalette {
  return PALETTES[app][mode];
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

let handoffGradientId = 0;

function paintCompanion(root: HTMLElement, palette: SuiteTransitionPalette) {
  const svg = root.querySelector<SVGSVGElement>("svg[data-companion]");
  if (!svg) return;
  svg.style.color = palette.fg;

  const gradient = svg.querySelector<SVGLinearGradientElement>("linearGradient");
  let gradientStroke: string | null = null;
  if (gradient) {
    const oldId = gradient.getAttribute("id");
    if (oldId) {
      const newId = `suite-handoff-g${++handoffGradientId}`;
      gradient.setAttribute("id", newId);
      gradientStroke = `url(#${newId})`;
      svg.querySelectorAll<SVGElement>("[stroke]").forEach((node) => {
        if (node.getAttribute("stroke") === `url(#${oldId})`) {
          node.setAttribute("stroke", gradientStroke!);
        }
      });
    }
  }
  const handoffStops = [
    palette.accents[0] ?? palette.fg,
    palette.fg,
    palette.accents[0] ?? palette.fg,
  ];
  gradient?.querySelectorAll("stop").forEach((stop, index) => {
    stop.setAttribute("stop-color", handoffStops[index] ?? palette.fg);
  });

  svg
    .querySelectorAll<SVGPathElement>(".terminal-body > path")
    .forEach((path) => {
      const fill = path.getAttribute("fill");
      if (fill && fill !== "none" && !fill.startsWith("url(")) {
        path.setAttribute("fill", palette.bg);
      }
      if (path.getAttribute("stroke")?.startsWith("url(")) {
        path.setAttribute(
          "stroke",
          gradientStroke ?? palette.accents[0] ?? palette.fg,
        );
      }
    });
}

/** Two paired gradient links: the connection mark used while auth completes. */
function connectionMark(palette: SuiteTransitionPalette): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 64 64");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");

  const id = `suite-handoff-link-${++handoffGradientId}`;
  const defs = document.createElementNS(SVG_NS, "defs");
  const gradient = document.createElementNS(SVG_NS, "linearGradient");
  gradient.setAttribute("id", id);
  gradient.setAttribute("x1", "0");
  gradient.setAttribute("y1", "0");
  gradient.setAttribute("x2", "1");
  gradient.setAttribute("y2", "1");
  [palette.accents[0] ?? palette.fg, palette.fg, palette.accents[0] ?? palette.fg].forEach(
    (colour, index) => {
      const stop = document.createElementNS(SVG_NS, "stop");
      stop.setAttribute("offset", String(index / 2));
      stop.setAttribute("stop-color", colour);
      gradient.appendChild(stop);
    },
  );
  defs.appendChild(gradient);

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute(
    "d",
    "M13.393 16.393 C16.206 13.580 20.022 12.000 24.000 12.000 C27.978 12.000 31.794 13.580 34.607 16.393 C35.534 17.320 36.335 18.365 36.990 19.500 C38.307 21.780 39.000 24.367 39.000 27.000 C39.000 29.633 38.307 32.220 36.990 34.500 C36.335 35.635 35.534 36.680 34.607 37.607 C31.794 40.420 27.978 42.000 24.000 42.000 C20.022 42.000 16.206 40.420 13.393 37.607 C12.466 36.680 11.665 35.635 11.010 34.500 C9.693 32.220 9.000 29.633 9.000 27.000 C9.000 24.367 9.693 21.780 11.010 19.500 C11.665 18.365 12.466 17.320 13.393 16.393 Z",
  );
  const dot = document.createElementNS(SVG_NS, "path");
  dot.setAttribute("class", "suite-handoff-dot");
  dot.setAttribute(
    "d",
    "M29.393 26.393 C32.206 23.580 36.022 22.000 40.000 22.000 C43.978 22.000 47.794 23.580 50.607 26.393 C51.534 27.320 52.335 28.365 52.990 29.500 C54.307 31.780 55.000 34.367 55.000 37.000 C55.000 39.633 54.307 42.220 52.990 44.500 C52.335 45.635 51.534 46.680 50.607 47.607 C47.794 50.420 43.978 52.000 40.000 52.000 C36.022 52.000 32.206 50.420 29.393 47.607 C28.466 46.680 27.665 45.635 27.010 44.500 C25.693 42.220 25.000 39.633 25.000 37.000 C25.000 34.367 25.693 31.780 27.010 29.500 C27.665 28.365 28.466 27.320 29.393 26.393 Z",
  );
  for (const node of [path, dot]) {
    node.setAttribute("fill", palette.bg);
    node.setAttribute("stroke", `url(#${id})`);
    node.setAttribute("stroke-width", "3.5");
    node.setAttribute("stroke-linejoin", "round");
  }
  svg.append(defs, path, dot);
  return svg;
}

/** Plays the terminal-avatar `connecting` change: body morphs, face hides. */
function morphToConnection(
  root: HTMLElement,
  palette: SuiteTransitionPalette,
  surface: string,
) {
  const svg = root.querySelector<SVGSVGElement>("svg[data-companion]");
  if (!svg) return;
  paintCompanion(root, palette);

  const body = svg.querySelector<SVGPathElement>(
    ".terminal-body > path:not(.friend-detail)",
  );
  const face = svg.querySelector<SVGGElement>(".face-pose");
  const oldDetail = svg.querySelector<SVGPathElement>(".friend-detail");

  if (body) {
    body.setAttribute("fill", surface);
    const from = body.getAttribute("d") ?? "";
    try {
      body
        .animate(
          [{ d: `path("${from}")` }, { d: `path("${SUITE_HANDOFF_LINK_PATH}")` }],
          { duration: MORPH_MS, easing: "ease-in-out", fill: "forwards" },
        )
        .finished.then(() => body.setAttribute("d", SUITE_HANDOFF_LINK_PATH))
        .catch(() => body.setAttribute("d", SUITE_HANDOFF_LINK_PATH));
    } catch {
      body.setAttribute("d", SUITE_HANDOFF_LINK_PATH);
    }
  }
  face?.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 180,
    fill: "forwards",
  });
  oldDetail?.remove();

  const stroke = body?.getAttribute("stroke") ?? palette.accents[0] ?? palette.fg;
  const paths = Array.from(
    svg.querySelectorAll<SVGPathElement>(
      ".terminal-body > path:not(.friend-detail)",
    ),
  );
  let dot = paths.find((path) => path !== body) ?? null;
  if (!dot) {
    dot = document.createElementNS(SVG_NS, "path");
    dot.setAttribute("d", SUITE_HANDOFF_LINK_DOT);
    dot.setAttribute("fill", surface);
    dot.setAttribute("stroke", stroke);
    dot.setAttribute("stroke-width", "3.5");
    dot.setAttribute("stroke-linejoin", "round");
    dot.setAttribute("opacity", "0");
    body?.parentElement?.appendChild(dot);
    dot.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 220,
      fill: "forwards",
    });
  } else {
    const from = dot.getAttribute("d") ?? "";
    try {
      dot
        .animate(
          [{ d: `path("${from}")` }, { d: `path("${SUITE_HANDOFF_LINK_DOT}")` }],
          { duration: MORPH_MS, easing: "ease-in-out", fill: "forwards" },
        )
        .finished.then(() => dot!.setAttribute("d", SUITE_HANDOFF_LINK_DOT))
        .catch(() => dot!.setAttribute("d", SUITE_HANDOFF_LINK_DOT));
    } catch {
      dot.setAttribute("d", SUITE_HANDOFF_LINK_DOT);
    }
  }
  dot.classList.add("suite-handoff-dot");

}

function companionStage(
  avatar: HTMLElement | null,
  palette: SuiteTransitionPalette,
  paint = true,
): HTMLElement {
  const stage = document.createElement("span");
  stage.setAttribute("data-suite-handoff-companion", "");
  stage.style.cssText = `position:fixed;left:50%;top:50%;width:${COMPANION_SIZE}px;height:${COMPANION_SIZE}px;transform:translate(-50%,-50%);display:grid;place-items:center;opacity:0;pointer-events:none;z-index:3;`;
  if (avatar) {
    const clone = avatar.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-assistant-avatar");
    clone.style.width = "100%";
    clone.style.height = "100%";
    clone.style.display = "grid";
    clone.style.placeItems = "center";
    clone.querySelector("svg")?.setAttribute("width", "100%");
    clone.querySelector("svg")?.setAttribute("height", "100%");
    if (paint) paintCompanion(clone, palette);
    stage.appendChild(clone);
  } else {
    stage.appendChild(connectionMark(palette));
  }
  return stage;
}

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

  const palette = suiteTransitionPalette(app);
  const surface = suiteTransitionSurface(app);
  const background = suiteTransitionBackground(app);
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
        ? squareAround(rect, COMPANION_SIZE)
        : {
            left: window.innerWidth - 88,
            top: window.innerHeight - 88,
            width: COMPANION_SIZE,
            height: COMPANION_SIZE,
          };

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483646;overflow:hidden;pointer-events:auto;background:transparent;";
  const vehicle = document.createElement("div");
  vehicle.setAttribute("data-suite-handoff-vehicle", "");
  vehicle.style.cssText = `position:fixed;left:${box.left}px;top:${box.top}px;width:${box.width}px;height:${box.height}px;display:grid;place-items:center;transform-origin:50% 50%;will-change:transform;z-index:1;`;

  const source = companionStage(avatar, palette, false);
  source.style.position = "relative";
  source.style.left = "0";
  source.style.top = "0";
  source.style.width = "100%";
  source.style.height = "100%";
  source.style.transform = "none";
  source.style.opacity = "1";
  source.style.zIndex = "1";
  vehicle.appendChild(source);

  const motion = document.createElement("style");
  motion.textContent =
    "@keyframes suite-handoff-join{0%,100%{transform:translate(3px,3px)}45%,55%{transform:translate(0,0)}}.suite-handoff-dot{animation:suite-handoff-join 2.4s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.suite-handoff-dot{animation:none!important}}";
  overlay.append(motion, vehicle);
  document.body.appendChild(overlay);
  document.getElementById("root")?.setAttribute("inert", "");

  const hideNode = companionVisible ? (stage ?? avatar) : null;
  const previousVisibility = hideNode?.style.visibility ?? "";
  if (hideNode) hideNode.style.visibility = "hidden";

  const dx = window.innerWidth / 2 - (box.left + box.width / 2);
  const dy = window.innerHeight / 2 - (box.top + box.height / 2);
  const scale = Math.min(1.18, Math.max(1, 64 / Math.max(box.width, 1)));
  const lift = app === "tides" || app === "shelly" ? -34 : -22;
  const tilt = app === "kraken" ? -14 : app === "turtletime" ? 10 : -7;

  let ready = Promise.resolve();
  if (typeof vehicle.animate === "function") {
    const walk = vehicle.animate(
      [
        { transform: "translate(0px,0px) scale(1) rotate(0deg)" },
        {
          transform: `translate(${dx * 0.35}px,${dy * 0.35 + lift}px) scale(${1 + (scale - 1) * 0.55}) rotate(${tilt}deg)`,
          offset: 0.45,
        },
        {
          transform: `translate(${dx * 0.82}px,${dy * 0.82 + 8}px) scale(${scale * 1.02}) rotate(${-tilt * 0.6}deg)`,
          offset: 0.78,
        },
        {
          transform: `translate(${dx}px,${dy}px) scale(${scale}) rotate(0deg)`,
        },
      ],
      {
        duration: WALK_MS,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "forwards",
      },
    );
    ready = walk.finished.catch(() => undefined).then(() => {
      vehicle.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
    });
  } else {
    vehicle.style.transform = `translate(${dx}px,${dy}px) scale(${scale})`;
  }

  let covered = false;
  const cover = async (): Promise<void> => {
    await ready;
    if (covered) return;
    covered = true;
    await new Promise((resolve) => window.setTimeout(resolve, CENTER_HOLD_MS));
    morphToConnection(source, palette, surface);
    await new Promise((resolve) => window.setTimeout(resolve, MORPH_MS));
    // Keep the joined-link companion above the iris so it survives the cut.
    vehicle.style.zIndex = "3";

    const disc = document.createElement("div");
    disc.setAttribute("data-suite-handoff-cover", "");
    disc.style.cssText = `position:fixed;inset:0;z-index:2;background:${background};clip-path:circle(0px at 50% 50%);`;
    overlay.appendChild(disc);
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
