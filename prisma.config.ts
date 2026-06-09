import { defineConfig } from "prisma/config";

// Load .env files for local development. Uses require() so a missing dotenv
// package (devDependency, absent in some build environments) fails gracefully
// rather than crashing the static import before defineConfig is reached.
// In Vercel and production, vars are injected directly into process.env.
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { config } = require("dotenv") as typeof import("dotenv");
  config({ path: ".env.local" });
  config({ path: ".env" });
} catch {
  // dotenv unavailable — env vars must already be in process.env
}

const dbUrl = process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"];

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
