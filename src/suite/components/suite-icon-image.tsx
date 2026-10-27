"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { paletteMaskSrc } from "@/suite/lib/palette-api";

/**
 * A Palette SVG.
 *
 * Monochrome icons are drawn as a CSS mask so they inherit `currentColor` — dark
 * text in light mode, white in dark mode — instead of shipping a fixed colour.
 * Multi-colour artwork and Fluent emoji keep their `<img>` so nothing is flattened.
 */
export function SuiteIconImage({
  url,
  mono = false,
  tint,
  className,
  style,
  alt = "",
}: {
  url: string;
  /** Single-colour artwork (from Palette's audit). Renders as a mask. */
  mono?: boolean;
  /** Fixed colour for a monochrome icon; defaults to `currentColor`. */
  tint?: string | null;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}) {
  if (!mono) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={url} alt={alt} className={className} style={style} />
    );
  }
  const mask = paletteMaskSrc(url);
  return (
    <span
      aria-hidden="true"
      className={cn("block bg-current", className)}
      style={{
        backgroundColor: tint || undefined,
        maskImage: `url("${mask}")`,
        WebkitMaskImage: `url("${mask}")`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}
