import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Keep Vitest scoped to unit/component tests only.
    include: [
      "src/**/*.{test,spec}.{ts,tsx}",
      "tests/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: [
      "tests/e2e/**",
      "node_modules/**",
      "dist/**",
      "playwright.config.ts",
    ],
    passWithNoTests: true,
  },
});
