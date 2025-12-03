import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react()],
  test: {
    // Default to jsdom for unit tests
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],

    // Browser mode configuration for visual regression tests
    browser: {
      enabled: process.env.BROWSER_TEST === "true",
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
      expect: {
        toMatchScreenshot: {
          // Use pixelmatch for comparison
          comparatorName: "pixelmatch",
          comparatorOptions: {
            // Threshold for color difference (0-1, where 0 is identical)
            threshold: 0.2,
            // Allow up to 1% of pixels to be different
            allowedMismatchedPixelRatio: 0.01,
          },
          // Include platform in screenshot filename for cross-platform testing
          // This ensures macOS and Linux use different baseline files
          resolveScreenshotPath: ({ arg, browserName, platform }) =>
            `__screenshots__/${arg}-${browserName}-${platform}.png`,
        },
      },
    },

    // Use different test patterns for browser tests
    include: process.env.BROWSER_TEST === "true"
      ? ["src/**/*.browser.test.{ts,tsx}"]
      : ["src/**/*.test.{ts,tsx}"],

    // Exclude browser tests from regular test runs
    exclude: process.env.BROWSER_TEST === "true"
      ? []
      : ["src/**/*.browser.test.{ts,tsx}", "node_modules/**"],
  },
});