# Theme Token Reference

The built-in palettes are defined in `src/styles/themes.css`; the registry in
`src/themes/registry.ts` is the source of truth for IDs, names, and modes.

## Theme IDs

```ts
"hedgehog-light";
"hedgehog-dark";
"note";
"note-dark";
"turtletime";
"turtletime-dark";
"rosepine-light";
"rosepine-dark";
"kraken-light";
"kraken-dark";
"deepsea-light";
"deepsea-dark";
"malibu-light";
"malibu-dark";
```

## Theme Pairs

| Pair        | Light            | Dark              |
| ----------- | ---------------- | ----------------- |
| HedgeHog    | `hedgehog-light` | `hedgehog-dark`   |
| Note        | `note`           | `note-dark`       |
| TurtleTime  | `turtletime`     | `turtletime-dark` |
| Rosé Pine   | `rosepine-light` | `rosepine-dark`   |
| Kraken      | `kraken-light`   | `kraken-dark`     |
| Tokyo Night | `deepsea-light`  | `deepsea-dark`    |
| Malibu      | `malibu-light`   | `malibu-dark`     |

## Core Tokens

Every built-in theme defines these semantic values:

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
--ph-violet
--ph-purple
--ph-success
--ph-warning
--ph-danger
--ph-info
--ph-data-1 through --ph-data-7
```

Malibu uses a sun-bleached GTA San Andreas palette in light mode and Nakama's
deep plum command deck in dark mode, with hot pink, lime, cyan, amber, and
emerald signals.

For the complete token values, read `src/styles/themes.css` directly.
