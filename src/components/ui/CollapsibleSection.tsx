"use client";

import { useId, useState } from "react";
import { IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

export function CollapsibleSection({ title, children, defaultOpen = true, id }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const generatedId = useId();
  const contentId = `${id ?? generatedId}-content`;

  return (
    <section id={id} className="scroll-mt-20">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="mb-6 flex w-full items-center justify-between rounded-lg border border-ph-border bg-ph-muted px-5 py-4 text-left transition hover:bg-ph-muted/80"
      >
        <span className="text-lg font-bold text-ph-ink">{title}</span>
        <IconChevronDown
          className={cn(
            "h-5 w-5 text-ph-subtle transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <div
        id={contentId}
        aria-hidden={!isOpen}
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
