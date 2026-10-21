"use client";

import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";

export type CrewSpecies =
  | "garden"
  | "turbo"
  | "nacre"
  | "helix"
  | "nomad"
  | "titan"
  | "ramshorn"
  | "nerite"
  | "rabbit"
  | "limpet";

// Original curved silhouettes; Fluent's snail is a proportion reference, not an asset.
// Identity is stable: variation comes from a snail's ID, never Math.random().
const SHELLS: Record<CrewSpecies, { shape: string; detail: string }> = {
  garden: {
    shape:
      "M25 41C19 33 22 22 30 18C39 13 50 18 53 27C57 38 49 47 39 47C33 47 28 45 25 41Z",
    detail:
      "M42 41C31 44 25 33 30 26C35 19 46 23 47 31C48 37 41 41 36 37C32 33 36 28 40 30C43 31 42 34 40 34",
  },
  turbo: {
    shape:
      "M26 42C21 37 24 29 29 26C33 23 34 16 39 17C45 18 44 24 48 27C54 32 53 41 47 45C40 49 31 48 26 42Z",
    detail:
      "M28 34C34 29 44 29 50 34M30 40C36 36 44 36 49 39M34 25C38 23 42 24 45 26",
  },
  nacre: {
    shape:
      "M25 42C19 34 24 22 32 19C42 14 53 22 53 32C53 43 44 50 34 47C30 46 27 45 25 42Z",
    detail: "M31 39C25 31 34 21 42 26C50 30 45 42 37 40C33 39 32 35 35 32",
  },
  helix: {
    shape:
      "M26 42C21 36 26 30 29 26C33 22 33 13 38 13C43 13 43 23 47 27C53 32 54 40 48 45C42 49 31 48 26 42Z",
    detail:
      "M28 36C34 32 44 32 50 36M31 29C36 26 42 26 47 29M35 22C38 21 40 21 43 23",
  },
  nomad: {
    shape:
      "M25 43C20 37 24 28 32 26C43 22 53 28 54 36C55 45 44 50 34 47C30 46 27 45 25 43Z",
    detail: "M29 39C28 31 40 28 46 34C51 40 41 46 35 41C32 38 36 35 39 37",
  },
  titan: {
    shape:
      "M24 41C20 35 21 25 28 21C32 19 32 15 37 15C42 15 43 20 47 22C54 26 56 37 50 43C44 49 31 49 24 41Z",
    detail:
      "M43 42C30 44 25 32 31 25C38 19 48 26 46 34C45 40 36 40 35 34C34 30 39 28 41 31",
  },
  ramshorn: {
    shape:
      "M25 41C19 33 22 21 31 17C41 13 52 20 53 30C55 41 45 49 35 47C31 46 27 44 25 41Z",
    detail:
      "M44 41C32 47 23 34 30 24C36 17 49 25 45 34C42 41 32 37 34 31C36 26 41 29 40 33",
  },
  nerite: {
    shape:
      "M25 42C20 36 23 27 31 23C41 18 52 25 54 34C56 43 46 49 36 47C31 47 27 45 25 42Z",
    detail:
      "M28 35C30 29 33 27 35 25M33 42C36 34 39 28 42 25M41 44C44 38 47 32 48 29M48 42C50 38 51 35 51 33",
  },
  rabbit: {
    shape:
      "M26 42C21 37 26 30 33 24C37 21 42 11 46 12C50 13 47 23 49 29C52 39 47 47 38 47C33 47 29 45 26 42Z",
    detail:
      "M29 36C35 36 43 39 49 38M33 30C38 30 43 33 48 32M38 24C41 24 44 26 47 26M42 19C44 19 46 20 47 20",
  },
  limpet: {
    shape:
      "M24 43C21 38 27 31 32 27C37 23 41 24 45 29C49 33 56 39 52 44C48 49 30 49 24 43Z",
    detail:
      "M37 29C35 33 31 38 28 42M39 29C39 34 39 40 39 45M41 30C44 34 47 39 49 42",
  },
};

export function SnailAvatar({
  colour = "#8B5E52",
  species = "garden",
  status,
  size = 32,
  className,
  title,
  seed,
}: {
  colour?: string | null;
  species?: CrewSpecies;
  status?: "ready" | "working" | "paused" | "archived";
  size?: number;
  className?: string;
  title?: string;
  seed?: string;
}) {
  const tint = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    colour ?? "",
  )
    ? (colour as string)
    : "#78404c";
  const identity = seed ?? species;
  const variant = [...identity].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  const shell = SHELLS[species] ?? SHELLS.garden;
  const stretch = 0.94 + (variant % 5) * 0.03;

  return (
    <Avatar
      className={cn(
        "shelly-snail [&_.ph-avatar]:!size-full [&_.ph-avatar]:border-0",
        className,
      )}
      style={{ width: size, height: size }}
      color="bg-transparent"
      status={
        status === "ready"
          ? "online"
          : status === "working"
            ? "busy"
            : status === "paused"
              ? "away"
              : status === "archived"
                ? "offline"
                : undefined
      }
      role={title ? "img" : undefined}
      aria-label={title ? `${title}${status ? ` — ${status}` : ""}` : undefined}
      aria-hidden={title ? undefined : true}
      data-species={species}
      data-status={status}
      data-variant={variant % 5}
      icon={
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className="!size-full"
          fill="none"
          aria-hidden
        >
          <circle cx="32" cy="32" r="31" fill={tint} fillOpacity=".1" />
          <ellipse
            cx="33"
            cy="52"
            rx="22"
            ry="2"
            fill="currentColor"
            opacity=".07"
          />
          <g className="shelly-snail-body">
            <path
              d={`M11 37C11 29 24 28 27 37C29 43 36 44 ${47 + (variant % 3)} 44C57 44 58 51 49 53C41 55 28 54 21 53C12 52 8 47 11 37Z`}
              fill="#D8BC99"
            />
            <path
              d="M19 49C28 52 42 52 49 49"
              stroke="#fff5e8"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity=".5"
            />
            <g
              transform={`translate(38 32) scale(${stretch} 1) translate(-38 -32)`}
            >
              <path d={shell.shape} fill={tint} />
              <path
                d={shell.shape}
                fill="#fff5e8"
                opacity=".08"
                transform="translate(0 -1)"
              />
              <path
                d={shell.detail}
                stroke="#fff5e8"
                strokeOpacity=".65"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <g className="shelly-snail-head">
              <path
                d={`M16 33C16 29 14 ${25 - (variant % 2)} 13 25M24 33C24 29 26 25 27 24`}
                stroke="#D8BC99"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M10 39C10 32 14 29 20 29C26 29 30 33 30 39C30 46 26 50 20 50C14 50 10 46 10 39Z"
                fill="#E8CEAC"
              />
              <g
                className="shelly-snail-eyes"
                style={{ animationDelay: `${-(variant % 7)}s` }}
              >
                <circle cx="16.5" cy="38" r="1.8" fill="#302832" />
                <circle cx="23.5" cy="38" r="1.8" fill="#302832" />
              </g>
            </g>
          </g>
        </svg>
      }
    />
  );
}
