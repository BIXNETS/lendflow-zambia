import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  (existsSync("/opt/ms-playwright/chromium-1194/chrome-linux/chrome")
    ? "/opt/ms-playwright/chromium-1194/chrome-linux/chrome"
    : undefined);

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 180_000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:8080",
    trace: "off",
    // Reuse the browser binary already present in the environment.
    launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
