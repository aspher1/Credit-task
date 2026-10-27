import { NextResponse } from "next/server";
import { getJob } from "@/lib/store";
import { canReadJob } from "@/lib/job-authorization";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(await canReadJob(job))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const safeJob = { ...job };
  delete safeJob.accessTokenHash;
  return NextResponse.json(safeJob);
}
