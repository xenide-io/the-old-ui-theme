"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Xmark as X } from "iconoir-react";

import { cn } from "../lib/cn";

/**
 * Suite mobile navigation drawer. Backdrop fade + panel slide, Escape to
 * close, body scroll-lock and focus hand-off while open. Nav content stays
 * app-side via `children`.
 */
export function SuiteMobileDrawer({
  open,
  onClose,
  children,
  side = "left",
  showCloseButton = false,
  title,
  closeLabel = "Close navigation",
  backdropLabel = "Close navigation",
  dialogLabel = "Navigation",
  durationMs = 200,
  dataTest,
  panelDataTest,
  panelClassName,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Edge the panel slides in from. */
  side?: "left" | "right";
  /** Standard close row (h-14, trailing X button) above the content. */
  showCloseButton?: boolean;
  /** Optional label in the standard close row. */
  title?: ReactNode;
  closeLabel?: string;
  backdropLabel?: string;
  /** Accessible name for the dialog panel. */
  dialogLabel?: string;
  /** Slide/fade duration; also the close-transition unmount delay. */
  durationMs?: number;
  dataTest?: string;
  panelDataTest?: string;
  /** Panel surface overrides (e.g. `bg-ph-canvas`). */
  panelClassName?: string;
}) {
  // `rendered` keeps the drawer mounted through the close transition;
  // `shown` drives the slide/fade end-state.
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(open);
  const panelRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => setRendered(true));
      // Double rAF: paint the off-canvas frame before transitioning in.
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setShown(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    queueMicrotask(() => setShown(false));
    const timeout = window.setTimeout(() => setRendered(false), durationMs);
    return () => window.clearTimeout(timeout);
  }, [open, durationMs]);

  // Escape to close, body scroll-lock, and focus inside while open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const frame = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [open]);

  if (!rendered) return null;

  return (
    <div data-test={dataTest} className="no-print fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        tabIndex={-1}
        className={cn(
          "absolute inset-0 bg-black/25 backdrop-blur-sm motion-safe:transition-opacity motion-safe:ease-spring-subtle",
          shown ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
        onClick={onClose}
        aria-label={backdropLabel}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dialogLabel}
        tabIndex={-1}
        data-test={panelDataTest}
        className={cn(
          "suite-scroll-lock relative flex h-full w-[86%] max-w-72 flex-col overflow-hidden bg-ph-surface shadow-xl outline-none motion-safe:transition-transform motion-safe:ease-spring-fast",
          side === "right" && "ml-auto",
          shown
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          panelClassName,
        )}
        style={{ transitionDuration: `${durationMs}ms` }}
      >
        {showCloseButton ? (
          <div
            className={cn(
              "flex h-14 shrink-0 items-center border-b border-ph-border px-3",
              title ? "justify-between" : "justify-end",
            )}
          >
            {title ? (
              <span className="truncate text-sm font-semibold text-ph-ink">
                {title}
              </span>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="-mr-1.5 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
              aria-label={closeLabel}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
        {children}
      </aside>
    </div>
  );
}
