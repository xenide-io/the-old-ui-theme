'use client';

import { useEffect, useState } from 'react';

/** Mount non-critical chrome after the browser is idle (or a short timeout). */
export function useIdleMount(timeoutMs = 1200): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId = 0;
    let idleId = 0;

    const activate = () => setReady(true);

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(activate, { timeout: timeoutMs });
      return () => window.cancelIdleCallback(idleId);
    }

    timeoutId = window.setTimeout(activate, Math.min(timeoutMs, 200));
    return () => window.clearTimeout(timeoutId);
  }, [timeoutMs]);

  return ready;
}
