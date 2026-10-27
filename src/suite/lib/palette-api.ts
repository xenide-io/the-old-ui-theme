/**
 * Palette — the shared icon library client.
 *
 * Points at the standalone `apps/svgrepo-api` service. Icons are plain SVGs on
 * the public media host, so a picked icon is just a URL to store as
 * `icon_image`.
 */

let paletteUrlOverride: string | null = null;

/** Host apps (Vite) inject the palette URL at boot; env is the fallback. */
export function setPaletteUrl(url: string | null): void {
  paletteUrlOverride = url ? url.replace(/\/$/, '') : null;
}

function paletteUrl(): string {
  if (paletteUrlOverride) return paletteUrlOverride;
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_PALETTE_URL) {
    return process.env.NEXT_PUBLIC_PALETTE_URL.replace(/\/$/, '');
  }
  return 'http://localhost:8010';
}

export interface PaletteCollection {
  kind: 'icon' | 'emoji';
  slug: string;
  name: string;
  blurb: string;
  category: string;
  style: string;
  count: number;
  license: string;
  license_owner: string;
  license_link: string;
  featured: boolean;
  preview: string[];
}

export interface PaletteIcon {
  id: string;
  name: string;
  tags: string[];
  url: string;
  /** Single-colour artwork: render as a mask so it follows the theme text colour. */
  mono?: boolean;
}

export interface PaletteEmoji extends PaletteIcon {
  emoji: string;
  hexcode: string;
  group: string;
  subgroup: string;
  variation: boolean;
}

/** Emoji groups in Unicode order, shared by the emoji pickers. */
export const PALETTE_EMOJI_GROUPS: ReadonlyArray<{
  value: string;
  label: string;
  short: string;
}> = [
  { value: 'smileys-emotion', label: 'Smileys & emotion', short: 'Smileys' },
  { value: 'people-body', label: 'People & body', short: 'People' },
  { value: 'animals-nature', label: 'Animals & nature', short: 'Nature' },
  { value: 'food-drink', label: 'Food & drink', short: 'Food' },
  { value: 'travel-places', label: 'Travel & places', short: 'Travel' },
  { value: 'activities', label: 'Activities', short: 'Activities' },
  { value: 'objects', label: 'Objects', short: 'Objects' },
  { value: 'symbols', label: 'Symbols', short: 'Symbols' },
  { value: 'component', label: 'Components', short: 'Components' },
];

export function fetchPaletteEmojis(options?: {
  q?: string;
  group?: string;
  include_variations?: boolean;
  page?: number;
  size?: number;
}): Promise<{ total: number; page: number; page_size: number; results: PaletteEmoji[] }> {
  return paletteGetCached('/emojis', options, 60_000);
}

export function fetchPaletteIcons(): Promise<PaletteLibrary> {
  return paletteGetCached('/icons', undefined, 5 * 60_000);
}

export interface PaletteCollectionDetail {
  slug: string;
  name: string;
  blurb: string;
  category: string;
  style: string;
  count: number;
  page: number;
  page_size: number;
  icons: PaletteIcon[];
}

export interface PaletteHit extends PaletteIcon {
  collection: string;
  collection_name: string;
  category: string;
}

export interface PaletteLibrary {
  app: string;
  generated_at: string;
  totals: { collections: number; icons: number };
  collections: PaletteCollection[];
}

function toQuery(params?: Record<string, string | number | boolean>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  }
  return query.toString();
}

async function paletteGet<T>(
  path: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const suffix = toQuery(params);
  const response = await fetch(
    `${paletteUrl()}${path}${suffix ? `?${suffix}` : ''}`,
    { headers: { Accept: 'application/json' } },
  );
  if (!response.ok) {
    throw new Error(`Palette request failed (${response.status}).`);
  }
  return (await response.json()) as T;
}

const cache = new Map<string, { expires: number; value: unknown }>();

async function paletteGetCached<T>(
  path: string,
  params: Record<string, string | number | boolean> | undefined,
  ttlMs: number,
): Promise<T> {
  const key = `${paletteUrl()}${path}?${toQuery(params)}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expires > now) return hit.value as T;
  const value = await paletteGet<T>(path, params);
  cache.set(key, { expires: now + ttlMs, value });
  return value;
}

export function fetchPaletteLibrary(options?: {
  featured?: boolean;
  category?: string;
  q?: string;
}): Promise<PaletteLibrary> {
  return paletteGetCached<PaletteLibrary>('/library', options, 5 * 60_000);
}

export function fetchPaletteCollection(
  slug: string,
  options?: { page?: number; size?: number },
): Promise<PaletteCollectionDetail> {
  return paletteGetCached<PaletteCollectionDetail>(
    `/collections/${slug}`,
    options,
    2 * 60_000,
  );
}

export function findPaletteIcons(options: {
  q: string;
  category?: string;
  collection?: string;
  style?: string;
  limit?: number;
  offset?: number;
}): Promise<{ query: string; total: number; limit: number; results: PaletteHit[] }> {
  return paletteGet('/icons/search', options);
}

/**
 * Monochrome hint carried in the stored icon URL. A document only keeps the URL,
 * so the hint lets every later surface (page icon, sidebar, directory) mask the
 * SVG without needing Palette's manifest at render time.
 */
const MONO_QUERY = "mono=1";

/** True when the URL carries the monochrome hint. */
export function hasMonoIcon(url: string | null | undefined): boolean {
  return Boolean(url && /[?&]mono=1(?:&|$)/.test(url));
}

/** The URL to store for a single-colour Palette icon. */
export function monoIconUrl(url: string): string {
  if (!url.includes("/svgrepo/") || url.includes("/svgrepo/fluent-emoji/")) return url;
  if (hasMonoIcon(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${MONO_QUERY}`;
}

/** The same icon without the monochrome hint, for comparisons and rendering. */
export function paletteIconBase(url: string): string {
  return url.replace(/([?&])mono=1&?/, "$1").replace(/[?&]$/, "");
}

/**
 * Same-origin URL for masking a single-colour icon.
 *
 * A CSS mask loads its image with CORS; the media host sends no CORS headers, so
 * the mask is served by Palette instead (which does). Palette returns the SVG
 * unchanged apart from its paint, and the mask only reads the alpha channel.
 */
export function paletteMaskSrc(url: string): string {
  const base = paletteIconBase(url);
  if (!base.includes("/svgrepo/") || base.includes("/svgrepo/fluent-emoji/")) return url;
  return `${paletteUrl()}/render?src=${encodeURIComponent(base)}`;
}

/**
 * Recoloured icon URL for a Palette asset.
 *
 * Cross-origin SVGs can't be tinted in the browser (no CORS on the media
 * host), so Palette recolours them server-side. Non-Palette icons (uploads)
 * are returned untouched.
 */
export function paletteIconSrc(
  imageUrl: string | null | undefined,
  color: string | null | undefined,
): string | null | undefined {
  if (!imageUrl || !color) return imageUrl;
  if (!imageUrl.includes('/svgrepo/')) return imageUrl;
  if (imageUrl.includes('/svgrepo/fluent-emoji/')) return imageUrl;
  return `${paletteUrl()}/render?src=${encodeURIComponent(imageUrl)}&color=${encodeURIComponent(color)}`;
}
