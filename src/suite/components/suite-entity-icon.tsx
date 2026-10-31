"use client";

import type { CSSProperties } from "react";
import { Folder } from 'lucide-react';
import { hasMonoIcon, paletteIconSrc } from "@/suite/lib/palette-api";
import { SuiteIconImage } from "./suite-icon-image";
import { cn } from "@/lib/cn";

const ENTITY_COLOURS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#64748b",
];

export function automaticEntityColour(label: string): string {
  // Matches core.entity_icon.default_entity_colour; stable across refreshes and apps.
  const index =
    Array.from(label).reduce(
      (sum, char, i) => sum + (i + 1) * char.codePointAt(0)!,
      0,
    ) % ENTITY_COLOURS.length;
  return ENTITY_COLOURS[index];
}

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
  roundedClass = "rounded-md",
  style,
  tinted = false,
  mono,
}: {
  imageUrl?: string | null;
  label?: string | null;
  color?: string | null;
  className?: string;
  roundedClass?: string;
  style?: CSSProperties;
  /** Recolour a monochrome icon to `color` (via CSS mask). */
  tinted?: boolean;
  /** Single-colour artwork, from Palette or the URL's `mono` hint. */
  mono?: boolean;
}) {
  const hasColor =
    typeof color === "string" && /^#[0-9a-fA-F]{3,8}$/.test(color);
  const tint = hasColor
    ? (color as string)
    : !imageUrl
      ? automaticEntityColour(label ?? "")
      : null;
  const neutralBackground = "var(--ph-muted, rgba(127,127,127,0.08))";
  // Fluent emoji are full-colour artwork; a tint plate would change them.
  const isEmoji = Boolean(imageUrl?.includes("/svgrepo/fluent-emoji/"));
  // Monochrome icons inherit the theme text colour (white in dark mode); a tint
  // replaces that with the entity colour.
  const isMono = !isEmoji && (mono ?? hasMonoIcon(imageUrl));

  if (imageUrl) {
    const src =
      isMono || !tinted || !tint ? imageUrl : paletteIconSrc(imageUrl, tint);
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden leading-none",
          roundedClass,
          className,
        )}
        style={{
          backgroundColor: isEmoji
            ? "transparent"
            : tint
              ? `${tint}18`
              : neutralBackground,
          // Monochrome artwork is a mask; ink follows the theme (white in
          // dark mode). Intrinsic colour artwork stays an <img> untouched.
          color: isMono && !tinted ? "var(--ph-text-primary)" : undefined,
          ...style,
        }}
      >
        <SuiteIconImage
          url={src ?? imageUrl}
          mono={isMono}
          tint={isMono && tinted ? tint : null}
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center leading-none",
        roundedClass,
        className,
      )}
      style={{
        color: tint ?? "var(--ph-mutedtext)",
        backgroundColor: tint ? `${tint}18` : neutralBackground,
        ...style,
      }}
      aria-hidden="true"
      data-icon-label={label || undefined}
    >
      <Folder className="h-[88%] w-[88%]" strokeWidth={1.8} aria-hidden />
    </span>
  );
}
