import { DEFAULT_THEME_ID, THEMES } from "@/themes/registry";
import { isThemeId } from "@/themes/registry";

const STORAGE_KEY = "ph-theme";

const VALID_THEMES = THEMES.map((theme) => theme.id);

/** Inline script — runs before paint to avoid theme flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${STORAGE_KEY}",d="${DEFAULT_THEME_ID}",v=${JSON.stringify(VALID_THEMES)},t=localStorage.getItem(k);if(t==="xenide")t="xenide-light";if(!t||v.indexOf(t)<0)t=d;document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME_ID}")}})();`;

export function persistTheme(themeId: string): void {
  if (typeof window === "undefined") {
    return;
  }
  if (!isThemeId(themeId)) {
    return;
  }
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem(STORAGE_KEY, themeId);
}

export function readStoredTheme(): string {
  if (typeof window === "undefined") {
    return DEFAULT_THEME_ID;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "xenide") {
    return "xenide-light";
  }
  return stored && isThemeId(stored) ? stored : DEFAULT_THEME_ID;
}
