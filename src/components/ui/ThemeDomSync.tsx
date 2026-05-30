"use client";

import { useLayoutEffect } from "react";
import { persistTheme, readStoredTheme } from "@/themes";

/**
 * Re-applies `html[data-theme]` after React commits. Hydration can clear attributes
 * that were set only by `THEME_INIT_SCRIPT` — without this sync, `:root`-scoped
 * light tokens effectively win visually.
 */
export function ThemeDomSync() {
  useLayoutEffect(() => {
    persistTheme(readStoredTheme());
  }, []);

  return null;
}
