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
  if (job.status !== "approved" && job.status !== "delivered") {
    return NextResponse.json(
      { error: "Approve the letter before marking it delivered." },
      { status: 400 },
    );
  }
  if (!job.paid) {
    return NextResponse.json(
      { error: "Payment is required before PDF deliver." },
      { status: 402 },
    );
  }
  const next = await saveJob({
    ...job,
    status: "delivered",
    deliveredAt: new Date().toISOString(),
  });
  return NextResponse.json(next);
}
