"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  EditPencil,
  Erase,
  Sparks,
  Square,
  WarningTriangle,
} from "iconoir-react";

import { Tooltip } from "../../components/ui/Tooltip";
import {
  classifySuiteHref,
  type SuiteAppSlug,
} from "../lib/apps";

const SuiteAiMarkdownMessage = lazy(() => import("./ai-message-markdown"));

export const SUITE_OPEN_ASK_AI_EVENT = "shellstack:open-ask-ai";
export const SUITE_ASK_AI_OPEN_KEY = "shellstack:shelly-open";
export const SUITE_ASK_AI_OPEN_QUERY = "shelly";
export const SUITE_MUTATED_EVENT = "shellstack:suite-mutated";
export const TURTLETIME_TIMER_MUTATED_EVENT = "tt-timer-mutated";

export type SuiteAskAiOpenDetail = {
  prompt?: string;
};

export function persistSuiteAskAiOpen(open: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (open) sessionStorage.setItem(SUITE_ASK_AI_OPEN_KEY, "1");
    else sessionStorage.removeItem(SUITE_ASK_AI_OPEN_KEY);
  } catch {
    // private mode / blocked storage
  }
}

export function readSuiteAskAiOpen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SUITE_ASK_AI_OPEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** Stamp a destination path so the other app opens Shelly after SSO. */
export function pathWithSuiteAskAiOpen(path: string): string {
  const url = new URL((path || "/").trim() || "/", "http://local.invalid");
  url.searchParams.set(SUITE_ASK_AI_OPEN_QUERY, "1");
  return `${url.pathname}${url.search}${url.hash}`;
}

/** Open Shelly only after a `?shelly=1` handoff — not a leftover session flag. */
export function consumeSuiteAskAiOpenFromLocation(): boolean {
  if (typeof window === "undefined") return false;
  const url = new URL(window.location.href);
  if (url.searchParams.get(SUITE_ASK_AI_OPEN_QUERY) !== "1") return false;
  persistSuiteAskAiOpen(true);
  url.searchParams.delete(SUITE_ASK_AI_OPEN_QUERY);
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
  return true;
}

export type SuiteAiActionStatus =
  | "proposed"
  | "applied"
  | "cancelled"
  | "failed";

export interface SuiteAiAction {
  id: string;
  kind: string;
  status: SuiteAiActionStatus;
  summary: string;
  href?: string;
  error?: string;
  payload?: Record<string, unknown>;
}

let pendingAskAiPrompt: string | null = null;

/** Open the suite Ask AI panel from anywhere (Today card, command palette, …). */
export function openSuiteAskAi(detail?: SuiteAskAiOpenDetail): void {
  pendingAskAiPrompt = detail?.prompt?.trim() || null;
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SuiteAskAiOpenDetail>(SUITE_OPEN_ASK_AI_EVENT, {
      detail: detail ?? {},
    }),
  );
}

/** Consume a prompt queued before the panel mounted. */
export function consumePendingAskAiPrompt(): string | null {
  const next = pendingAskAiPrompt;
  pendingAskAiPrompt = null;
  return next;
}

export interface SuiteAiPreset {
  label: string;
  prompt: string;
}

export interface SuiteAiChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
  actions?: SuiteAiAction[];
}

function notifySuiteMutated(actions?: SuiteAiAction[]): void {
  if (typeof window === "undefined" || !actions?.length) return;
  const kinds = actions.map((action) => action.kind);
  if (
    kinds.some(
      (kind) =>
        kind.includes("timer") ||
        kind.includes("time") ||
        kind.includes("hours"),
    )
  ) {
    window.dispatchEvent(new Event(TURTLETIME_TIMER_MUTATED_EVENT));
  }
  window.dispatchEvent(
    new CustomEvent(SUITE_MUTATED_EVENT, { detail: { kinds } }),
  );
}

/**
 * Suite-wide Ask AI chat — Notion-style continuous thread.
 * Lives in the sidebar (or any parent that mounts it). Not Kraken Deep Research.
 */
export function SuiteAiPanel({
  presets = [],
  emptyState = "Ask when you are ready — overdue work, a running timer, or anything else.",
  title = "Shelly AI",
  fetchChat,
  sendMessage,
  editMessage,
  cancelMessage,
  clearChat,
  brandIcon: BrandIcon,
  spinner: Spinner,
  open: openProp,
  onOpenChange,
  suiteAppBases,
  onSwitchApp,
  onSameAppNavigate,
  resolveAction,
  isWaitingForReply = false,
}: {
  presets?: SuiteAiPreset[];
  emptyState?: ReactNode;
  title?: string;
  fetchChat: () => Promise<{
    messages: SuiteAiChatMessage[];
    configured: boolean;
    jobs?: Array<{ status?: string; error?: string }>;
  }>;
  sendMessage: (params: {
    prompt: string;
    signal?: AbortSignal;
  }) => Promise<{ messages: SuiteAiChatMessage[]; reply: string }>;
  /** Rewrite the thread from a user message. Falls back to sendMessage. */
  editMessage?: (params: {
    index: number;
    prompt: string;
    signal?: AbortSignal;
  }) => Promise<{ messages: SuiteAiChatMessage[]; reply: string }>;
  /** Stop the in-flight reply on the server. */
  cancelMessage?: () => Promise<{ messages?: SuiteAiChatMessage[] }>;
  clearChat: () => Promise<void>;
  brandIcon?: ComponentType<{ className?: string }>;
  spinner: ComponentType<{ className?: string }>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Origins for each ShellStack app — used to intercept workspace links. */
  suiteAppBases?: Partial<Record<SuiteAppSlug, string>>;
  /** Cross-app SSO. Same-app links just navigate to `path`. */
  onSwitchApp?: (app: SuiteAppSlug, path: string) => void;
  /** Client-side same-app route change — keeps Shelly mounted. */
  onSameAppNavigate?: (path: string) => void;
  resolveAction?: (
    id: string,
    decision: "confirm" | "cancel",
  ) => Promise<{ messages: SuiteAiChatMessage[] }>;
  /** A durable background job is still preparing the assistant reply. */
  isWaitingForReply?: boolean;
}) {
  const inputId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [resolvingId, setResolvingId] = useState("");
  const open = openProp ?? uncontrolledOpen;
  const setOpen = useCallback(
    (next: boolean) => {
      persistSuiteAskAiOpen(next);
      if (openProp === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<SuiteAiChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(false);
  const [error, setError] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const pendingPromptRef = useRef<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const waiting = loading || isWaitingForReply;

  useEffect(() => {
    function onOpen(event: Event) {
      const detail = (event as CustomEvent<SuiteAskAiOpenDetail>).detail;
      const queued = detail?.prompt?.trim() || consumePendingAskAiPrompt();
      setOpen(true);
      if (queued) {
        pendingPromptRef.current = queued;
        setPrompt(queued);
      }
    }
    window.addEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
    return () => window.removeEventListener(SUITE_OPEN_ASK_AI_EVENT, onOpen);
  }, [setOpen]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setAtBottom(true);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distance < 64);
  }, []);

  const hydrate = useCallback(async () => {
    setHydrating(true);
    setError("");
    try {
      const data = await fetchChat();
      setMessages(data.messages ?? []);
      if (!data.configured) {
        setError("ShellStack AI is not configured for this workspace yet.");
      } else {
        const latestJob = data.jobs?.[0];
        if (
          latestJob?.status === "failed" &&
          latestJob.error &&
          latestJob.error !== "Chat cleared." &&
          data.messages.at(-1)?.role !== "assistant"
        ) {
          setError(latestJob.error);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load Shelly AI.",
      );
    } finally {
      setHydrating(false);
    }
  }, [fetchChat]);

  useEffect(() => {
    if (!open) return;
    const queued = pendingPromptRef.current ?? consumePendingAskAiPrompt();
    pendingPromptRef.current = queued;
    void hydrate().then(() => {
      const pending = pendingPromptRef.current;
      pendingPromptRef.current = null;
      if (pending) setPrompt(pending);
    });
  }, [open, hydrate]);

  useEffect(() => {
    if (open && atBottom) scrollToBottom();
  }, [messages, waiting, open, atBottom, scrollToBottom]);

  useEffect(() => {
    if (open && !hydrating) textareaRef.current?.focus();
  }, [open, hydrating]);

  // Warm the lazily-imported Markdown renderer as soon as the panel opens, so a
  // reply never flashes a placeholder while its chunk is still downloading.
  useEffect(() => {
    if (!open) return;
    void import("./ai-message-markdown").catch(() => {});
  }, [open]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 176)}px`;
  }, [prompt, open]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || waiting) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    setPrompt("");
    setAtBottom(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    try {
      const result = await sendMessage({
        prompt: trimmed,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      const nextMessages = result.messages ?? [];
      setMessages(nextMessages);
      notifySuiteMutated(
        nextMessages.flatMap((message) => message.actions ?? []),
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      setMessages((prev) =>
        prev[prev.length - 1]?.role === "user" &&
        prev[prev.length - 1]?.content === trimmed
          ? prev.slice(0, -1)
          : prev,
      );
      setPrompt(trimmed);
      setError(
        err instanceof Error
          ? err.message
          : "The AI request failed. Try again.",
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
    if (!cancelMessage) return;
    void cancelMessage()
      .then((result) => {
        if (result?.messages) setMessages(result.messages);
      })
      .catch(() => {
        // Best-effort server cancel; the local abort already stopped the UI.
      });
  }

  function retry() {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content;
    setError("");
    if (lastUser) void ask(lastUser);
    else void hydrate();
  }

  async function saveEdit(index: number) {
    const trimmed = editDraft.trim();
    if (!trimmed || waiting) return;
    setEditingIndex(null);
    setEditDraft("");
    setError("");
    setAtBottom(true);
    setMessages((prev) => prev.slice(0, index));
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const result = editMessage
        ? await editMessage({
            index,
            prompt: trimmed,
            signal: controller.signal,
          })
        : await sendMessage({ prompt: trimmed, signal: controller.signal });
      if (controller.signal.aborted) return;
      const nextMessages = result.messages ?? [];
      setMessages(nextMessages);
      notifySuiteMutated(
        nextMessages.flatMap((message) => message.actions ?? []),
      );
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(
        err instanceof Error
          ? err.message
          : "The AI request failed. Try again.",
      );
      void hydrate();
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }

  async function handleCopy(index: number, content: string) {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      window.setTimeout(
        () => setCopiedIndex((current) => (current === index ? null : current)),
        1500,
      );
    } catch {
      // clipboard unavailable
    }
  }

  async function handleClear() {
    if (loading) return;
    try {
      await clearChat();
      setMessages([]);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not clear this chat.",
      );
    }
  }

  async function handleResolve(
    actionId: string,
    decision: "confirm" | "cancel",
  ) {
    if (!resolveAction || resolvingId) return;
    setResolvingId(actionId);
    setError("");
    try {
      const result = await resolveAction(actionId, decision);
      const nextMessages = result.messages ?? [];
      setMessages(nextMessages);
      notifySuiteMutated(
        nextMessages.flatMap((message) => message.actions ?? []),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not apply that action.",
      );
    } finally {
      setResolvingId("");
    }
  }

  function onConversationClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const anchor = (event.target as HTMLElement | null)?.closest("a");
    if (!anchor || !suiteAppBases) return;
    const href = anchor.href;
    if (!href) return;
    const match = classifySuiteHref(
      href,
      suiteAppBases,
      window.location.origin,
    );
    if (!match) return;
    event.preventDefault();
    persistSuiteAskAiOpen(true);
    if (match.sameApp) {
      if (onSameAppNavigate) onSameAppNavigate(match.path);
      else window.location.assign(pathWithSuiteAskAiOpen(match.path));
      return;
    }
    const openPath = pathWithSuiteAskAiOpen(match.path);
    if (onSwitchApp) onSwitchApp(match.slug, openPath);
    else window.location.assign(new URL(openPath, href).toString());
  }

  if (!open) return null;

  // Only the newest reply gets the staggered word reveal; animating the whole
  // transcript would replay whenever the panel remounts mid-conversation.
  const lastAssistantIndex = messages.reduce(
    (found, message, index) => (message.role === "assistant" ? index : found),
    -1,
  );

  const Icon = BrandIcon ?? Sparks;

  return (
    <aside
      className="flex h-full min-h-0 flex-col bg-ph-canvas"
      data-test="suite-ask-ai-panel"
      aria-label={title}
    >
      <header className="flex items-center gap-2 px-2 pb-2">
        <h2 className="sr-only">{title}</h2>
        {messages.length > 0 ? (
          <button
            type="button"
            onClick={() => void handleClear()}
            disabled={waiting}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium text-ph-subtle transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
            data-test="ask-ai-clear"
          >
            <Erase className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </header>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          onClick={onConversationClick}
          role="log"
          aria-live="polite"
          aria-label="Conversation"
          className="suite-scroll-lock h-full space-y-5 overflow-y-auto px-2 py-3"
        >
          {hydrating && messages.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-ph-subtle">
              <Spinner className="h-4 w-4 animate-spin" />
              Loading your chat…
            </div>
          ) : null}

          {!hydrating && messages.length === 0 && !error ? (
            <div className="mx-auto mt-4 flex max-w-sm flex-col items-center px-1 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ph-brand/10 text-ph-brand">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-base font-semibold text-ph-ink">
                How can I help?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ph-subtle">
                {emptyState}
              </p>
              {presets.length > 0 ? (
                <div className="mt-4 flex w-full flex-col gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => void ask(preset.prompt)}
                      disabled={waiting || hydrating}
                      className="group flex w-full items-center gap-2 rounded-xl border border-ph-border bg-ph-surface px-3 py-2 text-left text-sm text-ph-ink transition-colors hover:border-ph-brand/40 hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
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
            const isUser = message.role === "user";
            if (isUser) {
              if (editingIndex === index) {
                return (
                  <div
                    key={`user-${index}`}
                    className="suite-msg-in suite-msg-in--user flex justify-end"
                    data-test="ask-ai-user"
                  >
                    <div className="w-full max-w-[85%] space-y-2">
                      <textarea
                        autoFocus
                        value={editDraft}
                        onChange={(event) => setEditDraft(event.target.value)}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.shiftKey &&
                            !event.nativeEvent.isComposing
                          ) {
                            event.preventDefault();
                            void saveEdit(index);
                          }
                          if (event.key === "Escape") {
                            setEditingIndex(null);
                            setEditDraft("");
                          }
                        }}
                        rows={2}
                        data-test="ask-ai-edit-input"
                        className="w-full resize-none rounded-2xl rounded-br-md border border-ph-border bg-ph-surface px-3 py-2 text-sm leading-relaxed text-ph-ink outline-none focus-visible:border-ph-brand/45 focus-visible:ring-2 focus-visible:ring-ph-focus/35"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingIndex(null);
                            setEditDraft("");
                          }}
                          className="inline-flex min-h-8 items-center rounded-lg border border-ph-border bg-ph-surface px-2.5 text-xs font-medium text-ph-ink transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          data-test="ask-ai-edit-save"
                          disabled={!editDraft.trim() || waiting}
                          onClick={() => void saveEdit(index)}
                          className="inline-flex min-h-8 items-center rounded-lg bg-ph-brand px-2.5 text-xs font-medium text-[color:var(--ph-on-accent)] transition-opacity hover:bg-ph-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={`user-${index}`}
                  className="suite-msg-in suite-msg-in--user flex justify-end"
                  data-test="ask-ai-user"
                >
                  <div className="group flex items-end gap-1.5">
                    {!waiting ? (
                      <div className="mb-0.5 flex items-center gap-0.5 opacity-100 transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => void handleCopy(index, message.content)}
                          aria-label={
                            copiedIndex === index ? "Copied" : "Copy message"
                          }
                          data-test="ask-ai-copy"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                        >
                          {copiedIndex === index ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditDraft(message.content);
                            setEditingIndex(index);
                          }}
                          aria-label="Edit message"
                          data-test="ask-ai-edit"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                        >
                          <EditPencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                    <div className="w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-ph-brand px-3 py-2 text-sm leading-relaxed text-[var(--ph-on-accent)] [overflow-wrap:anywhere]">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={`assistant-${index}`}
                className="flex items-end gap-2"
                data-test="ask-ai-assistant"
              >
                <span
                  className="suite-msg-avatar mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ph-brand/10 text-ph-brand"
                  aria-hidden
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="suite-msg-bubble min-w-0 max-w-[85%] space-y-2">
                  <div className="rounded-2xl rounded-bl-md bg-ph-muted px-3 py-2 text-sm leading-relaxed text-ph-ink">
                    <Suspense
                      fallback={
                        // The chunk is pre-warmed above, so this only shows on a
                        // cold cache. Keep it invisible — a skeleton here reads
                        // as if it were part of the answer.
                        <span className="sr-only" role="status">
                          Rendering response…
                        </span>
                      }
                    >
                      <SuiteAiMarkdownMessage
                        markdown={message.content}
                        animate={index === lastAssistantIndex}
                      />
                    </Suspense>
                  </div>
                  {(message.actions ?? []).map((action) => (
                    <div
                      key={action.id}
                      data-test="ask-ai-action"
                      data-status={action.status}
                      className="rounded-xl border border-ph-border bg-ph-surface px-3 py-2 text-sm text-ph-ink"
                    >
                      <p className="font-medium">{action.summary}</p>
                      {action.status === "proposed" ? (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            data-test="ask-ai-action-confirm"
                            disabled={Boolean(resolvingId) || !resolveAction}
                            onClick={() => void handleResolve(action.id, "confirm")}
                            className="inline-flex min-h-8 items-center rounded-lg bg-ph-brand px-2.5 text-xs font-medium text-[color:var(--ph-on-accent)] transition-opacity hover:bg-ph-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                          >
                            {resolvingId === action.id ? "Working…" : "Confirm"}
                          </button>
                          <button
                            type="button"
                            data-test="ask-ai-action-cancel"
                            disabled={Boolean(resolvingId) || !resolveAction}
                            onClick={() => void handleResolve(action.id, "cancel")}
                            className="inline-flex min-h-8 items-center rounded-lg border border-ph-border bg-ph-surface px-2.5 text-xs font-medium text-ph-ink transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : null}
                      {action.status === "applied" ? (
                        <p className="mt-1 text-xs text-ph-subtle">
                          Done
                          {action.href ? (
                            <>
                              {" · "}
                              <a
                                href={action.href}
                                className="text-ph-brand underline-offset-2 hover:underline"
                              >
                                Open
                              </a>
                            </>
                          ) : null}
                        </p>
                      ) : null}
                      {action.status === "cancelled" ? (
                        <p className="mt-1 text-xs text-ph-subtle">Cancelled</p>
                      ) : null}
                      {action.status === "failed" ? (
                        <p className="mt-1 text-xs text-ph-danger">
                          {action.error || "Could not apply that."}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {waiting ? (
            <div className="flex items-end gap-2" aria-hidden>
              <span className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ph-brand/10 text-ph-brand">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-ph-muted px-3 py-2.5">
                <span className="suite-think-dot h-1.5 w-1.5 rounded-full bg-ph-mutedtext" />
                <span className="suite-think-dot suite-think-dot--2 h-1.5 w-1.5 rounded-full bg-ph-mutedtext" />
                <span className="suite-think-dot suite-think-dot--3 h-1.5 w-1.5 rounded-full bg-ph-mutedtext" />
              </div>
            </div>
          ) : null}

          {waiting ? (
            <span className="sr-only" aria-live="polite">
              Assistant is responding…
            </span>
          ) : null}

          {error ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-ph-danger/30 bg-ph-danger/10 px-3 py-2.5 text-sm text-ph-ink"
            >
              <WarningTriangle className="mt-0.5 h-4 w-4 shrink-0 text-ph-danger" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ph-danger">Something went wrong</p>
                <p className="mt-0.5 text-ph-subtle">{error}</p>
                <button
                  type="button"
                  onClick={retry}
                  disabled={waiting}
                  className="mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-ph-border bg-ph-surface px-2.5 text-xs font-medium text-ph-ink transition-colors hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {!atBottom ? (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
            <Tooltip content="Scroll to latest">
              <button
                type="button"
                onClick={() => scrollToBottom("smooth")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ph-border bg-ph-surface text-ph-subtle shadow-ph-md transition-colors hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                aria-label="Scroll to latest"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        ) : null}
      </div>

      <div className="px-2 pt-2 pb-[max(2rem,calc(env(safe-area-inset-bottom)+1rem))]">
        <div className="flex items-end gap-1.5 rounded-2xl border border-ph-border bg-ph-surface px-1.5 py-1 transition-colors focus-within:border-ph-brand/45 focus-within:ring-2 focus-within:ring-ph-focus/35">
          <label htmlFor={inputId} className="sr-only">
            Ask a question
          </label>
          <textarea
            id={inputId}
            ref={textareaRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void ask(prompt);
              }
            }}
            placeholder="Ask anything…"
            rows={1}
            data-test="ask-ai-input"
            className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-1.5 py-2 text-sm leading-relaxed text-ph-ink outline-none placeholder:text-ph-mutedtext"
          />
          {waiting ? (
            <Tooltip content="Stop generating">
              <button
                type="button"
                onClick={stop}
                data-test="ask-ai-stop"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ph-muted text-ph-ink transition-colors hover:bg-ph-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus"
                aria-label="Stop generating"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Send message">
              <button
                type="button"
                onClick={() => void ask(prompt)}
                disabled={!prompt.trim()}
                data-test="ask-ai-send"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ph-brand text-[color:var(--ph-on-accent)] transition-opacity hover:bg-ph-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-focus disabled:opacity-40"
                aria-label="Send message"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </aside>
  );
}
