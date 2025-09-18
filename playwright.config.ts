import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  use: {
    headless: true,
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
});


