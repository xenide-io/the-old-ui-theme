'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { readCookie, writeCookie } from '../lib/cookies';
import { SUITE_THEME_CHANNEL, SUITE_THEME_COOKIE } from '../lib/theme-cookie';

export type SuiteTheme = 'system' | 'light' | 'dark';
export type SuiteResolvedTheme = 'light' | 'dark';

/**
 * One cookie shared by every suite app: pick light/dark/system in any app
 * and the rest follow (cookies ignore ports on localhost and subdomains can
 * opt in via the shared domain attribute).
 */
export { SUITE_THEME_COOKIE };

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

let suiteThemeChannel: BroadcastChannel | null = null;

function broadcastTheme(theme: SuiteTheme): void {
  if (typeof BroadcastChannel === 'undefined') return;
  try {
    suiteThemeChannel ??= new BroadcastChannel(SUITE_THEME_CHANNEL);
    suiteThemeChannel.postMessage(theme);
  } catch {
    // Cross-tab broadcast is best-effort.
  }
}

function readSharedTheme(): SuiteTheme | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = readCookie(SUITE_THEME_COOKIE);
    return value === 'light' || value === 'dark' || value === 'system'
      ? value
      : null;
  } catch {
    return null;
  }
}

function writeSharedTheme(theme: SuiteTheme): void {
  try {
    writeCookie(SUITE_THEME_COOKIE, theme);
  } catch {
    // Cookie writes can fail in restricted browser contexts.
  }
}

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
  const shared = readSharedTheme();
  if (shared) return shared;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'light' || stored === 'dark' || stored === 'system')
      return stored;
  } catch {
    // localStorage can be unavailable; the cookie still crosses apps.
  }
  return 'system';
}

/**
 * Theme provider shared by suite apps. Each app's root layout runs a small
 * boot script that applies `data-theme` before hydration; this provider
 * adopts that DOM state on mount and owns every post-hydration change (user
 * picks a theme, or the OS preference flips while set to `system`).
 *
 * The chosen mode is persisted both to the app's localStorage key and to the
 * shared suite cookie, and adopted from the cookie whenever another suite
 * app or tab changes it (focus, visibility, polling and same-origin
 * `storage`/`BroadcastChannel` events).
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
  const themeRef = useRef(state.theme);
  themeRef.current = state.theme;

  useEffect(() => {
    applyTheme(state.theme, config);
  }, [state.theme, config]);

  // Seed the shared cookie so a legacy per-app preference spreads to the
  // rest of the suite on the next app switch.
  useEffect(() => {
    if (readSharedTheme() == null) writeSharedTheme(state.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seed once on mount
  }, []);

  useEffect(() => {
    if (state.theme !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      const resolved = applyTheme('system', config);
      setState((current) => ({ ...current, resolvedTheme: resolved }));
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [state.theme, config]);

  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(SUITE_THEME_CHANNEL);
    } catch {
      channel = null;
    }

    const adopt = (next: unknown) => {
      if (next !== 'light' && next !== 'dark' && next !== 'system') return;
      if (next === themeRef.current) return;
      const resolved = applyTheme(next, config);
      try {
        localStorage.setItem(config.storageKey, next);
      } catch {
        // localStorage can be unavailable; the cookie still crosses apps.
      }
      setState({ theme: next, resolvedTheme: resolved });
    };

    const readShared = () => adopt(readSharedTheme());
    const onChannel = (event: MessageEvent) => adopt(event.data);
    const onStorage = (event: StorageEvent) => {
      if (event.key === config.storageKey) adopt(event.newValue);
    };
    let poll: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (poll == null) poll = setInterval(readShared, 2000);
    };
    const stopPolling = () => {
      if (poll != null) {
        clearInterval(poll);
        poll = null;
      }
    };
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        readShared();
        startPolling();
      } else {
        stopPolling();
      }
    };

    channel?.addEventListener('message', onChannel);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', readShared);
    document.addEventListener('visibilitychange', onVisibility);
    if (document.visibilityState === 'visible') startPolling();

    return () => {
      channel?.removeEventListener('message', onChannel);
      channel?.close();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', readShared);
      document.removeEventListener('visibilitychange', onVisibility);
      stopPolling();
    };
  }, [config]);

  const setTheme = useCallback(
    (next: SuiteTheme) => {
      const resolved = applyTheme(next, config);
      setState({ theme: next, resolvedTheme: resolved });
      try {
        localStorage.setItem(config.storageKey, next);
      } catch {
        // localStorage can be unavailable; the cookie still crosses apps.
      }
      writeSharedTheme(next);
      broadcastTheme(next);
    },
    [config],
  );

  const toggleTheme = useCallback(() => {
    const next: SuiteTheme =
      resolveTheme(themeRef.current, config.fallbackTheme) === 'dark'
        ? 'light'
        : 'dark';
    setTheme(next);
  }, [config, setTheme]);

  const value = useMemo(
    () => ({ theme: state.theme, resolvedTheme: state.resolvedTheme, setTheme, toggleTheme }),
    [state.theme, state.resolvedTheme, setTheme, toggleTheme],
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
