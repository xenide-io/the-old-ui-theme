'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { Check, ImagePlus, Search, Shapes, Smile, UploadCloud, X } from 'lucide-react';
import {
  fetchPaletteCollection,
  monoIconUrl,
  paletteIconBase,
  fetchPaletteEmojis,
  fetchPaletteIcons,
  findPaletteIcons,
  PALETTE_EMOJI_GROUPS,
  type PaletteCollection,
  type PaletteIcon,
} from '@/suite/lib/palette-api';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/cn';
import { SuiteIconImage } from '@/suite/components/suite-icon-image';
import { trackSuiteEvent } from '@/lib/suite-analytics';

const PAGE_SIZE = 60;

export interface SuitePalettePick {
  url: string;
  name?: string;
}

/** Shared emoji, icon and upload chooser. Hosts own saving and file validation. */
export function SuitePaletteLibrary({
  onPick,
  selectedUrl,
  onUpload,
  uploading = false,
  uploadHint = 'PNG, JPG, GIF, WebP or SVG. Maximum 512 KB.',
  uploadAccept = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml,.svg',
  error: uploadError,
}: {
  onPick: (icon: SuitePalettePick) => void;
  selectedUrl?: string | null;
  onUpload?: (file: File) => void;
  uploading?: boolean;
  uploadHint?: string;
  uploadAccept?: string;
  error?: string | null;
}) {
  const [tab, setTab] = useState(
    selectedUrl?.includes('/svgrepo/') && !selectedUrl.includes('/fluent-emoji/') ? 'icons' : 'emoji',
  );
  const [collections, setCollections] = useState<PaletteCollection[]>([]);
  const [collection, setCollection] = useState('');
  const [style, setStyle] = useState('');
  const [group, setGroup] = useState(PALETTE_EMOJI_GROUPS[0]?.value ?? '');
  const [variations, setVariations] = useState(false);
  const [queries, setQueries] = useState({ emoji: '', icons: '' });
  const [items, setItems] = useState<PaletteIcon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [focused, setFocused] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pagePending = useRef(false);
  const [dragging, setDragging] = useState(false);
  const panelId = useId();
  const query = tab === 'icons' ? queries.icons : queries.emoji;
  const emoji = tab === 'emoji';
  const label = emoji ? 'emoji' : 'icons';
  const searching = query.trim().length > 0;
  const visibleCollections = useMemo(
    () => [...collections].filter((item) => !style || item.style === style)
      .sort((a, b) => a.name.localeCompare(b.name)),
    [collections, style],
  );
  // Each tab opens on one real category. Only a search spans the whole library,
  // so the picker never requests an "everything" grid.
  const activeCollection = collection || visibleCollections[0]?.slug || '';

  useEffect(() => {
    if (tab !== 'icons') return;
    let cancelled = false;
    fetchPaletteIcons().then((library) => {
      if (!cancelled) setCollections(library.collections);
    }).catch((cause) => {
      if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load collections.');
    });
    return () => { cancelled = true; };
  }, [tab, retry]);

  useEffect(() => {
    if (tab === 'upload') return;
    let cancelled = false;
    setLoading(page === 1);
    setLoadingMore(page > 1);
    setError(null);
    if (page === 1) {
      setItems([]);
      setFocused(0);
      pagePending.current = false;
      scrollRef.current?.scrollTo?.({ top: 0 });
    }
    const timer = setTimeout(async () => {
      try {
        let next: PaletteIcon[];
        let count: number;
        if (tab === 'emoji') {
          const result = await fetchPaletteEmojis({
            q: query.trim() || undefined, group: searching ? undefined : group || undefined,
            include_variations: variations, page, size: PAGE_SIZE,
          });
          next = result.results;
          count = result.total;
        } else if (query.trim()) {
          const result = await findPaletteIcons({
            q: query.trim(), collection: undefined, style: style || undefined,
            limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE,
          });
          next = result.results;
          count = result.total;
        } else if (activeCollection) {
          const result = await fetchPaletteCollection(activeCollection, { page, size: PAGE_SIZE });
          next = result.icons;
          count = result.count;
        } else {
          // Before collections resolve, previews keep the grid small and varied.
          next = [...new Map(visibleCollections
            .flatMap((item) => item.preview.map((url) => ({
              id: url, name: item.name, tags: [], url,
            }))).map((item) => [item.url, item])).values()].slice(0, 120);
          count = next.length;
        }
        if (cancelled) return;
        setItems((current) => page === 1 ? next : [...current, ...next]);
        setTotal(count);
      } catch (cause) {
        if (!cancelled) setError(cause instanceof Error ? cause.message : 'Could not load the library.');
      } finally {
        pagePending.current = false;
        if (!cancelled) { setLoading(false); setLoadingMore(false); }
      }
    }, query.trim() ? 250 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [tab, query, searching, group, variations, activeCollection, style, visibleCollections, page, retry]);

  // Infinite scroll: the next page loads as the grid approaches its end.
  const loadNextPage = useCallback(() => {
    const element = scrollRef.current;
    if (!element || pagePending.current || loading || loadingMore) return;
    if (items.length >= total) return;
    if (element.scrollHeight - element.scrollTop - element.clientHeight > 200) return;
    pagePending.current = true;
    setPage((value) => value + 1);
  }, [items.length, total, loading, loadingMore]);

  function chooseFile(file?: File | null) {
    if (file) onUpload?.(file);
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  }

  function moveInGrid(event: KeyboardEvent<HTMLDivElement>) {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-palette-pick]'));
    const index = buttons.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    const columns = getComputedStyle(event.currentTarget).gridTemplateColumns.split(' ').length;
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, ArrowDown: index + columns,
      ArrowUp: index - columns, Home: 0, End: buttons.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    buttons[Math.max(0, Math.min(next, buttons.length - 1))]?.focus();
  }

  return (
    <div className="min-w-0 space-y-4" data-test="palette-icon-library" data-selected-url={selectedUrl || ''}>
      <SegmentedControl
        variant="tabs"
        aria-label="Icon source"
        aria-controls={panelId}
        className="w-full"
        value={tab}
        onChange={(value) => { setTab(value); setPage(1); trackSuiteEvent('Icon Picker Tab Changed', { source: value }); }}
        options={[
          { value: 'emoji', label: 'Emoji', icon: <Smile />, id: `${panelId}-emoji` },
          { value: 'icons', label: 'Icons', icon: <Shapes />, id: `${panelId}-icons` },
          ...(onUpload ? [{ value: 'upload', label: 'Upload', icon: <UploadCloud />, id: `${panelId}-upload` }] : []),
        ]}
      />
      <div id={panelId} role="tabpanel" aria-labelledby={`${panelId}-${tab}`} className="min-w-0 space-y-3">
        {tab === 'upload' ? (
          <div className="space-y-3">
            <button type="button" disabled={uploading} onClick={() => fileRef.current?.click()}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={cn(
                'group/upload flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dotted border-ph-border bg-ph-muted/20 px-5 py-8 text-center transition-colors disabled:opacity-60',
                dragging ? 'border-ph-brand bg-ph-brand/5' : 'hover:border-ph-brand hover:bg-ph-muted/40',
              )}>
              <span className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border border-ph-border bg-ph-surface text-ph-mutedtext transition-colors',
                dragging ? 'border-ph-brand text-ph-brand' : 'group-hover/upload:text-ph-ink',
              )}>
                <ImagePlus className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-sm font-medium text-ph-ink">
                {uploading ? 'Uploading…' : dragging ? 'Drop it here' : 'Drop an image or browse'}
              </span>
              <span className="max-w-[16rem] text-xs text-ph-mutedtext">{uploadHint}</span>
            </button>
            <input ref={fileRef} type="file" hidden data-test="icon-upload" aria-label="Upload icon image"
              accept={uploadAccept}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                chooseFile(file);
              }} />
          </div>
        ) : (
          <>
            <div className="relative" data-test="palette-toolbar">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ph-mutedtext" aria-hidden />
              <input type="search" value={query} maxLength={80} aria-label={`Search ${label}`}
                placeholder={emoji ? 'Search all emoji…' : 'Search all icons…'}
                onChange={(event) => { setQueries((current) => ({ ...current, [tab]: event.target.value })); setPage(1); }}
                className="ph-input h-11 min-w-0 w-full !pl-10 !pr-10 text-sm" />
              {query ? <button type="button" aria-label="Clear search" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ph-mutedtext hover:bg-ph-muted"
                onClick={() => { setQueries((current) => ({ ...current, [tab]: '' })); setPage(1); }}><X className="h-4 w-4" aria-hidden /></button> : null}
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {emoji ? (
                <>
                  <select aria-label="Emoji category" value={group} className="ph-select h-9 min-w-0 flex-1 text-sm"
                    onChange={(event) => {
                      setGroup(event.target.value);
                      setQueries((current) => ({ ...current, emoji: '' }));
                      setPage(1);
                    }}>
                    {PALETTE_EMOJI_GROUPS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  <label className="flex min-h-9 items-center gap-2 text-xs text-ph-mutedtext">
                    <input type="checkbox" checked={variations} onChange={(event) => { setVariations(event.target.checked); setPage(1); }} />
                    Skin tones & variations
                  </label>
                </>
              ) : (
                <>
                  <select aria-label="Icon collection" value={activeCollection} className="ph-select h-9 min-w-0 flex-1 text-sm"
                    onChange={(event) => {
                      setCollection(event.target.value);
                      setQueries((current) => ({ ...current, icons: '' }));
                      setPage(1);
                    }}>
                    {visibleCollections.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <select aria-label="Filter by icon type" value={style} className="ph-select h-9 min-w-0 max-w-[45%] text-sm"
                    onChange={(event) => { setStyle(event.target.value); setCollection(''); setPage(1); }}>
                    <option value="">All styles</option>
                    {[['line', 'Line'], ['solid', 'Solid'], ['duotone', 'Duotone'], ['color', 'Colour'], ['mixed', 'Mixed']]
                      .map(([value, name]) => <option key={value} value={value}>{name}</option>)}
                  </select>
                </>
              )}
            </div>
            <div ref={scrollRef} onScroll={loadNextPage} data-test="palette-scroll" aria-busy={loading || loadingMore}
              className="h-64 overflow-y-auto overscroll-contain rounded-xl border border-ph-border bg-ph-muted/20 p-2 sm:h-72">
              {loading ? (
                <div role="status" className="flex h-full items-center justify-center text-sm text-ph-mutedtext">Loading {label}…</div>
              ) : error && !items.length ? (
                <div role="alert" className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center text-sm text-ph-mutedtext">
                  <p>Could not load {label}. Please try again.</p>
                  <button type="button" className="ph-btn" onClick={() => setRetry((value) => value + 1)}>Try again</button>
                </div>
              ) : !items.length ? (
                <div role="status" className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <Search className="h-6 w-6 text-ph-mutedtext" aria-hidden />
                  <p className="text-sm font-medium text-ph-ink">No {label} found</p>
                  <p className="text-xs text-ph-mutedtext">Try a different word or category.</p>
                </div>
              ) : (
                <div onKeyDown={moveInGrid} className="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-1.5">
                  {items.map((item, index) => {
                    // A picked mono icon stores the URL with the `mono` hint.
                    const selected =
                      Boolean(selectedUrl) && paletteIconBase(selectedUrl!) === item.url;
                    return <Tooltip key={item.url} content={item.name} side="bottom">
                      <button type="button" data-palette-pick aria-label={`Use ${item.name}`} aria-pressed={selected}
                        tabIndex={focused === index ? 0 : -1} onFocus={() => setFocused(index)}
                        onClick={() => {
                          trackSuiteEvent('Icon Selected', { source: tab, collection: emoji ? 'fluent-emoji' : collection || 'all' });
                          onPick({
                            url: item.mono ? monoIconUrl(item.url) : item.url,
                            name: item.name,
                          });
                        }}
                        className={cn('relative flex aspect-square min-h-11 items-center justify-center rounded-lg border p-2 transition-colors focus-visible:outline-hidden focus-visible:shadow-[var(--ph-focus-halo)]',
                          selected
                            ? 'border-[var(--ph-selected-border)] bg-[var(--ph-selected-bg)]'
                            : 'border-ph-border/60 bg-ph-surface hover:border-ph-brand hover:bg-ph-muted/40')}>
                        <SuiteIconImage url={item.url} mono={item.mono} className="h-7 w-7 object-contain" />
                        {selected ? <Check className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-ph-surface text-ph-brand" aria-hidden /> : null}
                      </button>
                    </Tooltip>;
                  })}
                </div>
              )}
              {loadingMore ? <p role="status" className="py-3 text-center text-xs text-ph-mutedtext">Loading more…</p> : null}
              {error && items.length ? <p role="alert" className="p-2 text-sm text-ph-danger">Could not load more. <button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button></p> : null}
            </div>
            <div role="status" className="flex items-center justify-between gap-2 text-xs text-ph-mutedtext">
              <span>{loading ? 'Finding your next icon…' : `${items.length} of ${total.toLocaleString()} ${label}`}</span>
              <span>{emoji ? 'Microsoft Fluent' : 'SVG library'}</span>
            </div>
          </>
        )}
        {uploadError ? <p role="alert" className="text-sm text-ph-danger">{uploadError}</p> : null}
      </div>
    </div>
  );
}
