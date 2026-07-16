"use client";

import { useEffect, useMemo, useState } from "react";
import { CodeBlock, H3, P, Panel, ThemeSwitcher } from "@/components/ui";
import { THEMES } from "@/themes";

const themePairs = [
  { name: "HedgeHog", light: "hedgehog-light", dark: "hedgehog-dark" },
  { name: "Sheets", light: "sheets", dark: "sheets-dark" },
  { name: "Note", light: "note", dark: "note-dark" },
  { name: "Presentation", light: "presentation", dark: "presentation-dark" },
  { name: "Socials", light: "socials", dark: "socials-dark" },
  { name: "Chats", light: "chats-light", dark: "chats-dark" },
  { name: "Catppuccin", light: "catppuccin-light", dark: "catppuccin-dark" },
  { name: "Xenide", light: "xenide-light", dark: "xenide-dark" },
  { name: "GitHub", light: "github-light", dark: "github-dark" },
  { name: "Rose Pine", light: "rosepine-light", dark: "rosepine-dark" },
  { name: "TurtleTime", light: "turtletime", dark: "turtletime-dark" },
  { name: "Bikini Bottom", light: "bikini-bottom", dark: "bikini-bottom-dark" },
  { name: "Notion", light: "notion", dark: "notion-dark" },
] as const;

const guideTokens = [
  { label: "canvas", token: "--ph-canvas", text: "text-ph-ink" },
  { label: "surface", token: "--ph-surface", text: "text-ph-ink" },
  { label: "muted", token: "--ph-muted", text: "text-ph-ink" },
  { label: "toolbar", token: "--ph-toolbar", text: "text-ph-ink" },
  { label: "border", token: "--ph-border", text: "text-ph-ink" },
  { label: "accent", token: "--ph-accent", text: "text-white" },
  { label: "blue", token: "--ph-blue", text: "text-white" },
  { label: "purple", token: "--ph-purple", text: "text-white" },
  { label: "success", token: "--ph-success", text: "text-white" },
  { label: "warning", token: "--ph-warning", text: "text-white" },
  { label: "danger", token: "--ph-danger", text: "text-white" },
  { label: "info", token: "--ph-info", text: "text-white" },
] as const;

const dataTokens = [1, 2, 3, 4, 5, 6, 7].map((item) => ({
  label: `data ${item}`,
  token: `--ph-data-${item}`,
  text: "text-white",
}));

const installCode = `bun add the-old-ui
# or
npm install the-old-ui`;

const layoutCode = `// app/layout.tsx
import "the-old-ui/styles.css";
import { THEME_INIT_SCRIPT, ThemeManager } from "the-old-ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hedgehog-light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeManager>{children}</ThemeManager>
      </body>
    </html>
  );
}`;

const tailwindCode = `// tailwind.config.ts
import theOldUiPreset from "the-old-ui/tailwind-preset";

export default {
  presets: [theOldUiPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./node_modules/the-old-ui/dist/**/*.{js,mjs}",
  ],
};`;

const switchCode = `import { ThemeSwitcher, persistTheme } from "the-old-ui";

<ThemeSwitcher />

// Or switch manually
persistTheme("sheets-dark");`;

const customThemeCode = `/* app/globals.css */
@import "the-old-ui/styles.css";

[data-theme="my-theme-light"] {
  color-scheme: light;

  --ph-canvas: #f8f5ef;
  --ph-surface: #ffffff;
  --ph-muted: #eee8dd;
  --ph-toolbar: #e5dccd;
  --ph-border: #d7cbb8;
  --ph-border-strong: #a99b87;

  --ph-text-primary: #15110c;
  --ph-text-secondary: #4d4337;
  --ph-text-tertiary: #796f63;

  --ph-accent: #f97316;
  --ph-accent-hover: #ea580c;
  --ph-blue: #2563eb;
  --ph-purple: #7c3aed;
  --ph-success: #15803d;
  --ph-warning: #b45309;
  --ph-danger: #dc2626;
  --ph-info: #2563eb;
}

[data-theme="my-theme-dark"] {
  color-scheme: dark;

  --ph-canvas: #11100e;
  --ph-surface: #191713;
  --ph-muted: #242018;
  --ph-toolbar: #2e281f;
  --ph-border: #443a2b;
  --ph-border-strong: #7a6a54;

  --ph-text-primary: #fff7ed;
  --ph-text-secondary: #d8c8b6;
  --ph-text-tertiary: #a89985;

  --ph-accent: #fb923c;
  --ph-accent-hover: #fdba74;
  --ph-blue: #60a5fa;
  --ph-purple: #a78bfa;
  --ph-success: #4ade80;
  --ph-warning: #facc15;
  --ph-danger: #f87171;
  --ph-info: #60a5fa;
}`;

const registryCode = `// Add to src/themes/registry.ts if this repo should show it in ThemeSwitcher
{
  id: "my-theme-light",
  name: "My Theme Light",
  description: "Custom light palette.",
  colorScheme: "light",
  group: "Custom",
},
{
  id: "my-theme-dark",
  name: "My Theme Dark",
  description: "Custom dark palette.",
  colorScheme: "dark",
  group: "Custom",
}`;

export default function SetupThemeShowcase() {
  const [activeTheme, setActiveTheme] = useState("hedgehog-light");

  useEffect(() => {
    const root = document.documentElement;
    const update = () => setActiveTheme(root.getAttribute("data-theme") || "hedgehog-light");
    update();

    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const activeThemeCode = useMemo(() => {
    const theme = THEMES.find((item) => item.id === activeTheme);
    return `// Current selected theme in this demo\n${JSON.stringify({
      id: activeTheme,
      name: theme?.name ?? activeTheme,
      colorScheme: theme?.colorScheme ?? "light",
      group: theme?.group ?? "Custom",
    }, null, 2)}`;
  }, [activeTheme]);

  const themeListCode = useMemo(() => {
    return `export const themePairs = ${JSON.stringify(themePairs, null, 2)} as const;`;
  }, []);

  return (
    <div className="space-y-8">
      <Panel className="space-y-4">
        <H3>Setup</H3>
        <P tone="subtle">
          This demo is also the docs. A consuming app imports the package CSS once, adds the Tailwind preset, then switches palettes through <code className="ph-kbd">html[data-theme]</code>.
        </P>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={installCode} filename="install.sh" language="bash" />
          <CodeBlock code={tailwindCode} filename="tailwind.config.ts" />
        </div>
        <CodeBlock code={layoutCode} filename="app/layout.tsx" />
      </Panel>

      <Panel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <H3>Theme Switching</H3>
            <P tone="subtle">Each default palette is a light/dark pair. Pick one below and copy the active theme ID.</P>
          </div>
          <ThemeSwitcher />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={activeThemeCode} filename="current-theme.ts" />
          <CodeBlock code={switchCode} filename="ThemeSwitch.tsx" />
        </div>
      </Panel>

      <Panel className="space-y-4">
        <H3>Default Theme Pairs</H3>
        <P tone="subtle">Use these IDs with <code className="ph-kbd">data-theme</code> or <code className="ph-kbd">persistTheme()</code>.</P>
        <CodeBlock code={themeListCode} filename="theme-pairs.ts" />
      </Panel>

      <Panel className="space-y-5">
        <div>
          <H3>Theme Color Guide</H3>
          <P tone="subtle">
            Every built-in theme is rendered below with its own <code className="ph-kbd">data-theme</code> attribute. These swatches are the guide for what each token becomes in that theme.
          </P>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {THEMES.map((theme) => (
            <div
              key={theme.id}
              data-theme={theme.id}
              className="rounded-xl border border-ph-border bg-ph-canvas p-4 shadow-ph"
            >
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-ph-ink">{theme.name}</h4>
                  <p className="text-xs text-ph-mutedtext">{theme.id}</p>
                </div>
                <span className="rounded-full border border-ph-border bg-ph-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ph-mutedtext">
                  {theme.colorScheme}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {[...guideTokens, ...dataTokens].map((item) => (
                  <div
                    key={item.token}
                    className={`rounded-lg border border-ph-border p-2 ${item.text}`}
                    style={{ background: `var(${item.token})` }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wide">{item.label}</div>
                    <div className="mt-1 truncate font-mono text-[9px] opacity-80">{item.token}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="space-y-4">
        <H3>Custom Light & Dark Theme</H3>
        <P tone="subtle">Custom themes are DaisyUI-style: define one light token block and one dark token block. Components read semantic tokens, not hardcoded colours.</P>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock code={customThemeCode} filename="custom-theme.css" language="css" />
          <CodeBlock code={registryCode} filename="registry.ts" />
        </div>
      </Panel>
    </div>
  );
}
