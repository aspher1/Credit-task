import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type { Job } from "./types";

/** Bearer tokens are issued once per intake and are never returned by job APIs. */
export function issueJobAccess(): { token: string; hash: string } {
  const token = randomBytes(32).toString("hex");
  return { token, hash: hashJobAccess(token) };
}

export function hashJobAccess(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function jobAccessCookieName(jobId: string): string {
  return `creditask_job_${jobId}`;
}

export function hasJobAccess(
  job: Pick<Job, "accessTokenHash" | "example">,
  token: string | undefined,
  isAdmin: boolean,
  demoEnabled: boolean,
): boolean {
  if (isAdmin) return true;
  if (demoEnabled && job.example) return true;
  if (!token || !job.accessTokenHash || !/^[a-f0-9]{64}$/i.test(job.accessTokenHash)) return false;
  const expected = Buffer.from(job.accessTokenHash, "hex");
  const submitted = Buffer.from(hashJobAccess(token), "hex");
  return timingSafeEqual(submitted, expected);
}
