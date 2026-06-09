/**
 * Validates required server-side environment variables at call time.
 * Throws with a clear, actionable message rather than failing later inside a
 * DB connection or API call with a cryptic error.
 *
 * Lazy (function, not module-level constant) so Next.js build-time static
 * analysis does not trigger validation before env vars are available.
 *
 * Import only in server-side code (actions, lib, server components).
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Required environment variable "${name}" is not set.\n` +
        `Check .env.local.example for the full list of required variables.`
    );
  }
  return value;
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL");
}

export function getAnthropicApiKey(): string {
  return requireEnv("ANTHROPIC_API_KEY");
}
