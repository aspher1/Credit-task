import type { Job } from "@/lib/types";

/**
 * COO product lock: printable/unlocked PDF is never paid-alone.
 * Paid + draft/unapproved/rejected stays locked.
 */
export function printablePdfUnlocked(
  job: Pick<Job, "paid" | "status">,
): boolean {
  return (
    job.paid &&
    (job.status === "approved" || job.status === "delivered") &&
    job.status !== "rejected"
  );
}

export function letterIsUnapprovedDraft(
  job: Pick<Job, "status">,
): boolean {
  return job.status !== "approved" && job.status !== "delivered";
}
