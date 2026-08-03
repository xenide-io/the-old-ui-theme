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
      kind: 'path';
      d: string;
      accent?: boolean;
      filled?: boolean;
    }
  | {
      kind: 'circle';
      cx: number;
      cy: number;
      r: number;
      accent?: boolean;
      filled?: boolean;
    }
  | {
      kind: 'rect';
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
  | 'timer-shell'
  | 'kanban-wave'
  | 'squid-doc'
  | 'stack-hex'
  | 'crew-bot'
  | 'workspace'
  | 'organisation'
  | 'integration-plug'
  | 'suite-grid'
  | 'bell-wave'
  | 'today-sun';

export const SUITE_GLYPHS: Record<SuiteIconName, SuiteGlyph> = {
  'timer-shell': {
    description: 'TurtleTime — turtle-shell dome holding clock hands',
    elements: [
      { kind: 'path', d: 'M3 17h18' },
      { kind: 'path', d: 'M6.5 17a5.5 5.5 0 0 1 11 0' },
      { kind: 'circle', cx: 4, cy: 15.3, r: 1.5 },
      { kind: 'path', d: 'M12 17v-3.4', accent: true },
      { kind: 'path', d: 'M12 17l2.4-1.4', accent: true },
    ],
  },
  'kanban-wave': {
    description: 'Tides — three kanban bars riding a wave',
    elements: [
      { kind: 'rect', x: 5.5, y: 8, width: 3, height: 8, rx: 1.5 },
      { kind: 'rect', x: 10.5, y: 5.5, width: 3, height: 10.5, rx: 1.5 },
      { kind: 'rect', x: 15.5, y: 9.5, width: 3, height: 6.5, rx: 1.5 },
      {
        kind: 'path',
        d: 'M3 19.5q2.25-2.4 4.5 0t4.5 0t4.5 0t4.5 0',
        accent: true,
      },
    ],
  },
  'squid-doc': {
    description: 'Kraken — squid with a pen-nib centre tentacle',
    elements: [
      {
        kind: 'path',
        d: 'M12 3.2c2.7 2.3 4.2 5.3 4.2 9.3H7.8c0-4 1.5-7 4.2-9.3Z',
      },
      { kind: 'circle', cx: 10.1, cy: 9, r: 0.9, filled: true },
      { kind: 'circle', cx: 13.9, cy: 9, r: 0.9, filled: true },
      { kind: 'path', d: 'M9.4 12.4v4.8q0 2.3-2.3 2.3' },
      { kind: 'path', d: 'M14.6 12.4v4.8q0 2.3 2.3 2.3' },
      { kind: 'path', d: 'M12 12.4v7.1', accent: true },
    ],
  },
  'stack-hex': {
    description: 'ShellStack — hexagon with the resolving spiral',
    elements: [
      { kind: 'path', d: 'M18 12l-3 5.2H9l-3-5.2 3-5.2h6Z' },
      { kind: 'path', d: 'M14.2 9.3H9.8v5.4h4.4v-2.7h-2.2', accent: true },
    ],
  },
  'crew-bot': {
    description: 'Crew — friendly robot head with antenna and smile',
    elements: [
      { kind: 'path', d: 'M12 7.5V5' },
      { kind: 'circle', cx: 12, cy: 4, r: 1, filled: true },
      { kind: 'rect', x: 5, y: 8, width: 14, height: 9.5, rx: 3 },
      { kind: 'path', d: 'M5 11.8H3.4' },
      { kind: 'path', d: 'M19 11.8h1.6' },
      { kind: 'circle', cx: 9.2, cy: 11.8, r: 1, filled: true },
      { kind: 'circle', cx: 14.8, cy: 11.8, r: 1, filled: true },
      { kind: 'path', d: 'M9.6 14.6q2.4 1.7 4.8 0', accent: true },
    ],
  },
  workspace: {
    description: 'Workspace container — panel with header bar and content',
    elements: [
      { kind: 'rect', x: 3.5, y: 4.5, width: 17, height: 15, rx: 2.5 },
      { kind: 'path', d: 'M3.5 8.7h17' },
      { kind: 'circle', cx: 6.2, cy: 6.6, r: 0.9, accent: true, filled: true },
      { kind: 'path', d: 'M6.4 12.2h7' },
      { kind: 'path', d: 'M6.4 15.4h10.5' },
    ],
  },
  organisation: {
    description: 'Organisation chart — root node with two members',
    elements: [
      { kind: 'rect', x: 9.5, y: 3.5, width: 5, height: 5, rx: 1.4, accent: true },
      { kind: 'path', d: 'M12 8.5v2.5' },
      { kind: 'path', d: 'M6.75 13.5v-2.5h10.5v2.5' },
      { kind: 'rect', x: 4.25, y: 13.5, width: 5, height: 5, rx: 1.4 },
      { kind: 'rect', x: 14.75, y: 13.5, width: 5, height: 5, rx: 1.4 },
    ],
  },
  'integration-plug': {
    description: 'Integration — two plug halves meeting under a spark',
    elements: [
      { kind: 'rect', x: 3.2, y: 9.8, width: 5.6, height: 4.6, rx: 1.4 },
      { kind: 'path', d: 'M8.8 11h2.4' },
      { kind: 'path', d: 'M8.8 13.2h2.4' },
      { kind: 'rect', x: 15.2, y: 9.8, width: 5.6, height: 4.6, rx: 1.4 },
      { kind: 'path', d: 'M15.2 11h-2.4' },
      { kind: 'path', d: 'M15.2 13.2h-2.4' },
      { kind: 'path', d: 'M6 14.4v2q0 1.4-1.4 1.4H3.4' },
      { kind: 'path', d: 'M18 14.4v2q0 1.4 1.4 1.4h1.2' },
      { kind: 'path', d: 'M12 4.4v2.4', accent: true },
      { kind: 'path', d: 'M10.4 5l3.2 1.2', accent: true },
      { kind: 'path', d: 'M13.6 5l-3.2 1.2', accent: true },
    ],
  },
  'suite-grid': {
    description: 'Suite app switcher — four tiles, the active app filled',
    elements: [
      { kind: 'rect', x: 4, y: 4, width: 7, height: 7, rx: 2 },
      { kind: 'rect', x: 13, y: 4, width: 7, height: 7, rx: 2 },
      { kind: 'rect', x: 4, y: 13, width: 7, height: 7, rx: 2 },
      {
        kind: 'rect',
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
  'bell-wave': {
    description: 'Notifications — bell with sound waves',
    elements: [
      { kind: 'path', d: 'M7 9.2a5 5 0 0 1 10 0c0 5.3 2.4 7.3 2.4 7.3H4.6S7 14.5 7 9.2' },
      { kind: 'path', d: 'M10.7 19.3a1.5 1.5 0 0 0 2.6 0' },
      { kind: 'path', d: 'M17.9 6.4a5.5 5.5 0 0 1 1.4 3.7', accent: true },
      { kind: 'path', d: 'M15.7 4a9.4 9.4 0 0 1 2.4 6', accent: true },
    ],
  },
  'today-sun': {
    description: 'Today — sun with slowly turning rays (motion-safe)',
    animatedAccent: true,
    elements: [
      { kind: 'circle', cx: 12, cy: 12, r: 4 },
      { kind: 'path', d: 'M12 2.8v2.4', accent: true },
      { kind: 'path', d: 'M12 18.8v2.4', accent: true },
      { kind: 'path', d: 'M2.8 12h2.4', accent: true },
      { kind: 'path', d: 'M18.8 12h2.4', accent: true },
      { kind: 'path', d: 'M5.5 5.5l1.7 1.7', accent: true },
      { kind: 'path', d: 'M16.8 16.8l1.7 1.7', accent: true },
      { kind: 'path', d: 'M5.5 18.5l1.7-1.7', accent: true },
      { kind: 'path', d: 'M16.8 7.2l1.7-1.7', accent: true },
    ],
  },
};

export const SUITE_ICON_NAMES = Object.keys(SUITE_GLYPHS) as SuiteIconName[];
