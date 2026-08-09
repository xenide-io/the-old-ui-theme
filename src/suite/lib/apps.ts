/**
 * The single source of truth for the ShellStack app family — used by the
 * app switcher, mobile bottom nav, launchpad, and cross-app navigation.
 * Slugs double as accent keys (see icons/app-accents.ts) and data-test
 * suffixes (`switch-app-${slug}`, `suite-nav-${slug}`).
 */

export type SuiteAppSlug =
  | 'shellstack'
  | 'tides'
  | 'turtletime'
  | 'kraken'
  | 'nakama';

export interface SuiteAppDefinition {
  slug: SuiteAppSlug;
  name: string;
  description: string;
  /** Public asset path — every app hosts all four icons. */
  icon: string;
  /** Landing route used after cross-app SSO redirect. */
  landing: string;
  /** Env var carrying the app's base URL (dev fallback included). */
  baseUrlEnv: string;
  baseUrlFallback: string;
}

/** Display order — launchpad first, then by daily workflow. */
export const SUITE_APPS: readonly SuiteAppDefinition[] = [
  {
    slug: 'shellstack',
    name: 'ShellStack',
    description: 'Organisation and billing',
    icon: '/icon-shellstack.svg',
    landing: '/home',
    baseUrlEnv: 'NEXT_PUBLIC_SHELLSTACK_URL',
    baseUrlFallback: 'http://localhost:3002',
  },
  {
    slug: 'tides',
    name: 'Tides',
    description: 'Projects and tasks',
    icon: '/tides-icon.svg',
    landing: '/today',
    baseUrlEnv: 'NEXT_PUBLIC_TIDES_URL',
    baseUrlFallback: 'http://localhost:3001',
  },
  {
    slug: 'turtletime',
    name: 'TurtleTime',
    description: 'Time tracking',
    icon: '/turtletime-icon.svg',
    landing: '/today',
    baseUrlEnv: 'NEXT_PUBLIC_TURTLETIME_URL',
    baseUrlFallback: 'http://localhost:3000',
  },
  {
    slug: 'kraken',
    name: 'Kraken',
    description: 'Documents and knowledge',
    icon: '/kraken-icon.svg',
    landing: '/today',
    baseUrlEnv: 'NEXT_PUBLIC_KRAKEN_URL',
    baseUrlFallback: 'http://localhost:3003',
  },
  {
    slug: 'nakama',
    name: 'Nakama',
    description: 'AI teammates',
    icon: '/nakama-icon.svg',
    landing: '/today',
    baseUrlEnv: 'NEXT_PUBLIC_NAKAMA_URL',
    baseUrlFallback: 'http://localhost:3004',
  },
] as const;

export const SUITE_APP_MAP: Readonly<Record<SuiteAppSlug, SuiteAppDefinition>> =
  Object.fromEntries(SUITE_APPS.map((app) => [app.slug, app])) as Record<
    SuiteAppSlug,
    SuiteAppDefinition
  >;

/** Resolve an app's base URL: env var first, dev fallback second. */
export function suiteAppBaseUrl(slug: SuiteAppSlug): string {
  const def = SUITE_APP_MAP[slug];
  const fromEnv =
    typeof process !== 'undefined' ? process.env[def.baseUrlEnv] : undefined;
  return (fromEnv || def.baseUrlFallback).replace(/\/$/, '');
}

const SOURCE_APP_SLUG: Record<string, SuiteAppSlug> = {
  turtletime: 'turtletime',
  tides: 'tides',
  kraken: 'kraken',
  nakama: 'nakama',
  portal: 'shellstack',
  shellstack: 'shellstack',
};

/**
 * Suite notification links are often stored as `/dashboard/...` relative to the
 * *source* app. Resolving them with the current product origin opens the wrong
 * app — prefix with that app's base URL instead.
 */
export function resolveSuiteNotificationHref(
  href: string | null | undefined,
  sourceApp: string | null | undefined,
): string {
  const value = (href || '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:|\/\/)/i.test(value)) return value;
  const path = value.startsWith('/') ? value : `/${value}`;
  const slug = SOURCE_APP_SLUG[(sourceApp || '').toLowerCase()];
  if (!slug) return path;
  return `${suiteAppBaseUrl(slug)}${path}`;
}
