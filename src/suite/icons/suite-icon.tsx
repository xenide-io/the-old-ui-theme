'use client';

import type { CSSProperties } from 'react';

import { cn } from '../lib/cn';
import { APP_ACCENTS, type SuiteAccentSlug } from './app-accents';
import { GlyphParts } from './glyph-parts';
import { SUITE_GLYPHS, type SuiteIconName } from './glyphs';

/**
 * Motion for the only animated glyph (today-sun): rays turn slowly, and only
 * when the user has not asked for reduced motion. Mirrors the injected-style
 * pattern used by the app logo components.
 */
const TODAY_SUN_STYLE = `
@media (prefers-reduced-motion: no-preference) {
  .suite-icon-today-sun-rays {
    animation: suite-icon-today-sun-spin 18s linear infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
}
@keyframes suite-icon-today-sun-spin {
  to { transform: rotate(360deg); }
}
`;

export interface SuiteIconProps {
  name: SuiteIconName;
  /** px size; a Tailwind sizing class on `className` also works. */
  size?: number | string;
  /** App slug — tints the glyph's accent layer with the app's brand hex. */
  accent?: SuiteAccentSlug;
  strokeWidth?: number;
  /** Only today-sun animates; set false to freeze it. Reduced-motion safe. */
  animated?: boolean;
  /** Accessible label. Without it the icon is `aria-hidden` (decorative). */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Suite icon — hand-drawn glyphs on the lucide grammar (24×24, 2px strokes,
 * round caps/joins). Strokes inherit `currentColor`, so ph-* text tokens just
 * work; `accent` adds a per-app brand tint to the glyph's accent layer.
 */
export function SuiteIcon({
  name,
  size = 24,
  accent,
  strokeWidth = 2,
  animated = true,
  label,
  className,
  style,
}: SuiteIconProps) {
  const glyph = SUITE_GLYPHS[name];
  const accentHex = accent ? APP_ACCENTS[accent].accent : undefined;
  const mergedStyle = accentHex
    ? ({ ...style, '--suite-icon-accent': accentHex } as CSSProperties)
    : style;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', className)}
      style={mergedStyle}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {glyph.animatedAccent && animated ? (
        <style>{TODAY_SUN_STYLE}</style>
      ) : null}
      <GlyphParts
        elements={glyph.elements}
        accentClassName={
          glyph.animatedAccent && animated
            ? 'suite-icon-today-sun-rays'
            : undefined
        }
      />
    </svg>
  );
}
