"use client";

import { useState, type ReactNode, type HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Collapsible({
  trigger,
  open: controlledOpen,
  onOpenChange,
  children,
  className,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <div className={cn("ph-collapsible", className)} {...props}>
      <button
        type="button"
        onClick={() => setOpen(!isOpen)}
        className="ph-collapsible__trigger"
        aria-expanded={isOpen}
      >
        <svg
          className={cn("ph-collapsible__chevron", isOpen && "ph-collapsible__chevron--open")}
          width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        >
          <path d="M4 5l3 3 3-3" />
        </svg>
        {trigger}
      </button>
      {isOpen && <div className="ph-collapsible__content">{children}</div>}
    </div>
  );
}

Collapsible.displayName = "Collapsible";
