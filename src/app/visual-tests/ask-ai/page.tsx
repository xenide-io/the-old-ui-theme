"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparks } from "iconoir-react";

import {
  SuiteAiPanel,
  SuiteThemeProvider,
  openSuiteAskAi,
  type SuiteAiChatMessage,
} from "@/suite";

/**
 * Temporary fixture for driving the Ask AI panel in Playwright.
 * Query params: ?fixture=empty|convo|error &theme=<data-theme id>
 */

const ASSISTANT_REPLY = [
  "Here's where your week landed.",
  "",
  "## Highlights",
  "",
  "- **12.5 hours** logged across 4 projects",
  "- Two Tides tasks are overdue",
  "- Thursday was your deepest focus day",
  "",
  "You can pull the same numbers straight from the API:",
  "",
  "```ts",
  "const res = await fetch('/api/turtletime/time-entries?range=week');",
  "const { total_minutes, by_project } = await res.json();",
  "```",
  "",
  "Want me to draft a client update from this?",
].join("\n");

const CONVERSATION: SuiteAiChatMessage[] = [
  {
    role: "user",
    content:
      "Summarise what I logged this week and flag anything that looks off.",
  },
  { role: "assistant", content: ASSISTANT_REPLY },
];

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AskAiFixture() {
  const [ready, setReady] = useState(false);
  const [fixture, setFixture] = useState("convo");
  const [themeId, setThemeId] = useState("hedgehog-light");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextFixture = params.get("fixture") ?? "convo";
    const nextTheme = params.get("theme") ?? "hedgehog-light";
    document.documentElement.setAttribute("data-theme", nextTheme);
    setFixture(nextFixture);
    setThemeId(nextTheme);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) openSuiteAskAi();
  }, [ready]);

  const config = useMemo(
    () => ({
      storageKey: "ask-ai-fixture-theme",
      lightThemeId: themeId.includes("dark") ? "unused-light" : themeId,
      darkThemeId: themeId.includes("dark") ? themeId : "unused-dark",
      fallbackTheme: (themeId.includes("dark") ? "dark" : "light") as
        | "dark"
        | "light",
    }),
    [themeId],
  );

  if (!ready) return null;

  return (
    <SuiteThemeProvider config={config}>
      <main className="min-h-screen bg-ph-canvas p-6 text-ph-ink">
        <p className="text-sm text-ph-subtle">Ask AI fixture — {fixture}</p>
        <SuiteAiPanel
          hideLauncher
          spinner={Spinner}
          brandIcon={Sparks}
          presets={[
            {
              label: "What should I focus on?",
              prompt: "What should I focus on today?",
            },
            {
              label: "Summarise my day",
              prompt: "Summarise what I have logged and what is still open.",
            },
            {
              label: "Draft a client update",
              prompt: "Draft a short client update from this week's work.",
            },
          ]}
          fetchChat={async () => ({
            messages: fixture === "empty" ? [] : CONVERSATION,
            configured: true,
          })}
          sendMessage={async () => {
            if (fixture === "error") {
              await new Promise((r) => setTimeout(r, 150));
              throw new Error(
                "ShellStack AI hit its rate limit. Wait a moment and try again.",
              );
            }
            // Hang so Playwright can capture the streaming state.
            await new Promise(() => {});
            return { messages: CONVERSATION, reply: "" };
          }}
          clearChat={async () => {}}
        />
      </main>
    </SuiteThemeProvider>
  );
}
