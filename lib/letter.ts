import { intentLabel, roleLabel, type Job, type Triage } from "@/lib/types";

function today(): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function sanitizeIssueText(text: string): string {
  return text
    .replace(/\b(sue|lawsuit|legal action|attorney['’]?s? fees|take you to court)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function issueLines(triage: Triage): string {
  if (!triage.issues.length) {
    return "1. **Inspection items** — Please see the attached inspection materials. Evidence is limited in this draft; we have not invented additional findings.";
  }
  return triage.issues
    .map((issue, index) => {
      const ask = sanitizeIssueText(issue.suggested_ask);
      const evidence = sanitizeIssueText(issue.evidence);
      return `${index + 1}. **${issue.title}** — ${ask} ${evidence}`;
    })
    .join("\n");
}

export function fillLetter(
  job: Job,
  triage: Triage,
  reviseNotes?: string,
): string {
  const request = intentLabel(job.askIntent, job.askIntentOther);
  const deadlineBit = job.deadline
    ? ` by ${job.deadline}`
    : "";
  const estimate =
    triage.estimate_band &&
    /estimate/i.test(triage.estimate_band) &&
    !/\$\s*\d/.test(triage.estimate_band)
      ? ` ${triage.estimate_band}`
      : triage.estimate_band && /estimate/i.test(triage.estimate_band)
        ? " Estimate only — no specific dollar amount is stated here."
        : "";
  const revise =
    reviseNotes?.trim()
      ? `\n\n(Reviewer notes incorporated: ${reviseNotes.trim()})\n`
      : "";

  return `${today()}

${job.askTargetName}
${roleLabel(job.askTargetRole)}
Re: Inspection follow-up — ${job.address}

Dear ${job.askTargetName},

I am writing regarding the inspection for **${job.address}**. Based on the report and supporting materials, the following items need attention:

${issueLines(triage)}
${revise}
**Request:** ${request.charAt(0).toUpperCase() + request.slice(1)}.${estimate}

Please confirm how you would like to resolve these items${deadlineBit}. I am prepared to move forward once we have a written agreement on the above.

Sincerely,
${job.buyerName}
Prepared with CreditAsk`;
}

export function letterHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return withBold
    .split("\n")
    .map((line) => (line.trim() === "" ? "<br />" : `<p>${line}</p>`))
    .join("\n");
}
