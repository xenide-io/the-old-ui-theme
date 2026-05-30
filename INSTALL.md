# Install The Old UI

This package is a React/Tailwind UI library. It ships components, theme CSS, a Tailwind preset, and theme helpers.

## 1. Build The Library

From this repo:

```bash
bun install
bun run build:lib
```

This creates the package output in `dist/`:

```txt
dist/index.mjs
dist/index.js
dist/index.d.ts
```

## 2. Install In Another App

### Local Install

Use this while developing locally:

```json
{
  "dependencies": {
    "the-old-ui": "file:../path-to/posthog-theme"
  }
}
```

Then run:

```bash
bun install
```

### Published Package

After publishing to npm:

```bash
bun add the-old-ui
```

or:

```bash
npm install the-old-ui
```

## 3. Import Styles

Import the CSS once in your app root.

```tsx
// app/layout.tsx
import "the-old-ui/styles.css";
```

## 4. Configure Tailwind

Add the preset and include the package output in `content`.

```ts
// tailwind.config.ts
import theOldUiPreset from "the-old-ui/tailwind-preset";

export default {
  presets: [theOldUiPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./node_modules/the-old-ui/dist/**/*.{js,mjs}",
  ],
};
```

## 5. Add Theme Setup

The default theme is `hedgehog-light`.

```tsx
// app/layout.tsx
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
}
```

## 6. Use Components

```tsx
import { Button, Card, H1, P } from "the-old-ui";

export function Example() {
  return (
    <Card
      title={<H1>Dashboard</H1>}
      description={<P tone="subtle">Your workspace overview.</P>}
      actions={<Button variant="primary">Create insight</Button>}
    />
  );
}
```

## 7. Switch Themes

```tsx
import { ThemeSwitcher, persistTheme } from "the-old-ui";

<ThemeSwitcher />

persistTheme("sheets-dark");
```

Built-in theme pairs:

```ts
hedgehog-light / hedgehog-dark
sheets / sheets-dark
note / note-dark
presentation / presentation-dark
socials / socials-dark
chats-light / chats-dark
catppuccin-light / catppuccin-dark
xenide-light / xenide-dark
github-light / github-dark
rosepine-light / rosepine-dark
turtletime / turtletime-dark
bikini-bottom / bikini-bottom-dark
```

The demo also includes a visual theme color guide. The source of truth for every theme color is:

```txt
src/styles/themes.css
```

Each theme is a `data-theme` block. Example:

```css
[data-theme="hedgehog-light"] {
  --ph-canvas: ...;
  --ph-surface: ...;
  --ph-accent: ...;
}
```

## 8. Custom Light/Dark Theme

Custom themes work like DaisyUI themes: create one light `data-theme` block and one dark `data-theme` block. Components read semantic tokens, so you do not need to edit components.

```css
/* app/globals.css */
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
}
```

Activate it manually:

```tsx
document.documentElement.setAttribute("data-theme", "my-theme-light");
```

Or persist it:

```tsx
import { persistTheme } from "the-old-ui";

persistTheme("my-theme-dark");
```

If you want a custom theme to appear in the built-in `ThemeSwitcher`, add both IDs to `src/themes/registry.ts` before building the package:

```ts
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
}
```

## 9. Publish

When ready:

```bash
bun run build:lib
npm publish
```
