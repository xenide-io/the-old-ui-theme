import type { SuiteIconName } from './glyphs';

/**
 * Per-app brand colours for the suite icon system — the single place hexes
 * live. `accent` tints a glyph's accent layer; `tile`/`onTile`/
 * `onTileAccent` drive `<SuiteAppIcon>` (the programmatic favicon-style
 * tile + glyph mark).
 */

export type SuiteAccentSlug =
  | 'turtletime'
  | 'tides'
  | 'kraken'
  | 'shellstack'
  | 'crew'
  | 'nakama';

export interface SuiteAppAccent {
  /** Display name (default aria label for app marks). */
  label: string;
  /** Brand accent — tints glyph accent layers via `--suite-icon-accent`. */
  accent: string;
  /** App tile background. */
  tile: string;
  /** Base glyph colour on the tile. */
  onTile: string;
  /** Accent-layer glyph colour on the tile. */
  onTileAccent: string;
}

export const APP_ACCENTS: Record<SuiteAccentSlug, SuiteAppAccent> = {
  turtletime: {
    label: 'TurtleTime',
    accent: '#3f8f57',
    tile: '#173521',
    onTile: '#f7ead0',
    onTileAccent: '#f3c24e',
  },
  tides: {
    label: 'Tides',
    accent: '#a63bb5',
    tile: '#8f2d96',
    onTile: '#ffffff',
    onTileAccent: '#bfe3ff',
  },
  kraken: {
    label: 'Kraken',
    accent: '#737373',
    tile: '#191919',
    onTile: '#ffffff',
    onTileAccent: '#d4d4d4',
  },
  shellstack: {
    label: 'ShellStack',
    accent: '#5e5893',
    tile: '#5e5893',
    onTile: '#ffffff',
    onTileAccent: '#c4a7e7',
  },
  crew: {
    label: 'Crew',
    accent: '#0891b2',
    tile: '#155e75',
    onTile: '#ffffff',
    onTileAccent: '#a5f3fc',
  },
  nakama: {
    label: 'Nakama',
    accent: '#0891b2',
    tile: '#155e75',
    onTile: '#ffffff',
    onTileAccent: '#a5f3fc',
  },
};

/** Which glyph represents each app. */
export const APP_GLYPHS: Record<SuiteAccentSlug, SuiteIconName> = {
  turtletime: 'timer-shell',
  tides: 'kanban-wave',
  kraken: 'squid-doc',
  shellstack: 'stack-hex',
  crew: 'crew-bot',
  nakama: 'crew-bot',
};
