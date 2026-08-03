'use client';

import type { ReactNode } from 'react';

import { useIdleMount } from '../lib/use-idle-mount';

/** Command K — mount after idle so first paint stays light. */
export function DeferredChrome({ children }: { children: ReactNode }) {
  const ready = useIdleMount();
  if (!ready) return null;
  return <>{children}</>;
}
