import type { Config } from "tailwindcss";

import posthogThemePreset from "./tailwind-preset";

/**
 * Tailwind v4 legacy JS config, loaded via `@config` from `src/app/tailwind.css`
 * and from each consuming app. v4 uses its own automatic source detection, so the
 * `content` array is kept only for tooling that still reads it.
 */
const config: Config = {
  presets: [posthogThemePreset],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/suite/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
