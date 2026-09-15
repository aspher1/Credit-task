import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { uploadsDir } from "@/lib/files";
import { fillLetter } from "@/lib/letter";
import type { Job, PaymentRecord, Triage } from "@/lib/types";

export const EXAMPLE_JOB_ID = "example";
export const EXAMPLE_PAYMENT_ID = "pay_example";

const SAMPLE_PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 92>>stream
BT /F1 12 Tf 72 720 Td (EXAMPLE DATA — sample home inspection notes for CreditAsk demo) Tj ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF
`;

export function exampleTriage(): Triage {
  return {
    source: "stub",
    ask_type: "repair_credit",
    estimate_band:
      "Estimate only: modest closing credit typical for mixed repair items — no dollar figure invented from this example file.",
    issues: [
      {
        title: "Roof flashing / moisture staining",
        severity: "high",
        evidence:
          "EXAMPLE DATA — inspector notes staining at the chimney cricket; recommend licensed roofer evaluation.",
        suggested_ask:
          "Seller credit toward licensed roof repair, or repair prior to closing.",
      },
      {
        title: "GFCI protection missing at garage receptacles",
        severity: "med",
        evidence:
          "EXAMPLE DATA — electrical section flags non-GFCI outlets in garage.",
        suggested_ask: "Repair by a licensed electrician before closing.",
      },
      {
        title: "Bathroom exhaust fan inoperative",
        severity: "low",
        evidence: "EXAMPLE DATA — mechanical notes; fan did not operate when tested.",
        suggested_ask: "Repair or credit for replacement and moisture control.",
      },
    ],
    missing_info: [
      "Contractor bids not attached (keep estimate band qualitative).",
      "Confirm which items the buyer wants to prioritize vs. waive.",
    ],
    risks: [
      "Example job only — do not treat findings as a real inspection.",
      "Thin dollar basis: do not invent a specific credit amount.",
    ],
  };
}

export function seedExamplePayment(): PaymentRecord {
  return {
    id: EXAMPLE_PAYMENT_ID,
    createdAt: new Date().toISOString(),
    mode: "demo",
    status: "paid",
    amountCents: 7900,
    jobId: EXAMPLE_JOB_ID,
  };
}

export function seedExampleJob(): Job {
  const now = new Date().toISOString();
  const job: Job = {
    id: EXAMPLE_JOB_ID,
    createdAt: now,
    updatedAt: now,
    status: "draft_ready",
    example: true,
    paid: true,
    paymentId: EXAMPLE_PAYMENT_ID,
    paymentMode: "demo",
    address: "123 Example Lane, Springfield, IL 62701",
    buyerName: "Jordan Lee",
    askTargetRole: "agent",
    askTargetName: "Alex Rivera",
    askIntent: "repair_credit",
    deadline: undefined,
    pdfFilename: "pdf_sample-inspection.pdf",
    photoFilenames: [],
    triage: exampleTriage(),
    letterDraft: "",
    reviseCount: 0,
  };
  job.letterDraft = fillLetter(job, job.triage!);
  return job;
}

export async function writeExamplePdf(): Promise<void> {
  const dir = uploadsDir(EXAMPLE_JOB_ID);
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "pdf_sample-inspection.pdf"),
    SAMPLE_PDF,
    "utf8",
  );
}
