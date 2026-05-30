# Themes

Themes are CSS-variable based. Components read semantic `--ph-*` tokens, so changing `html[data-theme]` changes the whole UI without editing components.

## Default Theme

```txt
hedgehog-light
```

Dark pair:

```txt
hedgehog-dark
```

## Built-In Theme Pairs

```ts
export const themePairs = [
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
] as const;
```

## Theme Switching

Use the built-in switcher:

```tsx
import { ThemeSwitcher } from "the-old-ui";

<ThemeSwitcher />
```

Switch manually and persist to `localStorage`:

```tsx
import { persistTheme } from "the-old-ui";

persistTheme("sheets-dark");
```

Set directly without persistence:

```tsx
document.documentElement.setAttribute("data-theme", "chats-dark");
```

## Master Color List

The source of truth for all theme colors is:

```txt
src/styles/themes.css
```

The source of truth for theme IDs, names, groups, and light/dark mode metadata is:

```txt
src/themes/registry.ts
```

The rendered demo has a visual swatch guide under **Setup & Theme**.

For the complete AI-readable list of every built-in theme and token value, see [Theme Token Reference](./theme-token-reference.md).

## Core Theme Tokens

Every theme should define these semantic tokens:

```css
--ph-canvas
--ph-surface
--ph-muted
--ph-toolbar
--ph-border
--ph-border-strong

--ph-text-primary
--ph-text-secondary
--ph-text-tertiary

--ph-accent
--ph-accent-hover
--ph-blue
--ph-purple

--ph-success
--ph-warning
--ph-danger
--ph-info

--ph-data-1
--ph-data-2
--ph-data-3
--ph-data-4
--ph-data-5
--ph-data-6
--ph-data-7
```

## Custom Light And Dark Theme

Custom themes work like DaisyUI themes: define a light block and a dark block.

```css
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

If the custom theme should appear in the built-in `ThemeSwitcher`, add both IDs to `src/themes/registry.ts` before building the package.
