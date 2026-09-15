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
  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const reason = (body.reason || "").trim();
  if (!reason) {
    return NextResponse.json({ error: "Reject reason is required." }, { status: 400 });
  }
  const next = await saveJob({
    ...job,
    status: "rejected",
    rejectReason: reason,
  });
  return NextResponse.json(next);
}
