'use client';

import { LazyMotion, domAnimation, m } from 'motion/react';
import type { ReactNode } from 'react';

/**
 * Suite motion foundation.
 *
 * `LazyMotion` + `domAnimation` keeps the animation runtime (~15 kB) out of
 * the initial bundle — features load with the first animated component.
 * `strict` guarantees only the tree-shakeable `m` component is used inside
 * the provider (never the heavier `motion` component).
 *
 * Usage:
 *   <SuiteMotionProvider>
 *     <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
 *   </SuiteMotionProvider>
 *
 * Prefer CSS transitions for micro-interactions (hover/press/colour) and
 * reach for `m` only when you need springs, gestures, or layout animation.
 */
export function SuiteMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

export { m };

/**
 * Spring presets — the JS counterparts of the `ease-spring-*` timing
 * functions defined in each app's tailwind config. Use these for entrances,
 * sheets, drawers, and press feedback so JS and CSS motion feel identical.
 * All respect `prefers-reduced-motion` when paired with
 * `MotionConfig reducedMotion="user"` or CSS `motion-reduce:` variants.
 */
export const SUITE_SPRINGS = {
  /** Snappy panel/sheet entrances — small overshoot. */
  fast: { type: 'spring', stiffness: 400, damping: 32, mass: 0.8 },
  /** Gentle scrims, fades, list staggers. */
  subtle: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
  /** Press/tap feedback — quick settle, no wobble. */
  press: { type: 'spring', stiffness: 600, damping: 35, mass: 0.5 },
} as const;

export type SuiteSpringName = keyof typeof SUITE_SPRINGS;
