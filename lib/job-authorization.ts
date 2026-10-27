import { cookies } from "next/headers";
import { auth } from "@/auth";
import { allowDemo } from "@/lib/env";
import { hasJobAccess, jobAccessCookieName } from "@/lib/job-access";
import type { Job } from "@/lib/types";

/** Owner cookie or admin session, with a synthetic-only local demo exception. */
export async function canReadJob(job: Job): Promise<boolean> {
  const session = await auth();
  const jar = await cookies();
  return hasJobAccess(
    job,
    jar.get(jobAccessCookieName(job.id))?.value,
    Boolean(session?.user),
    allowDemo(),
  );
}
