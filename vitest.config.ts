import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    // The full suite is environment-heavy (jsdom + setup ~40s); the default
    // 5s per-test budget flakes under load even when tests pass in isolation.
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});
