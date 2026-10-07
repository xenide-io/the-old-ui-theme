/**
 * Analytics bridge for shared `the-old-ui` components.
 *
 * The shared package must not depend on `@xenide-io/suite-client`, so instead
 * of importing an analytics client it emits a browser CustomEvent that each
 * host app forwards to its own client (e.g. `analytics.capture`). This mirrors
 * the existing `suite-mutated` / `tt-timer-mutated` window-event pattern and
 * works across the package's separate `index` / `ui` / `suite` bundles because
 * `window` is the single shared instance.
 */

/** Window event apps subscribe to in order to forward suite analytics. */
export const SUITE_ANALYTICS_EVENT = 'shellstack:analytics';

export type SuiteAnalyticsProperties = Record<string, unknown>;

export interface SuiteAnalyticsEventDetail {
  event: string;
  properties?: SuiteAnalyticsProperties;
}

/**
 * Emit a shared-component analytics event. Safe to call during SSR and never
 * throws into the UI: analytics must never break an interaction.
 */
export function trackSuiteEvent(
  event: string,
  properties?: SuiteAnalyticsProperties,
): void {
  if (typeof window === 'undefined' || !event) return;
  try {
    window.dispatchEvent(
      new CustomEvent<SuiteAnalyticsEventDetail>(SUITE_ANALYTICS_EVENT, {
        detail: { event, properties },
      }),
    );
  } catch {
    // CustomEvent can be unavailable in exotic test environments.
  }
}

/**
 * Subscribe to suite analytics emitted by shared components. Returns an
 * unsubscribe function. Host apps wire this once in their analytics provider.
 */
export function subscribeSuiteAnalytics(
  handler: (event: string, properties?: SuiteAnalyticsProperties) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const listener = (raw: Event): void => {
    const detail = (raw as CustomEvent<SuiteAnalyticsEventDetail>).detail;
    if (!detail?.event) return;
    try {
      handler(detail.event, detail.properties);
    } catch {
      // A subscriber throwing must not affect the emitter.
    }
  };
  window.addEventListener(SUITE_ANALYTICS_EVENT, listener);
  return () => window.removeEventListener(SUITE_ANALYTICS_EVENT, listener);
}
