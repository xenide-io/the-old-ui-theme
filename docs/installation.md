# Installation

## Build The Library

Run this in the UI library repo:

```bash
bun install
bun run build:lib
```

The library build outputs:

```txt
dist/index.mjs
dist/index.js
dist/index.d.ts
```

## Local Install In Another App

Use this while developing locally:

```json
{
  "dependencies": {
    "the-old-ui": "file:../path-to/posthog-theme"
  }
}
```

Then install in the consuming app:

```bash
bun install
```

## Published Install

After publishing:

```bash
bun add the-old-ui
```

or:

```bash
npm install the-old-ui
```

## Import Styles Once

In a Next.js app:

```tsx
// app/layout.tsx
import "the-old-ui/styles.css";
```

## Tailwind Setup

Add the package preset and include the built package files in `content`.

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

## Next.js Theme Setup

Use `THEME_INIT_SCRIPT` to avoid a theme flash and `ThemeManager` to sync the stored theme after hydration.

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

## Basic Usage

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
