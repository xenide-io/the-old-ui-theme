import { SUITE_THEME_COOKIE } from "./theme-cookie";
import type { SuiteResolvedTheme } from "../components/theme-provider";

export interface SuiteThemeBootOptions {
  /** `data-theme` attribute value for the light theme. */
  lightThemeId: string;
  /** `data-theme` attribute value for the dark theme. */
  darkThemeId: string;
  /** Per-app legacy localStorage key (e.g. `bb-theme`) read before falling back to the OS preference. */
  storageKey?: string;
  /** Optional `<meta id="theme-color-meta">` colours, set alongside the theme. */
  themeColorLight?: string;
  themeColorDark?: string;
  /** Resolved mode when `matchMedia` is unavailable. Defaults to `light`. */
  fallback?: SuiteResolvedTheme;
}

/**
 * Inline `<head>` script that applies the suite theme before first paint.
 * Mode resolution order: the shared `xenide-suite-theme` cookie (one
 * preference across all suite apps), then the per-app legacy storage key,
 * then the OS `prefers-color-scheme`, then the fallback.
 */
export function suiteThemeBootScript(options: SuiteThemeBootOptions): string {
  const light = JSON.stringify(options.lightThemeId);
  const dark = JSON.stringify(options.darkThemeId);
  const storageKey = JSON.stringify(options.storageKey ?? null);
  const metaLight = JSON.stringify(options.themeColorLight ?? null);
  const metaDark = JSON.stringify(options.themeColorDark ?? null);
  const fallback = JSON.stringify(options.fallback ?? "light");
  return `(function(){try{var m=null;var c=document.cookie.match(/(?:^|;\\s*)${SUITE_THEME_COOKIE}=(light|dark|system)/);if(c)m=c[1];var k=${storageKey};if(!m&&k){try{var t=localStorage.getItem(k);if(t==='light'||t==='dark')m=t;}catch(e){}}var d=null;try{d=window.matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){d=${fallback}==='dark';}if(!m)m=d?'dark':'light';else if(m==='system')m=d?'dark':'light';var th=m==='dark'?${dark}:${light};var de=document.documentElement;de.setAttribute('data-theme',th);de.classList.toggle('dark',m==='dark');var meta=document.getElementById('theme-color-meta');if(meta&&(${metaLight})&&(${metaDark}))meta.setAttribute('content',m==='dark'?${metaDark}:${metaLight});}catch(e){document.documentElement.setAttribute('data-theme',${light});}})();`;
}
