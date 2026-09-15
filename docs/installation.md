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
    "@xenide-io/the-old-ui-theme": "file:../path-to/the-old-ui"
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
bun add @xenide-io/the-old-ui-theme
```

or:

```bash
npm install @xenide-io/the-old-ui-theme
```

## Import Styles Once

In a Next.js app:

```tsx
// app/layout.tsx
import "@xenide-io/the-old-ui-theme/styles.css";
```

## Tailwind Setup

Add the package preset and include the built package files in `content`.

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

## Next.js Theme Setup

Use `THEME_INIT_SCRIPT` to avoid a theme flash and `ThemeDomSync` to sync the stored theme after hydration.

```tsx
// app/layout.tsx
import "@xenide-io/the-old-ui-theme/styles.css";
import { THEME_INIT_SCRIPT, ThemeDomSync } from "@xenide-io/the-old-ui-theme";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="hedgehog-light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeDomSync />
        {children}
      </body>
    </html>
  );
}
```

## Basic Usage

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
