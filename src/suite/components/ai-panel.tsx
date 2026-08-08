'use client';

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { Check, Copy, Sparks, Xmark as X } from 'iconoir-react';

const SuiteAiBlockNoteMessage = lazy(
  () => import('./ai-message-blocknote'),
);

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

type LauncherSide = 'left' | 'right';
type LauncherPosition = { x: number; y: number };

const LAUNCHER_EDGE_GAP = 12;
const LAUNCHER_STORAGE_KEY = 'suite-ask-ai-launcher-position';

export function resolveSuiteAiLauncherPosition(
  side: LauncherSide,
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
  return {
    x: side === 'left' ? LAUNCHER_EDGE_GAP : maxX,
    y: Math.min(Math.max(desiredY, LAUNCHER_EDGE_GAP), maxY),
  };
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
  const [launcherSide, setLauncherSide] = useState<LauncherSide>('right');
  const [launcherPosition, setLauncherPosition] =
    useState<LauncherPosition | null>(null);
  const [draggingLauncher, setDraggingLauncher] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const launcherSideRef = useRef<LauncherSide>('right');
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

    let side: LauncherSide = 'right';
    let desiredY = window.innerHeight - launcher.offsetHeight - 20;
    try {
      const stored = JSON.parse(
        localStorage.getItem(LAUNCHER_STORAGE_KEY) || 'null',
      ) as {
        side?: LauncherSide;
        y?: number;
      } | null;
      if (stored?.side === 'left' || stored?.side === 'right')
        side = stored.side;
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
        launcherPositionRef.current?.y ?? desiredY,
        window.innerWidth,
        window.innerHeight,
        element.offsetWidth,
        element.offsetHeight,
      );
      launcherPositionRef.current = next;
      setLauncherPosition(next);
    };

    placeLauncher();
    window.addEventListener('resize', placeLauncher);
    return () => window.removeEventListener('resize', placeLauncher);
  }, []);

  const scrollToBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
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
    if (open) scrollToBottom();
  }, [messages, loading, open, scrollToBottom]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError('');
    setPrompt('');
    // Optimistic user bubble — replaced by server messages on success.
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    try {
      const result = await sendMessage({ prompt: trimmed });
      setMessages(result.messages ?? []);
    } catch (err) {
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
      setLoading(false);
    }
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
    side: LauncherSide,
    position: LauncherPosition,
  ) {
    try {
      localStorage.setItem(
        LAUNCHER_STORAGE_KEY,
        JSON.stringify({ side, y: position.y }),
      );
    } catch {
      // Storage may be unavailable; dragging still works for this session.
    }
  }

  function dockLauncher(side: LauncherSide, desiredY: number) {
    const launcher = launcherRef.current;
    if (!launcher) return;
    const next = resolveSuiteAiLauncherPosition(
      side,
      desiredY,
      window.innerWidth,
      window.innerHeight,
      launcher.offsetWidth,
      launcher.offsetHeight,
    );
    launcherSideRef.current = side;
    launcherPositionRef.current = next;
    setLauncherSide(side);
    setLauncherPosition(next);
    saveLauncherPosition(side, next);
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
    const side: LauncherSide =
      currentX + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
    dockLauncher(side, launcherPositionRef.current?.y ?? rect.top);
  }

  function moveLauncherWithKeyboard(
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) {
    if (
      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    )
      return;
    event.preventDefault();
    const currentY =
      launcherPositionRef.current?.y ??
      event.currentTarget.getBoundingClientRect().top;
    if (event.key === 'ArrowLeft') dockLauncher('left', currentY);
    else if (event.key === 'ArrowRight') dockLauncher('right', currentY);
    else
      dockLauncher(
        launcherSideRef.current,
        currentY + (event.key === 'ArrowUp' ? -24 : 24),
      );
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
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpen(false)}
            aria-label="Close Ask AI"
          />
          <aside
            className={`absolute inset-y-0 flex w-full max-w-md flex-col bg-ph-surface shadow-2xl ${launcherSide === 'left' ? 'left-0 border-r border-ph-border' : 'right-0 border-l border-ph-border'}`}
            data-test="suite-ask-ai-panel"
          >
            <div className="flex items-center justify-between border-b border-ph-border px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-ph-brand" />
                  <span className="text-sm font-semibold text-ph-ink">
                    {title}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-ph-mutedtext">
                  Shared across your suite · same chat in every app
                </p>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => void handleClear()}
                    disabled={loading}
                    className="rounded-md px-2 py-1 text-xs text-ph-mutedtext hover:bg-ph-muted hover:text-ph-ink disabled:opacity-50"
                    data-test="ask-ai-clear"
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded p-1 hover:bg-ph-muted"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {presets.length > 0 && messages.length === 0 ? (
              <div className="flex flex-wrap gap-1.5 border-b border-ph-border px-4 py-2">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => void ask(preset.prompt)}
                    disabled={loading || hydrating}
                    className="rounded-full border border-ph-border px-2.5 py-1 text-xs text-ph-ink hover:bg-ph-muted disabled:opacity-50"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div
              ref={scrollerRef}
              className="flex-1 space-y-3 overflow-y-auto p-4"
            >
              {error ? (
                <p className="bg-ph-danger/10 rounded-lg px-3 py-2 text-sm text-ph-danger">
                  {error}
                </p>
              ) : null}

              {hydrating && messages.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-ph-mutedtext">
                  <Spinner className="h-4 w-4 animate-spin" />
                  Loading chat…
                </div>
              ) : null}

              {!hydrating && messages.length === 0 && !error ? (
                <div className="mt-10 px-2 text-center">
                  <p className="font-display text-base font-semibold text-ph-ink">
                    How can I help?
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ph-subtle">
                    {emptyState}
                  </p>
                </div>
              ) : null}

              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={`${message.role}-${index}-${message.content.slice(0, 24)}`}
                    className={
                      isUser
                        ? 'ml-8 rounded-2xl bg-ph-brand/10 px-3.5 py-2.5 text-sm text-ph-ink'
                        : 'mr-4 rounded-2xl bg-ph-muted px-3.5 py-2.5 text-sm text-ph-ink'
                    }
                    data-test={isUser ? 'ask-ai-user' : 'ask-ai-assistant'}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <Suspense
                        fallback={
                          <p className="whitespace-pre-wrap">
                            {message.content}
                          </p>
                        }
                      >
                        <SuiteAiBlockNoteMessage markdown={message.content} />
                      </Suspense>
                    )}
                    {!isUser ? (
                      <button
                        type="button"
                        onClick={() => void copyMessage(index, message.content)}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-ph-mutedtext hover:text-ph-ink"
                      >
                        {copiedId === index ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        {copiedId === index ? 'Copied' : 'Copy'}
                      </button>
                    ) : null}
                  </div>
                );
              })}

              {loading ? (
                <div className="flex items-center gap-2 text-sm text-ph-mutedtext">
                  <Spinner className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              ) : null}
            </div>

            <div className="border-t border-ph-border p-3">
              <div className="flex gap-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void ask(prompt);
                    }
                  }}
                  placeholder="Ask anything…"
                  rows={2}
                  disabled={loading}
                  data-test="ask-ai-input"
                  className="flex-1 resize-none rounded-xl border border-ph-border bg-ph-canvas p-2.5 text-sm text-ph-ink outline-none focus:ring-1 focus:ring-ph-brand"
                />
                <button
                  type="button"
                  onClick={() => void ask(prompt)}
                  disabled={loading || !prompt.trim()}
                  data-test="ask-ai-send"
                  className="self-end rounded-xl bg-ph-brand px-3.5 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
