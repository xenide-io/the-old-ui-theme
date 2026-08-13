# The Old UI

Props-driven React components and theme tokens in the spirit of PostHog’s dashboard chrome — optimized for Next.js demos and small internal tools.

## Install

```bash
npm install @xenide-io/the-old-ui-theme
# or
bun add @xenide-io/the-old-ui-theme
```

For full setup instructions, see [`INSTALL.md`](./INSTALL.md).

For AI-readable usage docs, see [`docs/`](./docs/README.md).

## Setup In Your App

Import the library CSS once at your app root. This gives you the theme variables, typography, and component classes.

```tsx
// app/layout.tsx or pages/_app.tsx
import "@xenide-io/the-old-ui-theme/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="hedgehog-light">
      <body>{children}</body>
    </html>
  );
}
```

Add the Tailwind preset so `bg-ph-*`, `text-ph-*`, Lemon radii, and shadows resolve correctly.

```ts
// tailwind.config.ts
import theOldUiPreset from "@xenide-io/the-old-ui-theme/tailwind-preset";

export default {
  presets: [theOldUiPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./node_modules/@xenide-io/the-old-ui-theme/dist/**/*.{js,mjs}",
  ],
};
```

Use components from the package root.

```tsx
import { Button, Card, H1, P } from "@xenide-io/the-old-ui-theme";

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

## Component API

Use components through props first. `className` is only an escape hatch for layout or one-off overrides.

```tsx
import { Alert, Badge, Button, Card, Input, H1, H2, P } from "@xenide-io/the-old-ui-theme";

<H1>Dashboard</H1>
<H2 tone="subtle">Overview</H2>
<Button variant="primary" size="sm">Save</Button>
<Badge variant="success">Live</Badge>
<Alert status="warning" title="Approaching quota" />
<Input label="Email" error="Required" />
<Card title="Insight saved" description="Dashboard tile copy." />
```

### Exported React Components

| Area       | Components                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Actions    | `Button`, `DropdownButton`, `DropdownMenu`, `DropdownItem`                                                                               |
| Feedback   | `Alert`, `Badge`, `Toast`, `ToastStack`, `EmptyState`, `Progress` demos                                                                  |
| Inputs     | `FormField`, `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `Range`, `Rating`, `FileUpload`, `SearchInput`, `SearchGroup` |
| Layout     | `Card`, `Modal`, `Drawer`, `Panel`, `Accordion`, `HoverCard`                                                                             |
| Navigation | `Tabs`, `Breadcrumbs`, `Pagination`, `SegmentedControl`, `Stepper`, `CommandPalette`, `FilterChips`                                      |
| Data       | `Table`, `Stat`, chart components, dashboard shell components                                                                            |
| Typography | `H1`, `H2`, `H3`, `H4`, `H5`, `P`, `Small`, `Caption`, `Lead`, `Mono`, `Overline`, `Display`                                             |
| Foundation | icons, theme switcher, code block, color tokens                                                                                          |

Some showcase sections are foundation or pattern demos rather than standalone components, such as color tokens, icon inventory, terminal capture, diff slider, and chart/dashboard compositions.

### Focused demos

The rendered catalogue is split into focused routes so each page mounts only
the component family it demonstrates:

| Route               | Focus                            |
| ------------------- | -------------------------------- |
| `/demo`             | Route picker                     |
| `/demo/foundations` | Type scale, tokens, icons, setup |
| `/demo/components`  | Primitive components             |
| `/demo/patterns`    | Composed UI flows                |
| `/demo/suite`       | Shared product chrome            |

## Layers (take what you need)

| Tier                | What you get                                                                     | Dependencies      |
| ------------------- | -------------------------------------------------------------------------------- | ----------------- |
| **CSS tokens**      | `src/styles/themes.css` — `[data-theme]` variables (`--ph-*`)                    | None              |
| **Typography**      | `src/styles/typography.css` — font stacks and the fluid marketing scale           | None              |
| **Tailwind preset** | `tailwind-preset.ts` — `ph.*` colours, `font-sans`/`font-serif`, radii, shadows   | `tailwindcss`     |
| **App shell**       | `src/app/globals.css` — `@font-face`, primitives, layouts                         | Tokens + Tailwind |

## Typography

Two voices, deliberately different shapes rather than two weights of one face:

| Role                    | Face                | Where                                                          |
| ----------------------- | ------------------- | -------------------------------------------------------------- |
| Product UI and body     | Open Runde (`font-sans`)  | Every in-app surface, `H1`–`H5`, `P`, controls           |
| Display                 | Instrument Serif (`font-serif`) | `Display`, `SectionTitle`, `.ph-hero-title`, doc titles |
| Functional              | System monospace    | `Mono`, code, IDs, keyboard shortcuts                          |

Marketing sizes are fluid (`clamp()`), so a hero is one class instead of three
breakpoint variants: `.ph-hero-title`, `.ph-section-title`, `.ph-feature-title`,
`.ph-lead`, `.ph-eyebrow`. Self-host `InstrumentSerif-{Regular,Italic}.woff2` and
the Open Runde weights under `public/fonts/`.

## Themes

Themes are CSS-variable based. Set `html[data-theme]` to switch palettes — no JS re-render needed.

All theme colors live in `src/styles/themes.css`. The master registry of IDs, display names, and groups lives in `src/themes/registry.ts`.

### Built-in themes

| Group           | Light            | Dark              |
| --------------- | ---------------- | ----------------- |
| **HedgeHog**    | `hedgehog-light` | `hedgehog-dark`   |
| **Note**        | `note`           | `note-dark`       |
| **TurtleTime**  | `turtletime`     | `turtletime-dark` |
| **Rosé Pine**   | `rosepine-light` | `rosepine-dark`   |
| **Kraken**      | `kraken-light`   | `kraken-dark`     |
| **Tokyo Night** | `deepsea-light`  | `deepsea-dark`    |
| **Malibu**      | `malibu-light`   | `malibu-dark`     |

### Programmatic usage

```tsx
import { persistTheme, readStoredTheme } from "@xenide-io/the-old-ui-theme";

// Switch theme — persists to localStorage and updates html[data-theme]
persistTheme("malibu-dark");

// Read current theme
const themeId = readStoredTheme(); // one of the built-in ThemeId values
```

### Theme switcher setup

Use the built-in theme switcher when you want users to change themes. `ThemeDomSync` reapplies the stored theme after hydration.

```tsx
import { ThemeDomSync, ThemeSwitcher } from "@xenide-io/the-old-ui-theme";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeDomSync />
      <header>
        <ThemeSwitcher />
      </header>
      {children}
    </>
  );
}
```

### Manual theme switching

If you do not want the built-in switcher, you can set the attribute directly.

```tsx
document.documentElement.setAttribute("data-theme", "malibu-dark");
```

For persisted switching, use the helper.

```tsx
import { persistTheme } from "@xenide-io/the-old-ui-theme";

persistTheme("kraken-dark");
```

### Custom themes

Custom themes work like DaisyUI: create a new `data-theme` block and override the semantic `--ph-*` tokens. Components should not need changes.

```css
/* app/globals.css */
@import "@xenide-io/the-old-ui-theme/styles.css";

[data-theme="my-theme"] {
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
```

Then activate it with:

```tsx
document.documentElement.setAttribute("data-theme", "my-theme");
```

If you want it to appear inside `ThemeSwitcher`, add it to `src/themes/registry.ts` in this repo before building the package.

```ts
{
  id: "my-theme",
  name: "My Theme",
  description: "Custom warm workspace palette.",
  colorScheme: "light",
  group: "Custom",
}
```

### In another Next.js app

1. Install `@xenide-io/the-old-ui-theme`.
2. Import `@xenide-io/the-old-ui-theme/styles.css` once in your app root.
3. Set `<html data-theme="hedgehog-light">` or use `persistTheme()` / `ThemeSwitcher`.
4. Add `@xenide-io/the-old-ui-theme/tailwind-preset` to `tailwind.config.ts`.
5. If you consume this repo through `file:`, add `@xenide-io/the-old-ui-theme` to `transpilePackages` in `next.config.mjs`.

Optional chart usage: peer‑install `chart.js` and `react-chartjs-2`, import `@/lib/chart/register-chartjs` once near your chart trees, and pass options built from `usePhChartTokens` / `build*Demo` helpers (or copy the pattern).

## Develop

```bash
bun install   # creates node_modules/ from package.json — do not commit this folder
bun run dev
```

```bash
bunx tsc --noEmit
bun run build
bun run clean   # drops .next/ and TS cache; run before a fresh build if needed
```
