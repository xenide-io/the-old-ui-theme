/**
 * Palette — the shared icon library client.
 *
 * Points at the standalone `apps/svgrepo-api` service. Icons are plain SVGs on
 * the public media host, so a picked icon is just a URL to store as
 * `icon_image`.
 */

const PALETTE_URL = (
  process.env.NEXT_PUBLIC_PALETTE_URL ?? 'http://localhost:8010'
).replace(/\/$/, '');

export interface PaletteCollection {
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
    `${PALETTE_URL}${path}${suffix ? `?${suffix}` : ''}`,
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
  const key = `${path}?${toQuery(params)}`;
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
}): Promise<{ query: string; total: number; limit: number; results: PaletteHit[] }> {
  return paletteGet('/find', options);
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
  return `${PALETTE_URL}/render?src=${encodeURIComponent(imageUrl)}&color=${encodeURIComponent(color)}`;
}
