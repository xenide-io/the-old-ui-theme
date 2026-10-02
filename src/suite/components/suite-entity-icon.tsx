'use client';

import type { CSSProperties } from 'react';
import { Folder } from 'iconoir-react';
import { paletteIconSrc } from '@/suite/lib/palette-api';
import { cn } from '@/lib/cn';

/**
 * A client/project icon.
 *
 * Shows the stored image when there is one; otherwise a folder outline (tinted
 * to the entity colour when set). A folder is the neutral default for clients,
 * projects, and their sidebar entries across every app.
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

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center leading-none',
        roundedClass,
        className,
      )}
      style={{
        color: tint ?? 'var(--ph-mutedtext)',
        backgroundColor: tint ? `${tint}18` : neutralBackground,
        ...style,
      }}
      aria-hidden="true"
      title={label ?? undefined}
    >
      <Folder
        className="h-[0.85em] w-[0.85em]"
        strokeWidth={1.8}
        aria-hidden
      />
    </span>
  );
}
