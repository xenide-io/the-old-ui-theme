'use client';

import type { SuiteGlyphElement } from './glyphs';

function GlyphElement({ element }: { element: SuiteGlyphElement }) {
  const fill = element.filled ? 'currentColor' : 'none';
  const stroke = element.filled ? 'none' : undefined;
  switch (element.kind) {
    case 'path':
      return <path d={element.d} fill={fill} stroke={stroke} />;
    case 'circle':
      return (
        <circle
          cx={element.cx}
          cy={element.cy}
          r={element.r}
          fill={fill}
          stroke={stroke}
        />
      );
    case 'rect':
      return (
        <rect
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rx={element.rx}
          fill={fill}
          stroke={stroke}
        />
      );
  }
}

/**
 * Renders a glyph's elements. Accent-flagged elements are wrapped in a group
 * coloured by `var(--suite-icon-accent, currentColor)` — callers set the
 * variable on an ancestor (inline style) to tint the accent layer.
 */
export function GlyphParts({
  elements,
  accentClassName,
}: {
  elements: SuiteGlyphElement[];
  accentClassName?: string;
}) {
  const base = elements.filter((el) => !el.accent);
  const accented = elements.filter((el) => el.accent);
  return (
    <>
      {base.map((el, i) => (
        <GlyphElement key={i} element={el} />
      ))}
      {accented.length > 0 ? (
        <g
          className={accentClassName}
          style={{ color: 'var(--suite-icon-accent, currentColor)' }}
        >
          {accented.map((el, i) => (
            <GlyphElement key={i} element={el} />
          ))}
        </g>
      ) : null}
    </>
  );
}
