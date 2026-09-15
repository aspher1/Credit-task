import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "data", "uploads");

const ALLOWED_PDF = new Set(["application/pdf"]);
const ALLOWED_IMAGE = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const MAX_FILE_BYTES = 20 * 1024 * 1024;

export function uploadsDir(jobId: string): string {
  return path.join(UPLOAD_ROOT, jobId);
}

export function uploadPath(jobId: string, filename: string): string {
  const safe = safeFilename(filename);
  const resolved = path.resolve(uploadsDir(jobId), safe);
  const root = path.resolve(uploadsDir(jobId));
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error("Invalid upload path");
  }
  return resolved;
}

export function safeFilename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "file";
}

export function isPdf(file: File): boolean {
  return (
    ALLOWED_PDF.has(file.type) ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

export function isImage(file: File): boolean {
  const lower = file.name.toLowerCase();
  return (
    ALLOWED_IMAGE.has(file.type) ||
    [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"].some((ext) =>
      lower.endsWith(ext),
    )
  );
}

export async function saveUpload(
  jobId: string,
  file: File,
  kind: "pdf" | "photo",
): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name} is over the 20MB limit`);
  }
  if (kind === "pdf" && !isPdf(file)) {
    throw new Error("Inspection file must be a PDF");
  }
  if (kind === "photo" && !isImage(file)) {
    throw new Error("Photos must be JPG, PNG, WEBP, or HEIC");
  }
  const filename = `${kind}_${Date.now()}_${safeFilename(file.name)}`;
  const dir = uploadsDir(jobId);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return filename;
}
