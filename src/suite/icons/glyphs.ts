/**
 * Suite icon glyph definitions — pure path data, no React.
 *
 * Shared geometric grammar (lucide-compatible):
 * - 24×24 viewBox
 * - 2px strokes, round caps/joins (set by the renderer)
 * - `fill="none" stroke="currentColor"` unless `filled: true`
 *
 * Elements flagged `accent: true` are rendered inside a group coloured by
 * `var(--suite-icon-accent, currentColor)` — `<SuiteIcon accent="…">` sets the
 * variable from `app-accents.ts`; without an accent they inherit the text
 * colour like any lucide icon.
 */

export type SuiteGlyphElement =
  | {
      kind: "path";
      d: string;
      accent?: boolean;
      filled?: boolean;
      transform?: string;
    }
  | {
      kind: "circle";
      cx: number;
      cy: number;
      r: number;
      accent?: boolean;
      filled?: boolean;
    }
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      rx?: number;
      accent?: boolean;
      filled?: boolean;
    };

export interface SuiteGlyph {
  /** One-line description of what the mark depicts (used in docs/sheets). */
  description: string;
  elements: SuiteGlyphElement[];
  /**
   * The accent group carries a subtle CSS animation (today-sun rays only).
   * Renderers must honour prefers-reduced-motion; see suite-icon.tsx.
   */
  animatedAccent?: boolean;
}

export type SuiteIconName =
  | "timer-shell"
  | "kanban-wave"
  | "squid-doc"
  | "stack-hex"
  | "crew-bot"
  | "shelly-snail"
  | "workspace"
  | "organisation"
  | "integration-plug"
  | "suite-grid"
  | "bell-wave"
  | "today-sun";

export const SUITE_GLYPHS: Record<SuiteIconName, SuiteGlyph> = {
  "timer-shell": {
    description: "TurtleTime — turtle-shell dome holding clock hands",
    elements: [
      { kind: "path", d: "M3 17h18" },
      { kind: "path", d: "M6.5 17a5.5 5.5 0 0 1 11 0" },
      { kind: "circle", cx: 4, cy: 15.3, r: 1.5 },
      { kind: "path", d: "M12 17v-3.4", accent: true },
      { kind: "path", d: "M12 17l2.4-1.4", accent: true },
    ],
  },
  "kanban-wave": {
    description: "Tides — three kanban bars riding a wave",
    elements: [
      { kind: "rect", x: 5.5, y: 8, width: 3, height: 8, rx: 1.5 },
      { kind: "rect", x: 10.5, y: 5.5, width: 3, height: 10.5, rx: 1.5 },
      { kind: "rect", x: 15.5, y: 9.5, width: 3, height: 6.5, rx: 1.5 },
      {
        kind: "path",
        d: "M3 19.5q2.25-2.4 4.5 0t4.5 0t4.5 0t4.5 0",
        accent: true,
      },
    ],
  },
  "squid-doc": {
    description: "Kraken — squid with a pen-nib centre tentacle",
    elements: [
      {
        kind: "path",
        d: "M12 3.2c2.7 2.3 4.2 5.3 4.2 9.3H7.8c0-4 1.5-7 4.2-9.3Z",
      },
      { kind: "circle", cx: 10.1, cy: 9, r: 0.9, filled: true },
      { kind: "circle", cx: 13.9, cy: 9, r: 0.9, filled: true },
      { kind: "path", d: "M9.4 12.4v4.8q0 2.3-2.3 2.3" },
      { kind: "path", d: "M14.6 12.4v4.8q0 2.3 2.3 2.3" },
      { kind: "path", d: "M12 12.4v7.1", accent: true },
    ],
  },
  "stack-hex": {
    description: "ShellStack — hexagon with the resolving spiral",
    elements: [
      { kind: "path", d: "M18 12l-3 5.2H9l-3-5.2 3-5.2h6Z" },
      { kind: "path", d: "M14.2 9.3H9.8v5.4h4.4v-2.7h-2.2", accent: true },
    ],
  },
  "crew-bot": {
    description: "Crew — friendly robot head with antenna and smile",
    elements: [
      { kind: "path", d: "M12 7.5V5" },
      { kind: "circle", cx: 12, cy: 4, r: 1, filled: true },
      { kind: "rect", x: 5, y: 8, width: 14, height: 9.5, rx: 3 },
      { kind: "path", d: "M5 11.8H3.4" },
      { kind: "path", d: "M19 11.8h1.6" },
      { kind: "circle", cx: 9.2, cy: 11.8, r: 1, filled: true },
      { kind: "circle", cx: 14.8, cy: 11.8, r: 1, filled: true },
      { kind: "path", d: "M9.6 14.6q2.4 1.7 4.8 0", accent: true },
    ],
  },
  "shelly-snail": {
    description: "Shelly — smiling snail with spiral shell and ball-tipped antennae",
    elements: [
      {
        kind: "path",
        d: "M2931 37263 c-1542 -737 -1730 -2870 -339 -3838 427 -297 339 1 1730 -5802 102 -425 101 -430 -391 -950 -1003 -1062 -1175 -1507 -1834 -4748 -1525 -7505 -1398 -10142 668 -13875 2061 -3724 4835 -5715 9185 -6592 2869 -579 4928 -582 8750 -15 1293 192 3408 506 4700 697 6839 1012 8768 1422 9385 1993 1103 1021 425 2357 -1733 3414 l-944 462 916 620 c5469 3705 5358 13657 -209 18536 -2592 2272 -5133 3185 -8865 3185 -3361 0 -5965 -948 -8226 -2994 -501 -453 -824 -546 -824 -235 0 70 301 1416 668 2991 668 2863 668 2863 1053 3101 1156 713 1317 2506 305 3395 -1583 1390 -3787 234 -3592 -1885 61 -673 61 -673 -1165 -3013 l-1227 -2340 -1303 -10 -1303 -10 -1267 2463 c-1202 2337 -1261 2480 -1155 2784 610 1750 -1309 3465 -2983 2666z m1743 -1216 c309 -354 379 -713 232 -1191 -205 -669 -183 -731 1300 -3583 1821 -3503 1488 -3127 2631 -2970 816 112 1053 109 1729 -25 587 -117 813 -127 901 -42 64 63 778 1394 1586 2958 1470 2844 1470 2844 1345 3365 -208 868 106 1458 852 1598 1380 258 1829 -1605 545 -2260 -501 -255 -427 -36 -1292 -3813 l-725 -3166 513 -617 c1210 -1453 1328 -2014 1709 -8068 224 -3562 368 -4603 790 -5688 820 -2113 2775 -3739 5643 -4695 2847 -948 5589 -1186 7567 -654 l850 228 1070 -471 c2352 -1034 2946 -1824 1719 -2288 -1707 -647 -14950 -2665 -17489 -2665 -5500 0 -9506 1872 -11922 5573 -2564 3926 -2753 6473 -1075 14490 542 2586 754 3104 1682 4102 778 837 757 677 322 2415 -188 754 -529 2180 -757 3170 -228 990 -436 1878 -463 1973 -27 95 -246 260 -486 366 -685 303 -961 1115 -610 1795 335 647 1332 736 1833 163z m21523 -6801 c6385 -1036 10732 -7090 9753 -13583 -628 -4167 -2948 -6812 -6688 -7626 -6108 -1329 -10963 4878 -8256 10556 1608 3373 6202 4320 8566 1766 2055 -2219 1699 -6037 -662 -7096 -2082 -935 -4058 98 -4184 2187 -93 1553 1143 2685 2287 2093 607 -313 709 -1340 148 -1481 -564 -142 -462 -962 120 -962 1033 2 1610 1420 1015 2496 -814 1471 -2971 1452 -3972 -37 -1601 -2380 159 -5650 3046 -5658 2778 -8 4680 2269 4503 5390 -265 4668 -5206 7028 -9332 4457 -3911 -2438 -4439 -8515 -1057 -12167 l561 -607 -647 327 c-2556 1290 -3718 2796 -4088 5301 -61 411 -201 2166 -311 3898 -312 4898 -436 5802 -952 6962 l-261 588 532 493 c1419 1314 3729 2427 5782 2786 639 112 3218 59 4097 -83z M5574 23846 c-476 -475 -431 -1229 97 -1644 835 -658 1687 739 970 1590 -326 388 -715 407 -1067 54z M12075 23992 c-669 -390 -584 -1598 134 -1896 608 -252 1135 289 1057 1085 -72 728 -654 1124 -1191 811z M7801 22451 c-626 -754 1585 -1648 2460 -995 485 362 676 688 546 932 -155 288 -335 267 -719 -84 -549 -502 -1237 -469 -1728 82 -224 251 -389 271 -559 65z",
        filled: true,
        transform: "translate(0.88 22.8) scale(0.0005714 -0.0005714)",
      },
    ],
  },

  workspace: {
    description: "Workspace container — panel with header bar and content",
    elements: [
      { kind: "rect", x: 3.5, y: 4.5, width: 17, height: 15, rx: 2.5 },
      { kind: "path", d: "M3.5 8.7h17" },
      { kind: "circle", cx: 6.2, cy: 6.6, r: 0.9, accent: true, filled: true },
      { kind: "path", d: "M6.4 12.2h7" },
      { kind: "path", d: "M6.4 15.4h10.5" },
    ],
  },
  organisation: {
    description: "Organisation chart — root node with two members",
    elements: [
      {
        kind: "rect",
        x: 9.5,
        y: 3.5,
        width: 5,
        height: 5,
        rx: 1.4,
        accent: true,
      },
      { kind: "path", d: "M12 8.5v2.5" },
      { kind: "path", d: "M6.75 13.5v-2.5h10.5v2.5" },
      { kind: "rect", x: 4.25, y: 13.5, width: 5, height: 5, rx: 1.4 },
      { kind: "rect", x: 14.75, y: 13.5, width: 5, height: 5, rx: 1.4 },
    ],
  },
  "integration-plug": {
    description: "Integration — two plug halves meeting under a spark",
    elements: [
      { kind: "rect", x: 3.2, y: 9.8, width: 5.6, height: 4.6, rx: 1.4 },
      { kind: "path", d: "M8.8 11h2.4" },
      { kind: "path", d: "M8.8 13.2h2.4" },
      { kind: "rect", x: 15.2, y: 9.8, width: 5.6, height: 4.6, rx: 1.4 },
      { kind: "path", d: "M15.2 11h-2.4" },
      { kind: "path", d: "M15.2 13.2h-2.4" },
      { kind: "path", d: "M6 14.4v2q0 1.4-1.4 1.4H3.4" },
      { kind: "path", d: "M18 14.4v2q0 1.4 1.4 1.4h1.2" },
      { kind: "path", d: "M12 4.4v2.4", accent: true },
      { kind: "path", d: "M10.4 5l3.2 1.2", accent: true },
      { kind: "path", d: "M13.6 5l-3.2 1.2", accent: true },
    ],
  },
  "suite-grid": {
    description: "Suite app switcher — four tiles, the active app filled",
    elements: [
      { kind: "rect", x: 4, y: 4, width: 7, height: 7, rx: 2 },
      { kind: "rect", x: 13, y: 4, width: 7, height: 7, rx: 2 },
      { kind: "rect", x: 4, y: 13, width: 7, height: 7, rx: 2 },
      {
        kind: "rect",
        x: 13,
        y: 13,
        width: 7,
        height: 7,
        rx: 2,
        accent: true,
        filled: true,
      },
    ],
  },
  "bell-wave": {
    description: "Notifications — bell with sound waves",
    elements: [
      {
        kind: "path",
        d: "M7 9.2a5 5 0 0 1 10 0c0 5.3 2.4 7.3 2.4 7.3H4.6S7 14.5 7 9.2",
      },
      { kind: "path", d: "M10.7 19.3a1.5 1.5 0 0 0 2.6 0" },
      { kind: "path", d: "M17.9 6.4a5.5 5.5 0 0 1 1.4 3.7", accent: true },
      { kind: "path", d: "M15.7 4a9.4 9.4 0 0 1 2.4 6", accent: true },
    ],
  },
  "today-sun": {
    description: "Today — sun with slowly turning rays (motion-safe)",
    animatedAccent: true,
    elements: [
      { kind: "circle", cx: 12, cy: 12, r: 4 },
      { kind: "path", d: "M12 2.8v2.4", accent: true },
      { kind: "path", d: "M12 18.8v2.4", accent: true },
      { kind: "path", d: "M2.8 12h2.4", accent: true },
      { kind: "path", d: "M18.8 12h2.4", accent: true },
      { kind: "path", d: "M5.5 5.5l1.7 1.7", accent: true },
      { kind: "path", d: "M16.8 16.8l1.7 1.7", accent: true },
      { kind: "path", d: "M5.5 18.5l1.7-1.7", accent: true },
      { kind: "path", d: "M16.8 7.2l1.7-1.7", accent: true },
    ],
  },
};

export const SUITE_ICON_NAMES = Object.keys(SUITE_GLYPHS) as SuiteIconName[];
