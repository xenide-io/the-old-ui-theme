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
      },
    },
  },
  plugins: [],
};

export default posthogThemePreset;
