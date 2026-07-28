"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/cn";

export interface AppLayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
  sidebarWidth?: number;
  className?: string;
}

export function AppLayout({ sidebar, children, sidebarWidth = 240, className }: AppLayoutProps) {
  return (
    <div
      className={cn("ph-app-layout grid min-h-screen", className)}
      style={{ gridTemplateColumns: `${sidebarWidth}px minmax(0, 1fr)` }}
    >
      <aside className="ph-app-layout__sidebar border-r border-ph-border bg-ph-surface overflow-y-auto">
        {sidebar}
      </aside>
      <main className="ph-app-layout__content min-w-0 overflow-y-auto bg-ph-canvas">
        {children}
      </main>
    </div>
  );
}
