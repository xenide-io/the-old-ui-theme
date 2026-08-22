'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type SuiteTheme = 'system' | 'light' | 'dark';
export type SuiteResolvedTheme = 'light' | 'dark';

export interface SuiteThemeConfig {
  /** localStorage key holding the stored preference. */
  storageKey: string;
  /** `data-theme` attribute value for the light theme. */
  lightThemeId: string;
  /** `data-theme` attribute value for the dark theme. */
  darkThemeId: string;
  /**
   * Resolved theme to assume when `matchMedia` is unavailable
   * (server render / pre-hydration).
   */
  fallbackTheme: SuiteResolvedTheme;
  /**
   * Optional `<meta id="theme-color-meta">` colours, synced whenever the
   * theme is (re)applied after mount. Omit both to leave the meta tag
   * untouched.
   */
  themeColorLight?: string;
  themeColorDark?: string;
}

export interface SuiteThemeContextValue {
  theme: SuiteTheme;
  resolvedTheme: SuiteResolvedTheme;
  setTheme: (theme: SuiteTheme) => void;
  toggleTheme: () => void;
}

const SuiteThemeContext = createContext<SuiteThemeContextValue | null>(null);

function systemTheme(fallback: SuiteResolvedTheme): SuiteResolvedTheme {
  if (typeof window === 'undefined') return fallback;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(
  theme: SuiteTheme,
  fallback: SuiteResolvedTheme,
): SuiteResolvedTheme {
  return theme === 'system' ? systemTheme(fallback) : theme;
}

function applyTheme(
  theme: SuiteTheme,
  config: SuiteThemeConfig,
): SuiteResolvedTheme {
  const resolved = resolveTheme(theme, config.fallbackTheme);
  if (typeof document === 'undefined') return resolved;
  document.documentElement.setAttribute(
    'data-theme',
    resolved === 'dark' ? config.darkThemeId : config.lightThemeId,
  );
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  if (config.themeColorLight && config.themeColorDark) {
    const meta = document.getElementById(
      'theme-color-meta',
    ) as HTMLMetaElement | null;
    if (meta) {
      meta.content =
        resolved === 'light' ? config.themeColorLight : config.themeColorDark;
    }
  }
  return resolved;
}

function readStoredTheme(storageKey: string): SuiteTheme {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(storageKey);
  if (stored === 'light' || stored === 'dark' || stored === 'system')
    return stored;
  return 'system';
}

/**
 * Theme provider shared by suite apps. Each app's root layout runs a small
 * boot script that applies `data-theme` before hydration; this provider
 * adopts that DOM state on mount and owns every post-hydration change (user
 * picks a theme, or the OS preference flips while set to `system`).
 *
 * Apps wrap this with their own `ThemeProvider`/`useTheme` module that pins
 * the storage key, theme ids and meta colours.
 */
export function SuiteThemeProvider({
  config,
  children,
}: {
  config: SuiteThemeConfig;
  children: ReactNode;
}) {
  const [state, setState] = useState<{
    theme: SuiteTheme;
    resolvedTheme: SuiteResolvedTheme;
  }>(() => {
    const theme = readStoredTheme(config.storageKey);
    if (typeof document === 'undefined') {
      return { theme, resolvedTheme: config.fallbackTheme };
    }
    const domTheme = document.documentElement.getAttribute('data-theme');
    const resolvedTheme =
      domTheme === config.darkThemeId
        ? 'dark'
        : domTheme === config.lightThemeId
          ? 'light'
          : resolveTheme(theme, config.fallbackTheme);
    return { theme, resolvedTheme };
  });
  const { theme, resolvedTheme } = state;

  useEffect(() => {
    applyTheme(theme, config);
  }, [theme, config]);

  useEffect(() => {
    if (theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const resolved = applyTheme('system', config);
      setState((current) => ({ ...current, resolvedTheme: resolved }));
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [theme, config]);

  const setTheme = useCallback(
    (next: SuiteTheme) => {
      const resolved = applyTheme(next, config);
      setState({ theme: next, resolvedTheme: resolved });
      localStorage.setItem(config.storageKey, next);
    },
    [config],
  );

  const toggleTheme = useCallback(() => {
    setState((prev) => {
      const next: SuiteTheme =
        resolveTheme(prev.theme, config.fallbackTheme) === 'dark'
          ? 'light'
          : 'dark';
      const resolved = applyTheme(next, config);
      localStorage.setItem(config.storageKey, next);
      return { theme: next, resolvedTheme: resolved };
    });
  }, [config]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <SuiteThemeContext.Provider value={value}>
      {children}
    </SuiteThemeContext.Provider>
  );
}

export function useSuiteTheme(): SuiteThemeContextValue {
  const ctx = useContext(SuiteThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
