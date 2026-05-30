"use client";

import { useEffect, useState } from "react";
import { persistTheme, readStoredTheme, THEME_GROUPS, THEMES, type ThemeId } from "@/themes";
import { cn } from "@/lib/cn";

export interface ThemeSwitcherProps {
  className?: string;
}

/** Colour-only theme picker — persists to localStorage and sets html[data-theme]. */
export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [themeId, setThemeId] = useState<ThemeId>("hedgehog-light");

  useEffect(() => {
    const id = readStoredTheme() as ThemeId;
    persistTheme(id);
    setThemeId(id);
  }, []);

  return (
    <label className={cn("flex min-w-0 items-center gap-2", className)}>
      <span className="shrink-0 text-xs font-medium text-ph-mutedtext sm:text-sm">Theme</span>
      <select
        className="ph-select max-w-[11rem] !min-h-[2rem] py-1 pl-2.5 pr-8 text-xs sm:max-w-[14rem] sm:text-sm"
        value={themeId}
        aria-label="Colour theme"
        onChange={(event) => {
          const next = event.target.value as ThemeId;
          persistTheme(next);
          setThemeId(next);
        }}
      >
        {THEME_GROUPS.map((group) => (
          <optgroup key={group} label={group}>
            {THEMES.filter((theme) => theme.group === group).map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
