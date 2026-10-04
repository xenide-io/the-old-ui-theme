"use client";

import { useId, useState } from "react";
import { IconChevronDown } from "@/components/icons";
import { cn } from "@/lib/cn";

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  id?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  id,
}: CollapsibleSectionProps) {
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
        className="ph-collapsible-trigger mb-6"
      >
        <span className="text-lg font-bold text-ph-ink">{title}</span>
        <IconChevronDown
          className={cn(
            "h-5 w-5 text-ph-subtle transition-transform duration-200",
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        id={contentId}
        aria-hidden={!isOpen}
        ref={(node) => {
          if (node) node.toggleAttribute("inert", !isOpen);
        }}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </section>
  );
}
