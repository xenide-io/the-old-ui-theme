import { forwardRef, type ReactNode } from "react";
import type { IconProps } from "@/components/icons/IconBase";
import { IconBase } from "@/components/icons/IconBase";

interface IconBaseDefinition {
  name?: string;
  viewBox?: string;
  paths: ReactNode;
}

/** Factory for filled Old UI, Lemon, and Material-style glyphs. */
export function createIconBase({ name = "IconGlyph", viewBox = "0 0 24 24", paths }: IconBaseDefinition) {
  const IconGlyph = forwardRef<SVGSVGElement, IconProps>(function IconGlyph(props, ref) {
    return (
      <IconBase ref={ref} viewBox={viewBox} {...props}>
        {paths}
      </IconBase>
    );
  });

  IconGlyph.displayName = name;
  return IconGlyph;
}

/** Shorthand for single-path filled icons. */
export function createIconBasePath(d: string, viewBox = "0 0 24 24", name?: string) {
  return createIconBase({
    name,
    viewBox,
    paths: <path d={d} fill="currentColor" />,
  });
}
