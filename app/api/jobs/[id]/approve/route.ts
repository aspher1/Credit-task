import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
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
  if (job.status === "rejected") {
    return NextResponse.json({ error: "Rejected jobs cannot be approved." }, { status: 400 });
  }
  const body = (await request.json().catch(() => ({}))) as { letter?: string };
  const letter = (body.letter || job.letterDraft || "").trim();
  if (!letter) {
    return NextResponse.json({ error: "Letter is empty." }, { status: 400 });
  }
  const next = await saveJob({
    ...job,
    letterDraft: letter,
    letterFinal: letter,
    status: "approved",
  });
  return NextResponse.json(next);
}
