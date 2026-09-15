import { draftLetter, runTriage } from "@/lib/triage";
import type { Job } from "@/lib/types";

export async function advanceToDraft(job: Job, reviseNotes?: string): Promise<Job> {
  const next: Job = { ...job, status: "intake_received" };
  const triage = await runTriage(next, reviseNotes);
  next.triage = triage;
  next.status = "triaged";
  next.letterDraft = await draftLetter(next, triage, reviseNotes);
  if (reviseNotes) next.reviseNotes = reviseNotes;
  next.status = "draft_ready";
  return next;
}
