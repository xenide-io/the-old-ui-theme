import type { Config } from "tailwindcss";

import posthogThemePreset from "./tailwind-preset";

const config: Config = {
  presets: [posthogThemePreset],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
