import path from "path";

/**
 * Jobs/payments JSON and private uploads live here.
 *
 * Vercel serverless: the app filesystem is read-only. `/tmp` is writable but
 * ephemeral per instance — enough for MVP host smoke, not durable storage.
 */
export function dataRoot(env: NodeJS.ProcessEnv = process.env): string {
  if (env.VERCEL) {
    return path.join("/tmp", "creditask");
  }
  return path.join(process.cwd(), "data");
}

export function storeFile(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(dataRoot(env), "store.json");
}

export function uploadsRoot(env: NodeJS.ProcessEnv = process.env): string {
  return path.join(dataRoot(env), "uploads");
}
