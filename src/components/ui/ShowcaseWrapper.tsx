"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CodeBlock } from "@/components/ui";
import { IconCodePreview } from "@/components/icons";

interface ShowcaseWrapperProps {
  id?: string;
  title: string;
  description?: string;
  docs?: ReactNode;
  code: string;
  filename?: string;
  children: ReactNode;
  className?: string;
}

export function ShowcaseWrapper({
  id,
  title,
  description,
  docs,
  code,
  filename = "Example.tsx",
  children,
  className,
}: ShowcaseWrapperProps) {
  const [showCode, setShowCode] = useState(false);
  const fallbackId = titleIdMap[title] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <section id={id ?? fallbackId} className={cn("scroll-mt-20", className)}>
      <div className="ph-h2-rule mb-8">
        <div className="flex items-center gap-1.5">
          <h2>{title}</h2>
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
              showCode
                ? "border-ph-brand bg-ph-brand text-[var(--ph-on-accent)] shadow-lg shadow-ph-brand/25"
                : "border-ph-border bg-ph-surface text-ph-subtle hover:border-ph-brand hover:text-ph-brand"
            )}
            title={showCode ? "Hide code" : "Show code"}
            aria-label={showCode ? "Hide code" : "Show code"}
          >
            <IconCodePreview className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <hr />
      </div>

      {description && (
        <p className="mb-6 text-sm text-ph-subtle">{description}</p>
      )}

      {docs && <div className="mb-6">{docs}</div>}

      <div
        className={cn(
          "gap-6",
          showCode ? "lg:grid lg:grid-cols-[1fr,minmax(360px,420px)]" : "block"
        )}
      >
        <div className={cn("min-w-0", showCode && "lg:pr-2")}>{children}</div>

        <div
          className={cn(
            "transition-all duration-300",
            showCode
              ? "block opacity-100"
              : "hidden opacity-0 lg:hidden"
          )}
        >
          <div className="sticky top-20">
            <CodeBlock code={code} filename={filename} />
          </div>
        </div>
      </div>
    </section>
  );
}

const titleIdMap: Record<string, string> = {
  "Icons": "icons",
  "Colour tokens": "colors",
  "Buttons": "buttons",
  "Badges": "badges",
  "Alerts": "alerts",
  "Toasts": "toasts",
  "Cards": "cards",
  "Forms": "forms",
  "Inputs & Forms": "forms",
  "Tables": "tables",
  "Accordion": "accordion",
  "Calendar": "calendar",
  "Hover Card": "hovercard",
  "Modals": "modals",
  "Drawers": "drawers",
  "Navigation chrome": "navigation",
  "Navigation utilities": "utilities",
  "Stepper": "stepper",
  "Command Palette": "command",
  "Filter Chips": "filters",
  "Empty State": "emptystate",
  "Charts (PostHog-style)": "charts",
  "Dashboard shells": "dashboard",
  "Tabs": "tabs",
  "Dropdowns": "dropdowns",
  "Progress & loading": "progress",
  "Tooltip": "tooltip",
  "Avatars": "avatars",
  "Stats & conversational UI": "stats",
  "Timeline": "timeline",
  "Countdown motif": "countdown",
  "Keyboard glyphs": "kbd",
  "Icon swap": "swap",
  "Stacked surfaces": "stack",
  "Diff slider": "diff",
  "Badge hotspots": "indicator",
  "Terminal capture": "code-mockup",
};
