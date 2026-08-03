'use client';

import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { APP_ACCENTS, APP_GLYPHS, type SuiteAccentSlug } from './app-accents';
import { GlyphParts } from './glyph-parts';
import { SUITE_GLYPHS } from './glyphs';

const SIZE_PRESETS = { sm: 28, md: 36, lg: 44 } as const;

export interface SuiteAppIconProps {
  app: SuiteAccentSlug;
  /** px size, or a preset (sm 28 / md 36 / lg 44). */
  size?: number | keyof typeof SIZE_PRESETS;
  /** Accessible label; defaults to decorative (`aria-hidden`). */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * An app's simplified mark — brand tile + its suite glyph, drawn
 * programmatically at any size (no cross-app <img> favicon lookups).
 * Colours come from app-accents.ts.
 */
export function SuiteAppIcon({
  app,
  size = 'md',
  label,
  className,
  style,
}: SuiteAppIconProps) {
  const px = typeof size === 'number' ? size : SIZE_PRESETS[size];
  const brand = APP_ACCENTS[app];
  const glyph = SUITE_GLYPHS[APP_GLYPHS[app]];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      className={cn('shrink-0', className)}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <rect x="1" y="1" width="22" height="22" rx="5.5" fill={brand.tile} />
      <g
        transform="translate(4.4 4.4) scale(0.6333)"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          {
            color: brand.onTile,
            '--suite-icon-accent': brand.onTileAccent,
          } as CSSProperties
        }
      >
        <GlyphParts elements={glyph.elements} />
      </g>
    </svg>
  );
}
