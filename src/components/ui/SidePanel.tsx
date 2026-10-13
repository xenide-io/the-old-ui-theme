"use client";

import { useEffect, type ReactNode } from "react";
import { IconClose } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/cn";

export interface SidePanelProps {
  title: ReactNode;
  icon?: ReactNode;
  /** Accessible name for the panel, e.g. "Revision history". */
  label: string;
  onClose: () => void;
  children: ReactNode;
  /** Tailwind max-width class; defaults to a comfortable reading column. */
  widthClassName?: string;
  className?: string;
  bodyClassName?: string;
}

/**
 * Non-modal drawer docked to the right edge. The ✕ sits top-right (Windows /
 * Fluent: close opposite the leading edge of the content) with a tooltip, and
 * Escape closes it like every native inspector.
 */
export function SidePanel({
  title,
  icon,
  label,
  onClose,
  children,
  widthClassName = "max-w-sm",
  className,
  bodyClassName,
}: SidePanelProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <aside
      aria-label={label}
      className={cn(
        "no-print fixed inset-y-0 right-0 z-40 flex w-full flex-col border-l border-ph-border bg-ph-surface shadow-xl",
        widthClassName,
        className,
      )}
    >
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-ph-border px-4">
        <h2 className="flex min-w-0 items-center gap-2 truncate font-semibold text-ph-ink">
          {icon}
          {title}
        </h2>
        <Tooltip content="Close" side="bottom">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            shape="square"
            aria-label={`Close ${label.toLowerCase()}`}
            onClick={onClose}
          >
            <IconClose className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Tooltip>
      </header>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </aside>
  );
}
