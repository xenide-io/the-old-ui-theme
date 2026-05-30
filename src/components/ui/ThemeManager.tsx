"use client";

import type { ReactNode } from "react";
import { useLayoutEffect } from "react";
import { persistTheme, readStoredTheme } from "@/themes";

export interface ThemeManagerProps {
  children?: ReactNode;
}

/** Client wrapper that keeps html[data-theme] synced with localStorage. */
export function ThemeManager({ children }: ThemeManagerProps) {
  useLayoutEffect(() => {
    persistTheme(readStoredTheme());
  }, []);

  return <>{children}</>;
}
