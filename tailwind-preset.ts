import type { Config } from "tailwindcss";

/**
 * PostHog-theme **Tailwind preset** — `ph.*` colours, Lemon radii/shadows, font stack.
 * Use in a consuming Next.js app: import this preset and set `presets: [posthogTheme]` in
 * `tailwind.config.ts`, plus a `content` glob that matches your `ts` and `tsx` files under `src` (or `app`).
 */
const posthogThemePreset: Partial<Config> = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Open Runde"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: ["var(--ph-font-monospace-stack)"],
        shortcut: ["var(--ph-font-shortcut-stack)"],
        display: ["var(--ph-font-sans-stack)"],
      },
      fontSize: {
        xs: ["var(--ph-type-meta)", { lineHeight: "var(--ph-leading-ui)" }],
        sm: ["var(--ph-type-small)", { lineHeight: "var(--ph-leading-ui)" }],
        base: ["var(--ph-type-body)", { lineHeight: "var(--ph-leading-body)" }],
        lg: ["var(--ph-type-card)", { lineHeight: "1.4" }],
        xl: ["var(--ph-type-subsection)", { lineHeight: "1.35" }],
        "2xl": ["var(--ph-type-product-section)", { lineHeight: "1.25" }],
      },
      borderRadius: {
        lemon: "var(--ph-radius-app)",
      },
      boxShadow: {
        "lemon-ridge-primary": "0 0.1875rem 0 -1px var(--ph-primary-frame-bg)",
        "lemon-ridge-secondary": "0 0.1875rem 0 -1px var(--ph-secondary-frame-bg)",
        "elevation-3000": "0 3px 0 var(--ph-border-3000)",
        ph: "0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)",
        "ph-md": "0 2px 4px rgb(0 0 0 / 0.04), 0 4px 12px rgb(0 0 0 / 0.08)",
      },
      colors: {
        ph: {
          canvas: "var(--ph-canvas)",
          surface: "var(--ph-surface)",
          inset: "var(--ph-surface-inset)",
          raised: "var(--ph-surface-raised)",
          overlay: "var(--ph-surface-overlay)",
          muted: "var(--ph-muted)",
          toolbar: "var(--ph-toolbar)",
          border: "var(--ph-border)",
          "border-subtle": "var(--ph-border-subtle)",
          strong: "var(--ph-border-strong)",
          ink: "var(--ph-text-primary)",
          subtle: "var(--ph-text-secondary)",
          mutedtext: "var(--ph-text-tertiary)",
          brand: "var(--ph-accent)",
          "brand-hover": "var(--ph-accent-hover)",
          blue: "var(--ph-blue)",
          violet: "var(--ph-violet)",
          purple: "var(--ph-purple)",
          success: "var(--ph-success)",
          warning: "var(--ph-warning)",
          danger: "var(--ph-danger)",
          info: "var(--ph-info)",
          selected: "var(--ph-selected-bg)",
          "selected-ink": "var(--ph-selected-text)",
          focus: "var(--ph-focus-ring)",
          "btn-primary-face": "var(--ph-primary-button-face)",
          "btn-primary-border": "var(--ph-primary-button-border)",
          "btn-primary-frame": "var(--ph-primary-frame-bg)",
          "btn-secondary-face": "var(--ph-secondary-button-bg)",
          "btn-secondary-border": "var(--ph-secondary-button-border)",
          "btn-secondary-frame": "var(--ph-secondary-frame-bg)",
        },
        /**
         * shadcn/ui-compatible tokens, mapped onto the `ph.*` palette.
         * shadcn-based libraries (e.g. `@ilamy/calendar`) use classes like
         * `bg-background`, `text-muted-foreground`, `border-border`, `ring-ring`,
         * so exposing them here lets those packages inherit the suite theme
         * (including light/dark) without per-app overrides.
         */
        background: "var(--background, var(--ph-canvas))",
        foreground: "var(--ph-text-primary)",
        border: "var(--ph-border)",
        input: "var(--ph-border)",
        ring: "var(--ph-focus-ring)",
        card: {
          DEFAULT: "var(--ph-surface)",
          foreground: "var(--ph-text-primary)",
        },
        popover: {
          DEFAULT: "var(--ph-surface-raised)",
          foreground: "var(--ph-text-primary)",
        },
        primary: {
          DEFAULT: "var(--ph-accent)",
          foreground: "var(--ph-on-accent)",
        },
        secondary: {
          DEFAULT: "var(--ph-muted)",
          foreground: "var(--ph-text-primary)",
        },
        muted: {
          DEFAULT: "var(--ph-muted)",
          foreground: "var(--ph-text-tertiary)",
        },
        accent: {
          DEFAULT: "var(--ph-muted)",
          foreground: "var(--ph-text-primary)",
        },
        destructive: {
          DEFAULT: "var(--ph-danger)",
          foreground: "var(--ph-on-accent)",
        },
      },
    },
  },
  plugins: [],
};

export default posthogThemePreset;
