/**
 * Shared date + time formatting for the ShellStack suite.
 *
 * dayjs is the engine. Locale follows the browser (`navigator.language`) and can
 * be overridden app-side via `initSuiteDates(locale)`. The preset helpers use
 * dayjs locale-aware tokens, so month/weekday names and relative-time phrases
 * localise automatically once the locale is registered.
 *
 * Callers should fire-and-forget `initSuiteDates()` once at app boot; formatting
 * falls back to `en` until the browser locale (if supported) finishes loading.
 */
import dayjs, { type ConfigType, type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

/** Anything dayjs accepts as a date input, plus the null/empty shapes APIs return. */
export type DateInput = ConfigType | null | undefined;

export const DEFAULT_DATE_LOCALE = "en";

/** Locales we ship a dayjs loader for. Add more here as products expand. */
const LOCALE_LOADERS: Record<string, () => Promise<unknown>> = {
  ar: () => import("dayjs/locale/ar"),
  cs: () => import("dayjs/locale/cs"),
  da: () => import("dayjs/locale/da"),
  de: () => import("dayjs/locale/de"),
  el: () => import("dayjs/locale/el"),
  "en-au": () => import("dayjs/locale/en-au"),
  "en-ca": () => import("dayjs/locale/en-ca"),
  "en-gb": () => import("dayjs/locale/en-gb"),
  "en-ie": () => import("dayjs/locale/en-ie"),
  "en-nz": () => import("dayjs/locale/en-nz"),
  es: () => import("dayjs/locale/es"),
  fi: () => import("dayjs/locale/fi"),
  fr: () => import("dayjs/locale/fr"),
  he: () => import("dayjs/locale/he"),
  hi: () => import("dayjs/locale/hi"),
  hu: () => import("dayjs/locale/hu"),
  id: () => import("dayjs/locale/id"),
  it: () => import("dayjs/locale/it"),
  ja: () => import("dayjs/locale/ja"),
  ko: () => import("dayjs/locale/ko"),
  nl: () => import("dayjs/locale/nl"),
  nb: () => import("dayjs/locale/nb"),
  pl: () => import("dayjs/locale/pl"),
  "pt-br": () => import("dayjs/locale/pt-br"),
  pt: () => import("dayjs/locale/pt"),
  ro: () => import("dayjs/locale/ro"),
  ru: () => import("dayjs/locale/ru"),
  sk: () => import("dayjs/locale/sk"),
  sv: () => import("dayjs/locale/sv"),
  th: () => import("dayjs/locale/th"),
  tr: () => import("dayjs/locale/tr"),
  uk: () => import("dayjs/locale/uk"),
  vi: () => import("dayjs/locale/vi"),
  "zh-cn": () => import("dayjs/locale/zh-cn"),
  "zh-tw": () => import("dayjs/locale/zh-tw"),
};

const loadedLocales = new Set<string>([DEFAULT_DATE_LOCALE, "en"]);

let activeDateLocale = DEFAULT_DATE_LOCALE;

/** Normalise a BCP-47 tag to a dayjs locale key ("en-AU" → "en-au"). */
export function toDateLocaleKey(locale: string | null | undefined): string {
  return (locale ?? "").trim().toLowerCase().replace("_", "-");
}

/**
 * Best-effort dayjs key for a BCP-47 tag, walking from most to least specific
 * ("en-au" → "en-au"; "en-us" → "en"; "de-DE" → "de").
 */
function matchLocaleKey(locale: string): string {
  const key = toDateLocaleKey(locale);
  if (!key) return DEFAULT_DATE_LOCALE;
  if (LOCALE_LOADERS[key] || key === DEFAULT_DATE_LOCALE) return key;
  const base = key.split("-")[0];
  return LOCALE_LOADERS[base] ? base : DEFAULT_DATE_LOCALE;
}

/** The browser's preferred locale as a dayjs key (falls back to "en"). */
export function resolveBrowserLocale(): string {
  if (typeof navigator === "undefined") return DEFAULT_DATE_LOCALE;
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of candidates) {
    const key = matchLocaleKey(candidate);
    if (key !== DEFAULT_DATE_LOCALE) return key;
  }
  return DEFAULT_DATE_LOCALE;
}

/** Load (once) and activate a locale. Returns the key actually in effect. */
export async function initSuiteDates(locale?: string): Promise<string> {
  const key = matchLocaleKey(locale ?? resolveBrowserLocale());
  if (!loadedLocales.has(key)) {
    const load = LOCALE_LOADERS[key];
    if (load) {
      try {
        await load();
        loadedLocales.add(key);
      } catch {
        // Keep the current locale when the chunk fails to load.
      }
    }
  }
  return setDateLocale(key);
}

/** Activate an already-registered locale synchronously. */
export function setDateLocale(locale: string): string {
  const key = matchLocaleKey(locale);
  activeDateLocale = loadedLocales.has(key) ? key : DEFAULT_DATE_LOCALE;
  dayjs.locale(activeDateLocale);
  return activeDateLocale;
}

/** The locale currently in effect. */
export function getDateLocale(): string {
  return activeDateLocale;
}

/** The configured dayjs factory — escape hatch for bespoke formats. */
export function date(value?: DateInput): Dayjs {
  return dayjs(value ?? undefined);
}

/** Export the engine itself for consumers that prefer `dayjs(...)`. */
export { dayjs };

function format(
  value: DateInput,
  template: string,
  fallback: string,
): string {
  if (value === null || value === undefined || value === "") return fallback;
  const d = dayjs(value);
  return d.isValid() ? d.format(template) : fallback;
}

/** Compact day + short month, e.g. "9 Sep". */
export function formatShortDate(value: DateInput, fallback = ""): string {
  return format(value, "D MMM", fallback);
}

/** Day + short month + year, e.g. "9 Sep 2026". */
export function formatDate(value: DateInput, fallback = "—"): string {
  return format(value, "D MMM YYYY", fallback);
}

/** Full weekday + long month, e.g. "Monday, 9 September". */
export function formatLongDate(value: DateInput = new Date(), fallback = ""): string {
  return format(value, "dddd, D MMMM", fallback);
}

/** Date + clock, e.g. "9 Sep 2026, 9:30 am". */
export function formatDateTime(value: DateInput, fallback = ""): string {
  return format(value, "D MMM YYYY, h:mm a", fallback);
}

/** 12-hour clock, e.g. "9:30 am". */
export function formatClock(value: DateInput, fallback = ""): string {
  return format(value, "h:mm a", fallback);
}

/** Relative phrase, e.g. "5 minutes ago". Localised once the locale loads. */
export function timeAgo(value: DateInput, fallback = ""): string {
  if (value === null || value === undefined || value === "") return fallback;
  const d = dayjs(value);
  return d.isValid() ? d.fromNow() : fallback;
}

/** Seconds as "2h 30m" / "45m" — suite-wide duration display. */
export function formatLoggedTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** Local calendar day key — "YYYY-MM-DD". Accepts a Date or date input. */
export function toISODate(value: DateInput = new Date()): string {
  return format(value, "YYYY-MM-DD", "");
}
