'use client';

import type { CSSProperties } from 'react';
import { paletteIconSrc } from '@/suite/lib/palette-api';
import { cn } from '@/lib/cn';

/**
 * A client/project icon.
 *
 * Shows the stored image when there is one; otherwise a neutral placeholder —
 * a tinted rounded square with the entity's initial, or a small dot when no
 * label is available. No icon font is involved.
 */
export function SuiteEntityIcon({
  imageUrl,
  label,
  color,
  className,
  roundedClass = 'rounded-md',
  style,
  tinted = false,
}: {
  imageUrl?: string | null;
  label?: string | null;
  color?: string | null;
  className?: string;
  roundedClass?: string;
  style?: CSSProperties;
  /** Recolour a monochrome icon to `color` (via CSS mask). */
  tinted?: boolean;
}) {
  const hasColor =
    typeof color === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(color);
  const tint = hasColor ? (color as string) : null;
  const neutralBackground = 'var(--ph-muted, rgba(127,127,127,0.08))';

  if (imageUrl) {
    const src = tinted && tint ? paletteIconSrc(imageUrl, tint) : imageUrl;
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden leading-none',
          roundedClass,
          className,
        )}
        style={{
          backgroundColor: tint ? `${tint}18` : neutralBackground,
          ...style,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src ?? undefined} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  const initial = label?.trim().charAt(0).toUpperCase();

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-semibold leading-none',
        roundedClass,
        className,
      )}
      style={{
        color: tint ?? 'var(--ph-mutedtext)',
        backgroundColor: tint ? `${tint}18` : neutralBackground,
        ...style,
      }}
      aria-hidden="true"
    >
      {initial ? (
        <span className="text-[0.7em]">{initial}</span>
      ) : (
        <span className="block h-1.5 w-1.5 rounded-full bg-current opacity-40" />
      )}
    </span>
  );
}
