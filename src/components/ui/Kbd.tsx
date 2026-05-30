import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type KbdVariant = "shortcut" | "key" | "token";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  variant?: KbdVariant;
  keys?: ReactNode[];
  children?: ReactNode;
}

export function Kbd({ variant = "shortcut", keys, children, className, ...props }: KbdProps) {
  if (variant === "token") {
    return (
      <code className={cn("ph-kbd text-ph-ink", className)} {...props}>
        {children}
      </code>
    );
  }

  const content = keys?.length ? keys.join(" ") : normalizeShortcut(children);

  return (
    <kbd className={cn("ph-shortcut", className)} {...props}>
      {content}
    </kbd>
  );
}

function normalizeShortcut(children: ReactNode) {
  if (typeof children !== "string") return children;

  return children
    .replace(/\bCommand\b|\bCmd\b/g, "⌘")
    .replace(/\bOption\b|\bAlt\b/g, "⌥")
    .replace(/\bShift\b/g, "⇧")
    .replace(/\bControl\b|\bCtrl\b/g, "⌃");
}
