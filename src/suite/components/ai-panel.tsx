'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import { Check, Copy, Xmark as X } from 'iconoir-react';

export interface SuiteAiPreset {
  label: string;
  prompt: string;
}

/**
 * Thin ShellStack AI slide-over shared by suite apps.
 *
 * One-shot completions via the shared `/api/ai/complete` endpoint. Apps
 * inject their API helpers, preset prompts, brand icon and spinner. Renders
 * its own floating launcher so it can be mounted once in the authenticated
 * app shell.
 */
export function SuiteAiPanel({
  presets,
  emptyState,
  fetchStatus,
  complete,
  brandIcon: BrandIcon,
  spinner: Spinner,
}: {
  presets: SuiteAiPreset[];
  /** Idle-state hint copy shown before the first request. */
  emptyState: ReactNode;
  fetchStatus: () => Promise<{ configured: boolean }>;
  complete: (params: { prompt: string }) => Promise<{ text: string }>;
  brandIcon: ComponentType<{ className?: string }>;
  spinner: ComponentType<{ className?: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError('');
    setAnswer('');
    setCopied(false);
    try {
      const status = await fetchStatus();
      if (!status.configured) {
        setError('ShellStack AI is not configured for this workspace yet.');
        return;
      }
      const result = await complete({ prompt: trimmed });
      setAnswer(result.text);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'The AI request failed. Try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAnswer() {
    if (!answer) return;
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable; ignore.
    }
  }

  return (
    <>
      <button
        type="button"
        data-test="ai-panel-launcher"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-ph-border bg-ph-surface px-4 py-2.5 text-sm font-medium text-ph-ink shadow-ph hover:bg-ph-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
        aria-label="Open ShellStack AI"
      >
        <BrandIcon className="h-4 w-4 text-ph-brand" />
        Ask AI
      </button>

      {open && (
        <div className="fixed inset-0 z-40" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpen(false)}
            aria-label="Close AI panel"
          />
          <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-ph-border bg-ph-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-ph-border px-4 py-3">
              <div className="flex items-center gap-2">
                <BrandIcon className="h-4 w-4 text-ph-brand" />
                <span className="text-sm font-semibold text-ph-ink">
                  ShellStack AI
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:bg-ph-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 border-b border-ph-border px-4 py-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.prompt);
                    void ask(preset.prompt);
                  }}
                  disabled={loading}
                  className="rounded-md border border-ph-border px-2 py-1 text-xs text-ph-ink hover:bg-ph-muted disabled:opacity-50"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {error && (
                <p className="bg-ph-danger/10 rounded-lg px-3 py-2 text-sm text-ph-danger">
                  {error}
                </p>
              )}
              {loading && (
                <div className="flex items-center gap-2 text-sm text-ph-mutedtext">
                  <Spinner className="h-4 w-4 animate-spin" />
                  Thinking…
                </div>
              )}
              {answer && !loading && (
                <div className="rounded-lg bg-ph-muted px-3 py-2 text-sm text-ph-ink">
                  <p className="whitespace-pre-wrap">{answer}</p>
                  <button
                    type="button"
                    onClick={() => void copyAnswer()}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-ph-mutedtext hover:text-ph-ink"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
              {!answer && !loading && !error && (
                <p className="mt-8 text-center text-xs text-ph-mutedtext">
                  {emptyState}
                </p>
              )}
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
                  className="flex-1 resize-none rounded-lg border border-ph-border bg-ph-canvas p-2 text-sm text-ph-ink outline-none focus:ring-1 focus:ring-ph-brand"
                />
                <button
                  type="button"
                  onClick={() => void ask(prompt)}
                  disabled={loading || !prompt.trim()}
                  className="self-end rounded-lg bg-ph-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
