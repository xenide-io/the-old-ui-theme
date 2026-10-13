"use client";

import { useState } from "react";

import { cn } from "../lib/cn";

export function computeInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  const source = (name || email || "?").trim();
  return source
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

/**
 * Deterministic coloured fallback: derives a stable accent from the user's
 * email or name so avatars without a photo get a per-user colour instead of a
 * flat grey. Uses theme `--ph-*` tokens so it adapts to light and dark themes.
 */
const AVATAR_TOKENS: Array<[string, string]> = [
  ["bg-ph-brand", "text-[var(--ph-on-accent)]"],
  ["bg-ph-violet", "text-[var(--ph-on-violet)]"],
  ["bg-ph-info", "text-[var(--ph-on-info)]"],
  ["bg-ph-success", "text-[var(--ph-on-success)]"],
  ["bg-ph-danger", "text-[var(--ph-on-danger)]"],
];

export function avatarColorClass(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [bg, ink] = AVATAR_TOKENS[Math.abs(hash) % AVATAR_TOKENS.length];
  return `${bg} ${ink}`;
}

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
} as const;

export interface SuitePersonAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
  /** Native hover tooltip, e.g. the person's name. */
  title?: string;
}

/** A person's photo, or their initials on a stable per-person colour. */
export function SuitePersonAvatar({
  name,
  email,
  image,
  size = "sm",
  className,
  title,
}: SuitePersonAvatarProps) {
  const [broken, setBroken] = useState(false);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-ph-border font-semibold",
        SIZES[size],
        !image || broken ? avatarColorClass(email || name || "?") : undefined,
        className,
      )}
      aria-hidden
      title={title}
    >
      {image && !broken ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setBroken(true)}
        />
      ) : (
        computeInitials(name, email)
      )}
    </span>
  );
}

export interface SuitePersonProps extends SuitePersonAvatarProps {
  /** Second line, e.g. the email or role. */
  detail?: React.ReactNode;
}

/** Avatar with the person's name and an optional second line. */
export function SuitePerson({ detail, className, ...person }: SuitePersonProps) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <SuitePersonAvatar {...person} />
      <span className="min-w-0">
        <span className="block truncate font-medium text-ph-ink">
          {person.name || person.email}
        </span>
        {detail ? (
          <span className="block truncate text-xs text-ph-mutedtext">{detail}</span>
        ) : null}
      </span>
    </span>
  );
}
