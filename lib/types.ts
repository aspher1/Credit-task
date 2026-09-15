export const JOB_STATUSES = [
  "intake_received",
  "triaged",
  "draft_ready",
  "approved",
  "delivered",
  "rejected",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export const ASK_TARGET_ROLES = [
  "seller",
  "agent",
  "landlord",
  "other",
] as const;

export type AskTargetRole = (typeof ASK_TARGET_ROLES)[number];

export const ASK_INTENTS = [
  "repair_credit",
  "price_reduction",
  "close_credit",
  "landlord_fix",
  "other",
] as const;

export type AskIntent = (typeof ASK_INTENTS)[number];

export const SEVERITIES = ["low", "med", "high"] as const;
export type Severity = (typeof SEVERITIES)[number];

export type AskType =
  | "repair_credit"
  | "price_reduction"
  | "landlord_remedy"
  | "other";

export type TriageIssue = {
  title: string;
  severity: Severity;
  evidence: string;
  suggested_ask: string;
};

export type Triage = {
  issues: TriageIssue[];
  ask_type: AskType;
  estimate_band: string | null;
  missing_info: string[];
  risks: string[];
  source: "llm" | "stub";
  model?: string;
};

export type PaymentMode = "stripe" | "demo" | "unpaid";

export type PaymentRecord = {
  id: string;
  createdAt: string;
  mode: "stripe" | "demo";
  status: "pending" | "paid";
  amountCents: number;
  stripeSessionId?: string;
  jobId?: string;
};

export type Job = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: JobStatus;
  example?: boolean;
  paid: boolean;
  paymentId?: string;
  paymentMode: PaymentMode;
  address: string;
  buyerName: string;
  askTargetRole: AskTargetRole;
  askTargetName: string;
  askIntent: AskIntent;
  askIntentOther?: string;
  deadline?: string;
  pdfFilename?: string;
  photoFilenames: string[];
  triage?: Triage;
  letterDraft: string;
  letterFinal?: string;
  reviseNotes?: string;
  reviseCount: number;
  rejectReason?: string;
  deliveredAt?: string;
};

export type StoreData = {
  jobs: Job[];
  payments: PaymentRecord[];
};

export function intentLabel(intent: AskIntent, other?: string): string {
  switch (intent) {
    case "repair_credit":
      return "repair credit at closing";
    case "price_reduction":
      return "price reduction";
    case "close_credit":
      return "closing credit";
    case "landlord_fix":
      return "landlord repair / remedy";
    case "other":
      return other?.trim() || "other";
  }
}

export function roleLabel(role: AskTargetRole): string {
  switch (role) {
    case "seller":
      return "Seller";
    case "agent":
      return "Listing agent";
    case "landlord":
      return "Landlord";
    case "other":
      return "Other";
  }
}

export function statusLabel(status: JobStatus): string {
  switch (status) {
    case "intake_received":
      return "Intake received";
    case "triaged":
      return "Triaged";
    case "draft_ready":
      return "Draft ready";
    case "approved":
      return "Approved";
    case "delivered":
      return "Delivered";
    case "rejected":
      return "Rejected";
  }
}
