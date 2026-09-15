import { NextResponse } from "next/server";
import { allowDemo } from "@/lib/env";
import { getJob, saveJob } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!allowDemo()) {
    return NextResponse.json({ error: "Demo helpers are disabled" }, { status: 403 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    jobId?: string;
    action?: "approve" | "deliver";
  };
  const jobId = body.jobId;
  const action = body.action;
  if (!jobId || (action !== "approve" && action !== "deliver")) {
    return NextResponse.json(
      { error: "Expected { jobId, action: 'approve' | 'deliver' }" },
      { status: 400 },
    );
  }
  const job = await getJob(jobId);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    const letter = job.letterFinal || job.letterDraft;
    if (!letter) {
      return NextResponse.json({ error: "No letter to approve" }, { status: 400 });
    }
    const next = await saveJob({
      ...job,
      letterDraft: letter,
      letterFinal: letter,
      status: "approved",
    });
    return NextResponse.json(next);
  }

  if (job.status !== "approved" && job.status !== "delivered") {
    return NextResponse.json({ error: "Approve first" }, { status: 400 });
  }
  if (!job.paid) {
    return NextResponse.json({ error: "Payment required before deliver" }, { status: 402 });
  }
  const next = await saveJob({
    ...job,
    status: "delivered",
    deliveredAt: new Date().toISOString(),
  });
  return NextResponse.json(next);
}
