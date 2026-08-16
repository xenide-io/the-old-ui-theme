'use client';

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  Erase,
  Sparks,
  Square,
  WarningTriangle,
  Xmark as X,
} from 'iconoir-react';

const SuiteAiBlockNoteMessage = lazy(() => import('./ai-message-blocknote'));

export const SUITE_OPEN_ASK_AI_EVENT = 'shellstack:open-ask-ai';

export type SuiteAskAiOpenDetail = {
  prompt?: string;
};

/** Open the suite Ask AI panel from anywhere (Today card, command palette, …). */
export function openSuiteAskAi(detail?: SuiteAskAiOpenDetail): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<SuiteAskAiOpenDetail>(SUITE_OPEN_ASK_AI_EVENT, {
      detail: detail ?? {},
    }),
  );
}

export interface SuiteAiPreset {
  label: string;
  prompt: string;
}

export interface SuiteAiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

export type SuiteAiLauncherEdge = 'top' | 'right' | 'bottom' | 'left';
type LauncherEdge = SuiteAiLauncherEdge;
type LauncherPosition = { x: number; y: number };

const LAUNCHER_EDGE_GAP = 12;
const LAUNCHER_STORAGE_KEY = 'suite-ask-ai-launcher-position';

export function resolveSuiteAiLauncherPosition(
  edge: LauncherEdge,
  desiredX: number,
  desiredY: number,
  viewportWidth: number,
  viewportHeight: number,
  launcherWidth: number,
  launcherHeight: number,
): LauncherPosition {
  const maxX = Math.max(
    LAUNCHER_EDGE_GAP,
    viewportWidth - launcherWidth - LAUNCHER_EDGE_GAP,
  );
  const maxY = Math.max(
    LAUNCHER_EDGE_GAP,
    viewportHeight - launcherHeight - LAUNCHER_EDGE_GAP,
  );
  const clampX = (x: number) => Math.min(Math.max(x, LAUNCHER_EDGE_GAP), maxX);
  const clampY = (y: number) => Math.min(Math.max(y, LAUNCHER_EDGE_GAP), maxY);
  switch (edge) {
    case 'left':
      return { x: LAUNCHER_EDGE_GAP, y: clampY(desiredY) };
    case 'right':
      return { x: maxX, y: clampY(desiredY) };
    case 'top':
      return { x: clampX(desiredX), y: LAUNCHER_EDGE_GAP };
    case 'bottom':
      return { x: clampX(desiredX), y: maxY };
  }
}

/** Which edge the launcher is closest to, used to dock after a drag. */
export function resolveSuiteAiNearestEdge(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
): LauncherEdge {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const candidates: Array<{ edge: LauncherEdge; distance: number }> = [
    { edge: 'left', distance: centerX },
    { edge: 'right', distance: viewportWidth - centerX },
    { edge: 'top', distance: centerY },
    { edge: 'bottom', distance: viewportHeight - centerY },
  ];
  return candidates.reduce((nearest, candidate) =>
    candidate.distance < nearest.distance ? candidate : nearest,
  ).edge;
}

/** Which horizontal side the slide-over should open from for a docked edge. */
export function resolveSuiteAiPanelSide(
  edge: LauncherEdge,
  x: number,
  viewportWidth: number,
): 'left' | 'right' {
  if (edge === 'left') return 'left';
  if (edge === 'right') return 'right';
  return x < viewportWidth / 2 ? 'left' : 'right';
}

/**
 * Suite-wide Ask AI slide-over — Notion-style continuous chat.
 *
 * One thread per workspace (persisted via injected fetch/send/clear helpers).
 * Not Kraken Deep Research. Apps mount this once in the authenticated shell.
 */
export function SuiteAiPanel({
  presets = [],
  emptyState = 'Ask anything about your workspace, or look something up online.',
  title = 'Ask AI',
  fetchChat,
  sendMessage,
  clearChat,
  brandIcon: BrandIcon,
  spinner: Spinner,
  hideLauncher = false,
}: {
  presets?: SuiteAiPreset[];
  emptyState?: ReactNode;
  title?: string;
  fetchChat: () => Promise<{
    messages: SuiteAiChatMessage[];
    configured: boolean;
  }>;
  sendMessage: (params: {
    prompt: string;
    signal?: AbortSignal;
  }) => Promise<{ messages: SuiteAiChatMessage[]; reply: string }>;
  clearChat: () => Promise<void>;
  brandIcon?: ComponentType<{ className?: string }>;
  spinner: ComponentType<{ className?: string }>;
  /** When true, only Today / events open the panel (no floating button). */
  hideLauncher?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<SuiteAiChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [launcherSide, setLauncherSide] = useState<LauncherEdge>('right');
  const [panelSide, setPanelSide] = useState<'left' | 'right'>('right');
  const [launcherPosition, setLauncherPosition] =
    useState<LauncherPosition | null>(null);
  const [draggingLauncher, setDraggingLauncher] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const launcherSideRef = useRef<LauncherEdge>('right');
  const launcherPositionRef = useRef<LauncherPosition | null>(null);
  const launcherDragRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
    startX: number;
    startY: number;
  } | null>(null);
  const suppressLauncherClickRef = useRef(false);
  const pendingPromptRef = useRef<string | null>(null);

  useEffect(() => {
    const launcher = launcherRef.current;
    if (!launcher) return;

    let side: LauncherEdge = 'right';
    let desiredX = LAUNCHER_EDGE_GAP;
    let desiredY = window.innerHeight - launcher.offsetHeight - 20;
    try {
      const stored = JSON.parse(
        localStorage.getItem(LAUNCHER_STORAGE_KEY) || 'null',
      ) as {
        side?: LauncherEdge;
        x?: number;
        y?: number;
      } | null;
      if (
        stored?.side === 'top' ||
        stored?.side === 'right' ||
        stored?.side === 'bottom' ||
        stored?.side === 'left'
      )
        side = stored.side;
      if (typeof stored?.x === 'number') desiredX = stored.x;
      if (typeof stored?.y === 'number') desiredY = stored.y;
    } catch {
      // Ignore invalid saved launcher positions.
    }

    launcherSideRef.current = side;
    setLauncherSide(side);

    const placeLauncher = () => {
      const element = launcherRef.current;
      if (!element) return;
      const next = resolveSuiteAiLauncherPosition(
        launcherSideRef.current,
        launcherPositionRef.current?.x ?? desiredX,
        launcherPositionRef.current?.y ?? desiredY,
        window.innerWidth,
        window.innerHeight,
        element.offsetWidth,
        element.offsetHeight,
      );
      launcherPositionRef.current = next;
      setLauncherPosition(next);
      setPanelSide(
        resolveSuiteAiPanelSide(
          launcherSideRef.current,
          next.x,
          window.innerWidth,
        ),
      );
    };

    placeLauncher();
    window.addEventListener('resize', placeLauncher);
    return () => window.removeEventListener('resize', placeLauncher);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    // Within 64px of the bottom counts as "pinned" — matches the
    // stick-to-bottom threshold most AI chats use for streaming reflow.
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distance < 64);
  }, []);

  const hydrate = useCallback(async () => {
    setHydrating(true);
    setError('');
    try {
      const data = await fetchChat();
      setMessages(data.messages ?? []);
      if (!data.configured) {
        setError('ShellStack AI is not configured for this workspace yet.');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load your Ask AI chat.',
      );
    } finally {
      setHydrating(false);
    }
  }, [fetchChat]);

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<SuiteAskAiOpenDetail>).detail;
      setOpen(true);
      if (detail?.prompt?.trim()) {
        pendingPromptRef.current = detail.prompt.trim();
        setPrompt(detail.prompt.trim());
      }
    }
    window.addEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
    return () => window.removeEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    void hydrate().then(() => {
      const pending = pendingPromptRef.current;
      pendingPromptRef.current = null;
      if (pending) {
        // Leave prompt filled; user can send, or auto-send on next tick.
        setPrompt(pending);
      }
    });
  }, [open, hydrate]);

  useEffect(() => {
    if (open && atBottom) scrollToBottom();
  }, [messages, loading, open, atBottom, scrollToBottom]);

  // Focus the composer when the panel opens (but never steal focus mid-stream).
  useEffect(() => {
    if (open && !hydrating) textareaRef.current?.focus();
  }, [open, hydrating]);

  // Close on Escape while the panel is open.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Auto-grow the composer with content, up to a cap, then scroll.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 176)}px`;
  }, [prompt, open]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError('');
    setPrompt('');
    setAtBottom(true);
    // Optimistic user message — replaced by server messages on success.
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    try {
      const result = await sendMessage({
        prompt: trimmed,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      setMessages(result.messages ?? []);
    } catch (err) {
      // A user-initiated stop is not an error — leave the optimistic
      // message in place and let them retry.
      if (controller.signal.aborted) return;
      setMessages((prev) =>
        prev[prev.length - 1]?.role === 'user' &&
        prev[prev.length - 1]?.content === trimmed
          ? prev.slice(0, -1)
          : prev,
      );
      setPrompt(trimmed);
      setError(
        err instanceof Error
          ? err.message
          : 'The AI request failed. Try again.',
      );
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }

  function retry() {
    const lastUser = [...messages]
      .reverse()
      .find((m) => m.role === 'user')?.content;
    setError('');
    if (lastUser) void ask(lastUser);
    else void hydrate();
  }

  async function handleClear() {
    if (loading) return;
    try {
      await clearChat();
      setMessages([]);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not clear this chat.',
      );
    }
  }

  async function copyMessage(index: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(index);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Clipboard unavailable.
    }
  }

  function saveLauncherPosition(
    edge: LauncherEdge,
    position: LauncherPosition,
  ) {
    try {
      localStorage.setItem(
        LAUNCHER_STORAGE_KEY,
        JSON.stringify({ side: edge, x: position.x, y: position.y }),
      );
    } catch {
      // Storage may be unavailable; dragging still works for this session.
    }
  }

  function dockLauncher(
    edge: LauncherEdge,
    desiredX: number,
    desiredY: number,
  ) {
    const launcher = launcherRef.current;
    if (!launcher) return;
    const next = resolveSuiteAiLauncherPosition(
      edge,
      desiredX,
      desiredY,
      window.innerWidth,
      window.innerHeight,
      launcher.offsetWidth,
      launcher.offsetHeight,
    );
    launcherSideRef.current = edge;
    launcherPositionRef.current = next;
    setLauncherSide(edge);
    setLauncherPosition(next);
    setPanelSide(resolveSuiteAiPanelSide(edge, next.x, window.innerWidth));
    saveLauncherPosition(edge, next);
  }

  function startLauncherDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    launcherDragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      startX: event.clientX,
      startY: event.clientY,
    };
    suppressLauncherClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingLauncher(true);
  }

  function moveLauncher(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = launcherDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const launcher = event.currentTarget;
    const maxX = Math.max(
      LAUNCHER_EDGE_GAP,
      window.innerWidth - launcher.offsetWidth - LAUNCHER_EDGE_GAP,
    );
    const maxY = Math.max(
      LAUNCHER_EDGE_GAP,
      window.innerHeight - launcher.offsetHeight - LAUNCHER_EDGE_GAP,
    );
    const next = {
      x: Math.min(
        Math.max(event.clientX - drag.offsetX, LAUNCHER_EDGE_GAP),
        maxX,
      ),
      y: Math.min(
        Math.max(event.clientY - drag.offsetY, LAUNCHER_EDGE_GAP),
        maxY,
      ),
    };
    if (
      Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 4
    ) {
      suppressLauncherClickRef.current = true;
    }
    launcherPositionRef.current = next;
    setLauncherPosition(next);
  }

  function finishLauncherDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const drag = launcherDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    launcherDragRef.current = null;
    setDraggingLauncher(false);
    const rect = event.currentTarget.getBoundingClientRect();
    const currentX = launcherPositionRef.current?.x ?? rect.left;
    const currentY = launcherPositionRef.current?.y ?? rect.top;
    const edge = resolveSuiteAiNearestEdge(
      currentX,
      currentY,
      rect.width,
      rect.height,
      window.innerWidth,
      window.innerHeight,
    );
    dockLauncher(edge, currentX, currentY);
  }

  function moveLauncherWithKeyboard(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    const edgeByKey: Record<string, LauncherEdge> = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'top',
      ArrowDown: 'bottom',
    };
    const edge = edgeByKey[event.key];
    if (!edge) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const currentX = launcherPositionRef.current?.x ?? rect.left;
    const currentY = launcherPositionRef.current?.y ?? rect.top;
    dockLauncher(edge, currentX, currentY);
  }

  const Icon = BrandIcon ?? Sparks;

  return (
    <>
      {!hideLauncher ? (
        <>
          <button
            ref={launcherRef}
            type="button"
            data-test="ai-panel-launcher"
            onClick={() => {
              if (suppressLauncherClickRef.current) {
                suppressLauncherClickRef.current = false;
                return;
              }
              setOpen(true);
            }}
            onPointerDown={startLauncherDrag}
            onPointerMove={moveLauncher}
            onPointerUp={finishLauncherDrag}
            onPointerCancel={finishLauncherDrag}
            onKeyDown={moveLauncherWithKeyboard}
            className={`fixed z-30 flex touch-none select-none items-center gap-2 rounded-full border border-ph-border bg-ph-surface px-4 py-2.5 text-sm font-medium text-ph-ink shadow-ph hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand ${draggingLauncher ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={
              launcherPosition
                ? { left: launcherPosition.x, top: launcherPosition.y }
                : { bottom: 20, right: 20 }
            }
            aria-label="Open Ask AI"
            aria-describedby="suite-ask-ai-launcher-help"
          >
            <Icon className="h-4 w-4 text-ph-brand" />
            Ask AI
          </button>
          <span id="suite-ask-ai-launcher-help" className="sr-only">
            Drag to reposition, or use arrow keys. The launcher docks to the
            nearest screen edge.
          </span>
        </>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <button
            type="button"
            className="absolute inset-0 bg-ph-ink/25"
            onClick={() => setOpen(false)}
            aria-label="Close Ask AI"
            tabIndex={-1}
          />
          <aside
            className={`absolute inset-y-0 flex w-full flex-col bg-ph-canvas shadow-2xl sm:max-w-xl ${panelSide === 'left' ? 'left-0 border-r border-ph-border' : 'right-0 border-l border-ph-border'}`}
            data-test="suite-ask-ai-panel"
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <header className="flex items-center gap-2 px-4 py-3">
              <h2 className="min-w-0 flex-1 truncate text-sm font-semibold text-ph-ink">
                {title}
              </h2>
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={() => void handleClear()}
                  disabled={loading}
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-ph-subtle transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                  data-test="ask-ai-clear"
                >
                  <Erase className="h-3.5 w-3.5" />
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ph-subtle transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                aria-label="Close Ask AI"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* ── Message stream ─────────────────────────────────────── */}
            <div className="relative min-h-0 flex-1">
              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                aria-label="Conversation"
                className="suite-scroll-lock h-full space-y-5 overflow-y-auto px-4 py-5"
              >
                {hydrating && messages.length === 0 ? (
                  <div className="flex items-center gap-2 text-sm text-ph-subtle">
                    <Spinner className="h-4 w-4 animate-spin" />
                    Loading your chat…
                  </div>
                ) : null}

                {!hydrating && messages.length === 0 && !error ? (
                  <div className="mx-auto mt-6 flex max-w-sm flex-col items-center px-2 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ph-brand/10 text-ph-brand">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 font-display text-lg font-semibold text-ph-ink">
                      How can I help?
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ph-subtle">
                      {emptyState}
                    </p>
                    {presets.length > 0 ? (
                      <div className="mt-5 flex w-full flex-col gap-2">
                        {presets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => void ask(preset.prompt)}
                            disabled={loading || hydrating}
                            className="group flex w-full items-center gap-2 rounded-xl border border-ph-border bg-ph-surface px-3.5 py-2.5 text-left text-sm text-ph-ink transition-colors hover:border-ph-brand/40 hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                          >
                            <Sparks className="h-4 w-4 shrink-0 text-ph-brand" />
                            <span className="min-w-0 flex-1 truncate">
                              {preset.label}
                            </span>
                            <ArrowUp className="h-3.5 w-3.5 shrink-0 rotate-45 text-ph-mutedtext transition-transform group-hover:translate-x-0.5" />
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {messages.map((message, index) => {
                  const isUser = message.role === 'user';
                  if (isUser) {
                    return (
                      <div
                        key={`user-${index}`}
                        className="flex justify-end"
                        data-test="ask-ai-user"
                      >
                        <div className="max-w-[min(85%,42rem)] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-ph-brand/12 px-3.5 py-2.5 text-sm leading-relaxed text-ph-ink">
                          {message.content}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={`assistant-${index}`}
                      className="flex gap-3"
                      data-test="ask-ai-assistant"
                    >
                      <span
                        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ph-brand/10 text-ph-brand"
                        aria-hidden
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm leading-relaxed text-ph-ink">
                          <Suspense
                            fallback={
                              <p className="whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            }
                          >
                            <SuiteAiBlockNoteMessage
                              markdown={message.content}
                            />
                          </Suspense>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            void copyMessage(index, message.content)
                          }
                          className="mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                        >
                          {copiedId === index ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {copiedId === index ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {loading ? (
                  <div className="flex gap-3" aria-hidden>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ph-brand/10 text-ph-brand">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex items-center gap-1.5 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-ph-mutedtext motion-safe:animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ph-mutedtext motion-safe:animate-bounce [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-ph-mutedtext motion-safe:animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                ) : null}

                {loading ? (
                  <span className="sr-only" aria-live="polite">
                    Assistant is responding…
                  </span>
                ) : null}

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 rounded-xl border border-ph-danger/30 bg-ph-danger/10 px-3.5 py-3 text-sm text-ph-ink"
                  >
                    <WarningTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ph-danger" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-ph-danger">
                        Something went wrong
                      </p>
                      <p className="mt-0.5 text-ph-subtle">{error}</p>
                      <button
                        type="button"
                        onClick={retry}
                        disabled={loading}
                        className="mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-ph-border bg-ph-surface px-2.5 text-xs font-medium text-ph-ink transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {!atBottom ? (
                <button
                  type="button"
                  onClick={() => scrollToBottom('smooth')}
                  className="absolute bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-ph-border bg-ph-surface text-ph-subtle shadow-ph-md transition-colors hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus motion-safe:animate-[suite-ai-fade_150ms_ease-out]"
                  aria-label="Scroll to latest"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {/* ── Composer ───────────────────────────────────────────── */}
            <div className="px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1">
              <div className="flex items-end gap-2 rounded-3xl border border-ph-border bg-ph-surface px-2 py-1 shadow-sm transition-colors focus-within:border-ph-brand/45 focus-within:ring-2 focus-within:ring-ph-focus/35">
                <label htmlFor="suite-ask-ai-input" className="sr-only">
                  Ask a question
                </label>
                <textarea
                  id="suite-ask-ai-input"
                  ref={textareaRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      void ask(prompt);
                    }
                  }}
                  placeholder="Ask anything…"
                  rows={1}
                  data-test="ask-ai-input"
                  className="max-h-44 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2.5 text-sm leading-relaxed text-ph-ink outline-none placeholder:text-ph-mutedtext"
                />
                {loading ? (
                  <button
                    type="button"
                    onClick={stop}
                    data-test="ask-ai-stop"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ph-muted text-ph-ink transition-colors hover:bg-ph-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                    aria-label="Stop generating"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void ask(prompt)}
                    disabled={!prompt.trim()}
                    data-test="ask-ai-send"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ph-brand text-[color:var(--ph-on-accent)] transition-opacity hover:bg-ph-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <ArrowUp className="h-[18px] w-[18px]" />
                  </button>
                )}
              </div>
              <p className="mt-1.5 px-1 text-center text-xs text-ph-mutedtext">
                <kbd className="font-mono">Enter</kbd> to send ·{' '}
                <kbd className="font-mono">Shift</kbd>+
                <kbd className="font-mono">Enter</kbd> for a new line
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
