import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadPath } from "@/lib/files";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";

const TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".heic": "image/heic",
  ".heif": "image/heif",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ jobId: string; filename: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { jobId, filename: rawName } = await context.params;
  const filename = decodeURIComponent(rawName);
  const job = await getJob(jobId);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const allowed = [job.pdfFilename, ...job.photoFilenames].includes(filename);
  if (!allowed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const filePath = uploadPath(jobId, filename);
    const data = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();
    return new NextResponse(Uint8Array.from(data), {
      headers: {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "Content-Length": String(data.length),
      },
    });
  } catch {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }
}
