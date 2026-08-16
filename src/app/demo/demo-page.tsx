import type { ReactNode } from "react";

import { ThemeSwitcher } from "@/components/ui";

export function DemoPage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-full">
      <div className="mx-auto flex w-full max-w-7xl flex-col space-y-16 px-6 py-8">
        <header className="flex flex-col gap-5 border-b border-ph-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ph-mutedtext">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-ph-ink">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ph-subtle">
              {description}
            </p>
          </div>
          <div className="hidden shrink-0 lg:block">
            <ThemeSwitcher />
          </div>
        </header>
        <div className="space-y-16">{children}</div>
      </div>
    </div>
  );
}
