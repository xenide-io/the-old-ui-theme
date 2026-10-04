"use client";

import { useId } from "react";

export function AiWritingIllustration({
  title,
  prompt,
  before,
  after,
}: {
  title: string;
  prompt: string;
  before: string[];
  after: string[];
}) {
  const id = useId().replaceAll(":", "");
  return (
    <svg
      viewBox="0 0 560 370"
      className="h-auto w-full"
      role="img"
      aria-label={`${title}: use /ai and Shelly AI to draft and polish writing`}
      data-marketing-art
    >
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="var(--ph-accent)" stopOpacity=".2" />
          <stop offset="1" stopColor="var(--ph-accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-paper`} x2="1" y2="1">
          <stop stopColor="var(--ph-surface)" />
          <stop offset="1" stopColor="var(--ph-muted)" />
        </linearGradient>
      </defs>
      <ellipse cx="280" cy="198" rx="260" ry="168" fill={`url(#${id}-glow)`} />
      <g className="marketing-svg-float">
        <rect
          x="18"
          y="28"
          width="524"
          height="300"
          rx="20"
          fill={`url(#${id}-paper)`}
          stroke="var(--ph-border)"
        />
        <path d="M18 76h524" stroke="var(--ph-border)" />
        <image href="/shelly-icon.svg" x="36" y="40" width="24" height="24" />
        <text
          x="70"
          y="57"
          fontSize="16"
          fontWeight="700"
          fill="var(--ph-text-primary)"
        >
          {title}
        </text>
        <text x="434" y="57" fontSize="12" fill="var(--ph-text-secondary)">
          Shelly AI
        </text>
        <rect
          x="38"
          y="94"
          width="484"
          height="42"
          rx="10"
          fill="var(--ph-canvas)"
          stroke="var(--ph-selected-border)"
        />
        <text x="54" y="121" fontSize="16" fill="var(--ph-text-primary)">
          {prompt}
        </text>
        <g className="marketing-svg-draft">
          <text
            x="46"
            y="171"
            fontSize="12"
            fontWeight="700"
            fill="var(--ph-text-secondary)"
          >
            YOUR DRAFT
          </text>
          {before.map((line, index) => (
            <text
              key={index}
              x="46"
              y={205 + index * 26}
              fontSize="16"
              fill="var(--ph-text-secondary)"
            >
              {line}
            </text>
          ))}
        </g>
        <path
          className="marketing-svg-thread"
          d="M265 175v102"
          stroke="var(--ph-accent)"
          strokeWidth="2"
          strokeDasharray="4 7"
        />
        <g className="marketing-svg-polished">
          <text
            x="294"
            y="171"
            fontSize="12"
            fontWeight="700"
            fill="var(--ph-accent)"
          >
            POLISHED WITH SHELLY
          </text>
          {after.map((line, index) => (
            <text
              key={index}
              x="294"
              y={205 + index * 26}
              fontSize="16"
              fill="var(--ph-text-primary)"
            >
              {line}
            </text>
          ))}
          <path
            d="m302 294 5 5 10-11"
            fill="none"
            stroke="var(--ph-success)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="328" y="300" fontSize="12" fill="var(--ph-text-secondary)">
            Ready to keep working
          </text>
        </g>
      </g>
      <g className="marketing-svg-spark" fill="var(--ph-accent)">
        <path d="m520 12 3 10 10 3-10 3-3 10-3-10-10-3 10-3z" />
        <path d="m25 310 2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
      </g>
    </svg>
  );
}

export function IntegrationBridgeIllustration({
  appName,
  appIcon,
  recordLabel,
  calendar = false,
}: {
  appName: string;
  appIcon: string;
  recordLabel: string;
  calendar?: boolean;
}) {
  const id = useId().replaceAll(":", "");
  const rows = calendar
    ? ["Client catch-up", "10:00 – 11:00", "Meeting notes"]
    : ["Client", "Project", recordLabel];
  return (
    <svg
      viewBox="0 0 600 350"
      className="h-auto w-full"
      role="img"
      aria-label={
        calendar
          ? "Choose a calendar event to prefill a TurtleTime entry"
          : `Shelly Bridge matches connected records with ${appName}`
      }
      data-marketing-art
    >
      <defs>
        <radialGradient id={`${id}-bridge`}>
          <stop stopColor="var(--ph-blue)" stopOpacity=".17" />
          <stop offset="1" stopColor="var(--ph-blue)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        cx="300"
        cy="185"
        rx="280"
        ry="160"
        fill={`url(#${id}-bridge)`}
      />
      <g className="marketing-svg-float">
        <rect
          x="18"
          y="55"
          width="230"
          height="240"
          rx="18"
          fill="var(--ph-surface)"
          stroke="var(--ph-border)"
        />
        <rect
          x="352"
          y="55"
          width="230"
          height="240"
          rx="18"
          fill="var(--ph-surface)"
          stroke="var(--ph-border)"
        />
        <text
          x="38"
          y="92"
          fontSize="17"
          fontWeight="700"
          fill="var(--ph-text-primary)"
        >
          {calendar ? "Calendar events" : "Connected tools"}
        </text>
        <image href={appIcon} x="370" y="72" width="28" height="28" />
        <text
          x="410"
          y="93"
          fontSize="17"
          fontWeight="700"
          fill="var(--ph-text-primary)"
        >
          {appName}
        </text>
        {rows.map((row, index) => (
          <g key={row}>
            <rect
              x="36"
              y={119 + index * 48}
              width="194"
              height="36"
              rx="8"
              fill="var(--ph-muted)"
            />
            <text
              x="50"
              y={142 + index * 48}
              fontSize="14"
              fill="var(--ph-text-secondary)"
            >
              {row}
            </text>
            <rect
              x="370"
              y={119 + index * 48}
              width="194"
              height="36"
              rx="8"
              fill="var(--ph-muted)"
            />
            <text
              x="384"
              y={142 + index * 48}
              fontSize="14"
              fill="var(--ph-text-primary)"
            >
              {calendar && index === 1 ? "1 hour, ready to review" : row}
            </text>
            <path
              className="marketing-svg-thread"
              d={`M248 ${137 + index * 48}h104`}
              stroke="var(--ph-accent)"
              strokeWidth="2"
              strokeDasharray="5 8"
            />
          </g>
        ))}
      </g>
      <g className="marketing-svg-polished">
        <circle
          cx="300"
          cy="185"
          r="27"
          fill="var(--ph-canvas)"
          stroke="var(--ph-selected-border)"
        />
        <image href="/shelly-icon.svg" x="280" y="165" width="40" height="40" />
        <text
          x="300"
          y="331"
          textAnchor="middle"
          fontSize="13"
          fill="var(--ph-text-secondary)"
        >
          {calendar
            ? "Prefill details · review · save the entry"
            : "Shelly Bridge · match the records you want to connect"}
        </text>
      </g>
    </svg>
  );
}
