import { NextResponse } from "next/server";
import { allowDemo, appUrl } from "@/lib/env";
import { writeExamplePdf, EXAMPLE_JOB_ID } from "@/lib/seed";
import { getJob, listJobs } from "@/lib/store";

export const runtime = "nodejs";

export async function POST() {
  if (!allowDemo()) {
    return NextResponse.json({ error: "Demo setup is disabled" }, { status: 403 });
  }
  await writeExamplePdf();
  await listJobs();
  const example = await getJob(EXAMPLE_JOB_ID);
  const origin = appUrl();
  return NextResponse.json({
    ok: true,
    exampleJobId: example?.id ?? EXAMPLE_JOB_ID,
    urls: {
      landing: `${origin}/`,
      pay: `${origin}/pay`,
      intake: `${origin}/intake`,
      exampleJob: `${origin}/jobs/${EXAMPLE_JOB_ID}`,
      approve: `${origin}/jobs/${EXAMPLE_JOB_ID}/approve`,
      pdf: `${origin}/jobs/${EXAMPLE_JOB_ID}/pdf`,
      admin: `${origin}/admin/login`,
    },
    admin: {
      email: process.env.ADMIN_EMAIL || "admin@creditask.local",
      passwordHint: "ADMIN_PASSWORD from .env.local (default changeme)",
    },
    note: "Example job is labeled EXAMPLE DATA. PDF download is gated until approved + paid; the example job is already paid and draft_ready — approve it, then open /pdf.",
  });
}
