"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { Xmark as X } from "iconoir-react";

import { cn } from "../lib/cn";

/**
 * Suite mobile navigation drawer. Backdrop fade + panel slide, Escape to
 * close, body scroll-lock and focus containment while open. Nav content stays
 * app-side via `children`; Radix owns the modal interaction model.
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
  backdropId,
  backdropDataTest,
  closeButtonId,
  closeButtonDataTest,
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
  backdropId?: string;
  backdropDataTest?: string;
  closeButtonId?: string;
  closeButtonDataTest?: string;
  /** Panel surface overrides (e.g. `bg-ph-canvas`). */
  panelClassName?: string;
}) {
  // `rendered` keeps the drawer mounted through the close transition;
  // `shown` drives the slide/fade end-state.
  const [rendered, setRendered] = useState(open);
  const [shown, setShown] = useState(open);
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

  if (!rendered) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Portal forceMount>
        <Dialog.Overlay
          forceMount
          id={backdropId}
          data-test={backdropDataTest ?? dataTest}
          aria-label={backdropLabel}
          className={cn(
            "no-print fixed inset-0 z-50 bg-black/25 backdrop-blur-sm motion-safe:transition-opacity motion-safe:ease-spring-subtle lg:hidden",
            shown ? "opacity-100" : "opacity-0",
          )}
          style={{ transitionDuration: `${durationMs}ms` }}
        />
        <Dialog.Content forceMount asChild>
          <aside
            role="dialog"
            data-test={panelDataTest}
            aria-modal="true"
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex h-dvh max-h-dvh w-[86%] max-w-72 flex-col overflow-hidden bg-ph-surface shadow-xl outline-none motion-safe:transition-transform motion-safe:ease-spring-fast lg:hidden",
              side === "right" && "left-auto right-0",
              shown
                ? "translate-x-0"
                : side === "right"
                  ? "translate-x-full"
                  : "-translate-x-full",
              panelClassName,
            )}
            style={{ transitionDuration: `${durationMs}ms` }}
          >
            <Dialog.Title className="sr-only">{dialogLabel}</Dialog.Title>
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
                <Dialog.Close asChild>
                  <button
                    type="button"
                    id={closeButtonId}
                    data-test={closeButtonDataTest}
                    className="-mr-1.5 inline-flex h-11 w-11 items-center justify-center rounded-lg text-ph-mutedtext transition-colors hover:bg-ph-muted hover:text-ph-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ph-brand"
                    aria-label={closeLabel}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </Dialog.Close>
              </div>
            ) : null}
            <div
              data-test="suite-mobile-drawer-body"
              className="suite-scroll-lock flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              {children}
            </div>
          </aside>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
