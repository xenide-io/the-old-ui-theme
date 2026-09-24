'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Filter, FilterList, NavArrowDown, Search } from 'iconoir-react';
import {
  fetchPaletteCollection,
  fetchPaletteLibrary,
  findPaletteIcons,
  type PaletteCollection,
  type PaletteIcon,
} from '@/suite/lib/palette-api';
import { cn } from '@/lib/cn';

const PAGE_SIZE = 60;
const DISCOVER_LIMIT = 120;

const ICON_TYPES = [
  { value: 'all', label: 'All types' },
  { value: 'line', label: 'Line' },
  { value: 'solid', label: 'Solid' },
  { value: 'duotone', label: 'Duotone' },
  { value: 'color', label: 'Colour' },
  { value: 'mixed', label: 'Mixed' },
];

export interface SuitePalettePick {
  url: string;
  name?: string;
}

function FilterSelect({
  icon: Icon,
  label,
  value,
  onChange,
  children,
}: {
  icon: typeof Filter;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
        aria-hidden
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full appearance-none rounded-lg border border-ph-border bg-ph-surface py-2 pl-8 pr-7 text-sm text-ph-ink focus:border-ph-brand focus:outline-none"
      >
        {children}
      </select>
      <NavArrowDown
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ph-mutedtext"
        aria-hidden
      />
    </div>
  );
}

/**
 * Browse and search the Palette icon library: a search box plus a library
 * filter and an icon-type filter. Searching is global; the filters narrow it.
 * Drop it in a modal and use `onPick` to receive the chosen icon URL.
 */
export function SuitePaletteLibrary({
  onPick,
}: {
  onPick: (icon: SuitePalettePick) => void;
}) {
  const [collections, setCollections] = useState<PaletteCollection[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryQuery, setLibraryQuery] = useState('');
  const libraryRef = useRef<HTMLDivElement>(null);
  const [icons, setIcons] = useState<PaletteIcon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const libraryOptions = useMemo(() => {
    const list = collections.filter(
      (item) => typeFilter === 'all' || item.style === typeFilter,
    );
    return [...list].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
    );
  }, [collections, typeFilter]);

  // A pleasant default when browsing "All libraries" with no search.
  const discoverIcons = useMemo<PaletteIcon[]>(() => {
    const seen = new Set<string>();
    const out: PaletteIcon[] = [];
    for (const collection of libraryOptions) {
      for (const url of collection.preview) {
        if (seen.has(url)) continue;
        seen.add(url);
        out.push({ id: url, name: collection.name, tags: [], url });
        if (out.length >= DISCOVER_LIMIT) return out;
      }
    }
    return out;
  }, [libraryOptions]);

  const loadCollection = useCallback(async (slug: string, nextPage = 1) => {
    const id = ++requestId.current;
    if (nextPage === 1) {
      setLoading(true);
      setIcons([]);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const detail = await fetchPaletteCollection(slug, {
        page: nextPage,
        size: PAGE_SIZE,
      });
      if (id !== requestId.current) return;
      setTotal(detail.count);
      setPage(nextPage);
      setIcons((current) =>
        nextPage === 1 ? detail.icons : [...current, ...detail.icons],
      );
    } catch (err) {
      if (id === requestId.current) {
        setError(err instanceof Error ? err.message : 'Could not load icons.');
      }
    } finally {
      if (id === requestId.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPaletteLibrary()
      .then((library) => {
        if (cancelled) return;
        setCollections(library.collections);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Could not load the library.');
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Drop a library selection that no longer matches the type filter.
  useEffect(() => {
    if (!collections.length) return;
    if (collectionFilter && !libraryOptions.some((c) => c.slug === collectionFilter)) {
      setCollectionFilter('');
    }
  }, [libraryOptions, collectionFilter, collections.length]);

  // Browse: one library, or the discover grid for "All libraries".
  useEffect(() => {
    if (query.trim()) return;
    if (collectionFilter) {
      void loadCollection(collectionFilter, 1);
      return;
    }
    requestId.current += 1;
    setLoading(false);
    setPage(1);
    setIcons(discoverIcons);
    setTotal(discoverIcons.length);
  }, [collectionFilter, query, loadCollection, discoverIcons]);

  // Search across the whole library, scoped by the active filters.
  useEffect(() => {
    const term = query.trim();
    if (!term) return;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    const handle = setTimeout(async () => {
      try {
        const results = await findPaletteIcons({
          q: term,
          collection: collectionFilter || undefined,
          style: typeFilter === 'all' ? undefined : typeFilter,
          limit: 120,
        });
        if (id !== requestId.current) return;
        setTotal(results.total);
        setPage(1);
        setIcons(
          results.results.map((hit) => ({
            id: `${hit.collection}/${hit.id}`,
            name: hit.name,
            tags: hit.tags,
            url: hit.url,
          })),
        );
      } catch (err) {
        if (id === requestId.current) {
          setError(err instanceof Error ? err.message : 'Search failed.');
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query, collectionFilter, typeFilter]);

  const searching = Boolean(query.trim());
  const activeLibrary = collections.find((c) => c.slug === collectionFilter) ?? null;

  const filteredLibraries = useMemo(() => {
    const term = libraryQuery.trim().toLowerCase();
    if (!term) return libraryOptions;
    return libraryOptions.filter((c) => c.name.toLowerCase().includes(term));
  }, [libraryOptions, libraryQuery]);

  useEffect(() => {
    if (!libraryOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!libraryRef.current?.contains(event.target as Node)) setLibraryOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [libraryOpen]);

  return (
    <div className="space-y-3" data-test="palette-icon-library">
      <div ref={libraryRef} className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons — handshake, rocket, briefcase…"
              aria-label="Search icons"
              className="w-full rounded-lg border border-ph-border bg-ph-surface py-2 pl-8 pr-3 text-sm text-ph-ink placeholder:text-ph-mutedtext focus:border-ph-brand focus:outline-none"
            />
          </div>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={libraryOpen}
            onClick={() => setLibraryOpen((open) => !open)}
            className="flex items-center gap-2 rounded-lg border border-ph-border bg-ph-surface px-2.5 py-2 text-sm text-ph-ink hover:border-ph-brand focus:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
          >
            <FilterList className="h-4 w-4 shrink-0 text-ph-mutedtext" aria-hidden />
            <span className="max-w-[10rem] truncate">
              {activeLibrary?.name ?? "All libraries"}
            </span>
            <NavArrowDown
              className={cn(
                "h-3.5 w-3.5 shrink-0 text-ph-mutedtext transition-transform",
                libraryOpen && "rotate-180",
              )}
              aria-hidden
            />
          </button>
          <FilterSelect
            icon={Filter}
            label="Filter by icon type"
            value={typeFilter}
            onChange={setTypeFilter}
          >
            {ICON_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </FilterSelect>
        </div>

        {libraryOpen ? (
          <div className="rounded-lg border border-ph-border bg-ph-surface p-2">
            <div className="relative mb-2">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
                aria-hidden
              />
              <input
                type="search"
                autoFocus
                value={libraryQuery}
                onChange={(event) => setLibraryQuery(event.target.value)}
                placeholder="Search libraries…"
                aria-label="Search libraries"
                className="w-full rounded-md border border-ph-border bg-ph-muted py-1.5 pl-8 pr-3 text-sm text-ph-ink placeholder:text-ph-mutedtext focus:border-ph-brand focus:outline-none"
              />
            </div>
            <ul
              role="listbox"
              aria-label="Libraries"
              className="max-h-56 overflow-y-auto"
            >
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={!collectionFilter}
                  onClick={() => {
                    setCollectionFilter("");
                    setLibraryOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm",
                    !collectionFilter
                      ? "bg-ph-muted text-ph-ink"
                      : "text-ph-ink hover:bg-ph-muted",
                  )}
                >
                  All libraries
                </button>
              </li>
              {filteredLibraries.map((collection) => (
                <li key={collection.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={collectionFilter === collection.slug}
                    onClick={() => {
                      setCollectionFilter(collection.slug);
                      setLibraryOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                      collectionFilter === collection.slug
                        ? "bg-ph-muted text-ph-ink"
                        : "text-ph-ink hover:bg-ph-muted",
                    )}
                  >
                    <span className="truncate">{collection.name}</span>
                    <span className="shrink-0 text-xs text-ph-mutedtext">
                      {collection.count}
                    </span>
                  </button>
                </li>
              ))}
              {filteredLibraries.length === 0 ? (
                <li className="px-2 py-4 text-center text-sm text-ph-mutedtext">
                  No libraries match.
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-ph-danger">{error}</p>
      ) : loading ? (
        <p className="py-8 text-center text-sm text-ph-mutedtext">Loading icons…</p>
      ) : icons.length === 0 ? (
        <p className="py-8 text-center text-sm text-ph-mutedtext">
          No icons matched. Try another word or filter.
        </p>
      ) : (
        <>
          <div className="max-h-[320px] overflow-y-auto rounded-lg border border-ph-border p-2">
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
              {icons.map((icon) => (
                <button
                  key={icon.id}
                  type="button"
                  onClick={() => onPick({ url: icon.url, name: icon.name })}
                  title={icon.name}
                  aria-label={`Use ${icon.name}`}
                  className="flex h-10 items-center justify-center rounded-md border border-transparent p-1.5 hover:border-ph-brand hover:bg-ph-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={icon.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-6"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-ph-mutedtext">
            <span>
              {icons.length} of {total}
              {searching
                ? ' matching'
                : activeLibrary
                  ? ` in ${activeLibrary.name}`
                  : ' across all libraries'}
            </span>
            {!searching && activeLibrary && icons.length < total ? (
              <button
                type="button"
                disabled={loadingMore}
                onClick={() => void loadCollection(activeLibrary.slug, page + 1)}
                className={cn(
                  'font-medium text-ph-brand hover:underline',
                  loadingMore && 'opacity-50',
                )}
              >
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
