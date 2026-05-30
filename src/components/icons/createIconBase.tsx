import type { ReactNode } from "react";
import type { IconProps } from "@/components/icons/IconBase";
import { IconBase } from "@/components/icons/IconBase";

interface IconBaseDefinition {
  viewBox?: string;
  paths: ReactNode;
}

/** Factory for filled Lemon-style glyphs (Material / PostHog paths). */
export function createIconBase({ viewBox = "0 0 24 24", paths }: IconBaseDefinition) {
  return function IconGlyph(props: IconProps) {
    return (
      <IconBase viewBox={viewBox} {...props}>
        {paths}
      </IconBase>
    );
  };
}

/** Shorthand for single-path filled icons. */
export function createIconBasePath(d: string, viewBox = "0 0 24 24") {
  return createIconBase({
    viewBox,
    paths: <path d={d} fill="currentColor" />,
  });
}
