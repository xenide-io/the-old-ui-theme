'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import { Check, Copy, Sparks, Xmark as X } from 'iconoir-react';

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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pendingPromptRef = useRef<string | null>(null);

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

  const Icon = BrandIcon ?? Sparks;

  return (
    <>
      {!hideLauncher ? (
        <button
          type="button"
          data-test="ai-panel-launcher"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-ph-border bg-ph-surface px-4 py-2.5 text-sm font-medium text-ph-ink shadow-ph hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
          aria-label="Open Ask AI"
        >
          <Icon className="h-4 w-4 text-ph-brand" />
          Ask AI
        </button>
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
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ph-border bg-ph-surface shadow-2xl"
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
                    <p className="whitespace-pre-wrap">{message.content}</p>
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
