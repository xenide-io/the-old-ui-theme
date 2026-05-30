"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

export function CollapsibleSection({ title, children, defaultOpen = true, id }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section id={id} className="scroll-mt-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="mb-6 flex w-full items-center justify-between rounded-lg border border-ph-border bg-ph-muted px-5 py-4 text-left transition hover:bg-ph-muted/80"
      >
        <span className="text-lg font-bold text-ph-ink">{title}</span>
        <svg
          className={cn(
            "h-5 w-5 text-ph-subtle transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[50000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </section>
  );
}
