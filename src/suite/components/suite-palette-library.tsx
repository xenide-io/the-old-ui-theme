'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { NavArrowDown, Search } from 'iconoir-react';
import {
  fetchPaletteCollection,
  fetchPaletteLibrary,
  findPaletteIcons,
  type PaletteCollection,
  type PaletteIcon,
} from '@/suite/lib/palette-api';
import { Tooltip } from '@/components/ui/Tooltip';
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
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ph-select h-full min-w-0 w-full py-2 pl-3 pr-10"
      >
        {children}
      </select>
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
  const libraryTriggerRef = useRef<HTMLButtonElement>(null);
  const libraryListboxId = useId();
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

  const closeLibrary = (restoreFocus = false) => {
    setLibraryOpen(false);
    if (restoreFocus) requestAnimationFrame(() => libraryTriggerRef.current?.focus());
  };

  const handleLibraryOptionKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    const options = Array.from(
      libraryRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') ?? [],
    );
    const index = options.indexOf(event.currentTarget);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (index + 1) % options.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - 1 + options.length) % options.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = options.length - 1;
        break;
      case 'Escape':
        event.preventDefault();
        closeLibrary(true);
        return;
      default:
        return;
    }

    event.preventDefault();
    options[nextIndex]?.focus();
  };

  return (
    <div className="space-y-3" data-test="palette-icon-library">
      <div ref={libraryRef} className="space-y-2">
        <div className="grid min-w-0 grid-cols-2 gap-2" data-test="palette-toolbar">
          <div className="relative col-span-2 min-w-0">
            <Search
              className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search icons…"
              aria-label="Search icons"
              className="ph-input min-w-0 w-full py-2 pl-8 pr-3"
            />
          </div>
          <button
            ref={libraryTriggerRef}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={libraryOpen}
            aria-controls={libraryOpen ? libraryListboxId : undefined}
            onClick={() => setLibraryOpen((open) => !open)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && libraryOpen) {
                event.preventDefault();
                closeLibrary();
              }
            }}
            className="ph-input flex min-w-0 w-full items-center gap-2 px-2.5 py-2 text-sm text-ph-ink"
          >
            <span className="min-w-0 flex-1 truncate text-left">
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
          <div className="rounded-[var(--ph-radius-overlay)] border border-[var(--ph-border-control)] bg-[var(--ph-surface-overlay)] p-2 shadow-[var(--ph-shadow-floating)]">
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
                className="ph-input w-full bg-[var(--ph-surface-inset)] py-1.5 pl-8 pr-3"
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    libraryRef.current
                      ?.querySelector<HTMLButtonElement>('[role="option"]')
                      ?.focus();
                  } else if (event.key === 'Escape') {
                    event.preventDefault();
                    closeLibrary(true);
                  }
                }}
              />
            </div>
            <ul
              role="listbox"
              id={libraryListboxId}
              aria-label="Libraries"
              className="max-h-56 overflow-y-auto"
            >
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={!collectionFilter}
                  tabIndex={-1}
                  onKeyDown={handleLibraryOptionKeyDown}
                  onClick={() => {
                    setCollectionFilter("");
                    closeLibrary(true);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-[var(--ph-radius-control)] px-2 py-1.5 text-left text-sm focus-visible:outline-hidden focus-visible:shadow-[var(--ph-focus-halo)]",
                    !collectionFilter
                      ? "bg-[var(--ph-selected-bg)] text-[var(--ph-selected-text)]"
                      : "text-ph-ink hover:bg-[var(--ph-surface-hover)]",
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
                    tabIndex={-1}
                    onKeyDown={handleLibraryOptionKeyDown}
                    onClick={() => {
                      setCollectionFilter(collection.slug);
                      closeLibrary(true);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-[var(--ph-radius-control)] px-2 py-1.5 text-left text-sm focus-visible:outline-hidden focus-visible:shadow-[var(--ph-focus-halo)]",
                      collectionFilter === collection.slug
                        ? "bg-[var(--ph-selected-bg)] text-[var(--ph-selected-text)]"
                        : "text-ph-ink hover:bg-[var(--ph-surface-hover)]",
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
          <div className="max-h-[20rem] overflow-y-auto rounded-[var(--ph-radius-surface)] border border-ph-border p-2 focus-within:border-[var(--ph-selected-border)]">
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
              {icons.map((icon) => (
                <Tooltip key={icon.id} content={icon.name} side="bottom">
                <button
                  type="button"
                  onClick={() => onPick({ url: icon.url, name: icon.name })}
                  aria-label={`Use ${icon.name}`}
                  className="flex h-10 items-center justify-center rounded-[var(--ph-radius-control)] border border-transparent p-1.5 hover:border-[var(--ph-selected-border)] hover:bg-[var(--ph-surface-hover)] focus-visible:outline-hidden focus-visible:shadow-[var(--ph-focus-halo)]"
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
                </Tooltip>
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
