import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { saveUpload } from "@/lib/files";
import { advanceToDraft } from "@/lib/pipeline";
import { attachPaymentToJob, getPayment, newId, saveJob } from "@/lib/store";
import { writeExamplePdf } from "@/lib/seed";
import { issueJobAccess, jobAccessCookieName } from "@/lib/job-access";
import {
  ASK_INTENTS,
  ASK_TARGET_ROLES,
  type AskIntent,
  type AskTargetRole,
  type Job,
} from "@/lib/types";

export const runtime = "nodejs";

function isIntent(value: string): value is AskIntent {
  return (ASK_INTENTS as readonly string[]).includes(value);
}

function isRole(value: string): value is AskTargetRole {
  return (ASK_TARGET_ROLES as readonly string[]).includes(value);
}

export async function POST(request: Request) {
  await writeExamplePdf();
  const form = await request.formData();
  const address = String(form.get("address") ?? "").trim();
  const buyerName = String(form.get("buyerName") ?? "").trim();
  const askTargetName = String(form.get("askTargetName") ?? "").trim();
  const askTargetRoleRaw = String(form.get("askTargetRole") ?? "seller");
  const askIntentRaw = String(form.get("askIntent") ?? "repair_credit");
  const askIntentOther = String(form.get("askIntentOther") ?? "").trim();
  const deadline = String(form.get("deadline") ?? "").trim();
  const paymentIdFromForm = String(form.get("paymentId") ?? "").trim();
  const jar = await cookies();
  // A submitted ID alone is not proof that this buyer owns a payment record.
  const paymentId = jar.get("creditask_payment")?.value;
  if (paymentIdFromForm && paymentIdFromForm !== paymentId) {
    return NextResponse.json({ error: "Payment session mismatch. Start from checkout." }, { status: 400 });
  }

  if (!address || !buyerName || !askTargetName) {
    return NextResponse.json(
      { error: "Address, buyer name, and ask target name are required." },
      { status: 400 },
    );
  }
  if (!isRole(askTargetRoleRaw) || !isIntent(askIntentRaw)) {
    return NextResponse.json({ error: "Invalid ask target or intent." }, { status: 400 });
  }

  const pdf = form.get("pdf");
  const photos = form
    .getAll("photos")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const hasPdf = pdf instanceof File && pdf.size > 0;
  if (!hasPdf && photos.length === 0) {
    return NextResponse.json(
      { error: "Upload an inspection PDF or at least one photo." },
      { status: 400 },
    );
  }

  const id = newId("job");
  const jobAccess = issueJobAccess();
  const now = new Date().toISOString();
  let pdfFilename: string | undefined;
  const photoFilenames: string[] = [];

  try {
    if (hasPdf) pdfFilename = await saveUpload(id, pdf, "pdf");
    for (const photo of photos) {
      photoFilenames.push(await saveUpload(id, photo, "photo"));
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }

  const payment = paymentId ? await getPayment(paymentId) : null;

  let job: Job = {
    id,
    accessTokenHash: jobAccess.hash,
    createdAt: now,
    updatedAt: now,
    status: "intake_received",
    paid: payment?.status === "paid",
    paymentId: payment?.id,
    paymentMode: payment ? payment.mode : "unpaid",
    address,
    buyerName,
    askTargetRole: askTargetRoleRaw,
    askTargetName,
    askIntent: askIntentRaw,
    askIntentOther: askIntentOther || undefined,
    deadline: deadline || undefined,
    pdfFilename,
    photoFilenames,
    letterDraft: "",
    reviseCount: 0,
  };

  job = await advanceToDraft(job);
  job = await saveJob(job);
  if (payment) await attachPaymentToJob(payment.id, job.id);

  jar.set(jobAccessCookieName(id), jobAccess.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.APP_URL?.startsWith("https://") === true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ id: job.id, status: job.status });
}
