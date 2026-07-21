import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type KbdVariant = "shortcut" | "key" | "token";
export type KbdPlatform = "text" | "mac" | "windows";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  variant?: KbdVariant;
  keys?: readonly ReactNode[];
  platform?: KbdPlatform;
  separator?: ReactNode;
  children?: ReactNode;
}

const platformLabels: Record<KbdPlatform, Record<string, string>> = {
  text: {
    command: "Command",
    cmd: "Command",
    option: "Option",
    alt: "Alt",
    control: "Control",
    ctrl: "Control",
    shift: "Shift",
  },
  mac: {
    command: "⌘",
    cmd: "⌘",
    option: "⌥",
    alt: "⌥",
    control: "⌃",
    ctrl: "⌃",
    shift: "⇧",
  },
  windows: {
    command: "Win",
    cmd: "Win",
    option: "Alt",
    alt: "Alt",
    control: "Ctrl",
    ctrl: "Ctrl",
    shift: "Shift",
  },
};

const spokenLabels: Record<string, string> = {
  "⌘": "Command",
  "⌥": "Option",
  "⌃": "Control",
  "⇧": "Shift",
  "↵": "Enter",
  "⏎": "Enter",
  "⌫": "Backspace",
  "⎋": "Escape",
};

export function Kbd({
  variant = "shortcut",
  keys,
  platform = "text",
  separator,
  children,
  className,
  "aria-label": ariaLabel,
  ...props
}: KbdProps) {
  if (variant === "token") {
    return (
      <code className={cn("ph-code-token ph-kbd", className)} aria-label={ariaLabel} {...props}>
        {children}
      </code>
    );
  }

  const sourceKeys = keys?.length ? keys : children != null ? [children] : [];
  const displayKeys = sourceKeys.map((key) => formatKey(key, platform));
  const accessibleLabel = ariaLabel ?? getShortcutLabel(displayKeys);

  if (variant === "key") {
    return (
      <kbd className={cn("ph-keycap", className)} aria-label={accessibleLabel} {...props}>
        {displayKeys[0]}
      </kbd>
    );
  }

  return (
    <kbd className={cn("ph-shortcut-group ph-keycap", className)} aria-label={accessibleLabel} {...props}>
      {displayKeys.map((key, index) => (
        <span key={index} className="contents">
          {index > 0 && separator != null ? <span className="ph-shortcut-separator" aria-hidden="true">{separator}</span> : null}
          <span className="ph-shortcut-key" aria-hidden={accessibleLabel ? true : undefined}>{key}</span>
        </span>
      ))}
    </kbd>
  );
}

function formatKey(key: ReactNode, platform: KbdPlatform) {
  if (typeof key !== "string") return key;
  return platformLabels[platform][key.toLowerCase()] ?? key;
}

function getShortcutLabel(keys: ReactNode[]) {
  const labels = keys.map((key) => {
    if (typeof key !== "string" && typeof key !== "number") return null;
    const value = String(key);
    return spokenLabels[value] ?? value;
  });

  return labels.every((label): label is string => label != null)
    ? labels.join(" + ")
    : undefined;
}
