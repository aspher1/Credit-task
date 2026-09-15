import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { advanceToDraft } from "@/lib/pipeline";
import { getJob, saveJob } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await context.params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.reviseCount >= 1) {
    return NextResponse.json(
      { error: "One revise loop already used. Approve or reject." },
      { status: 400 },
    );
  }
  const body = (await request.json().catch(() => ({}))) as { notes?: string };
  const notes = (body.notes || "").trim();
  if (!notes) {
    return NextResponse.json({ error: "Revise notes are required." }, { status: 400 });
  }
  const drafted = await advanceToDraft(
    { ...job, status: "intake_received", letterFinal: undefined },
    notes,
  );
  const next = await saveJob({
    ...drafted,
    reviseCount: job.reviseCount + 1,
    reviseNotes: notes,
    status: "draft_ready",
  });
  return NextResponse.json(next);
}
