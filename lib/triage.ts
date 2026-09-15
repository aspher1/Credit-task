import { triageSystem } from "@/lib/copy";
import { llmConfig } from "@/lib/env";
import { fillLetter } from "@/lib/letter";
import {
  intentLabel,
  type AskType,
  type Job,
  type Severity,
  type Triage,
  type TriageIssue,
} from "@/lib/types";

function stubTriage(job: Job): Triage {
  const evidenceBase = job.pdfFilename
    ? "Referenced against the uploaded inspection PDF (filename only in stub mode; contents not parsed)."
    : `${job.photoFilenames.length} photo(s) uploaded; treat as visual support, not a full report.`;

  const askType: AskType =
    job.askIntent === "price_reduction"
      ? "price_reduction"
      : job.askIntent === "landlord_fix"
        ? "landlord_remedy"
        : job.askIntent === "other"
          ? "other"
          : "repair_credit";

  const issues: TriageIssue[] = [
    {
      title: "Priority inspection item (stub)",
      severity: "high",
      evidence: evidenceBase,
      suggested_ask: `Address via ${intentLabel(job.askIntent, job.askIntentOther)}; confirm against the report before sending.`,
    },
    {
      title: "Secondary defect / deferred maintenance (stub)",
      severity: "med",
      evidence:
        "Stub triage lists a conservative second item so the letter has structure. Do not treat as a real finding.",
      suggested_ask: "Repair by a licensed trade or a modest closing credit if the seller prefers not to repair.",
    },
    {
      title: "Documentation gap",
      severity: "low",
      evidence: "No contractor bids or page-cited cost basis were provided at intake.",
      suggested_ask: "Keep the ask qualitative unless the buyer later supplies estimates.",
    },
  ];

  if (job.photoFilenames.length && !job.pdfFilename) {
    issues.push({
      title: "Photo-only file set",
      severity: "med",
      evidence:
        "No PDF report was uploaded. Photos can support a letter but often miss context (location, cause, severity ratings).",
      suggested_ask: "Ask for repairs/credit only on items clearly visible; flag the rest as missing info.",
    });
  }

  return {
    source: "stub",
    ask_type: askType,
    estimate_band: null,
    issues,
    missing_info: [
      job.pdfFilename
        ? "PDF was stored privately; stub mode did not extract page-level notes."
        : "Full inspection PDF not provided.",
      "No third-party repair bids attached.",
      job.deadline ? undefined : "No response deadline set (optional).",
    ].filter(Boolean) as string[],
    risks: [
      "Offline stub triage — not a substitute for reading the inspection.",
      "No dollar amounts invented.",
      "Health/safety items should be verified in the actual report before sending.",
    ],
  };
}

function asSeverity(value: unknown): Severity {
  return value === "high" || value === "low" || value === "med" ? value : "med";
}

function asAskType(value: unknown): AskType {
  if (
    value === "repair_credit" ||
    value === "price_reduction" ||
    value === "landlord_remedy" ||
    value === "other"
  ) {
    return value;
  }
  return "other";
}

function normalizeTriage(raw: unknown, fallback: Triage): Triage {
  if (!raw || typeof raw !== "object") return fallback;
  const data = raw as Record<string, unknown>;
  const issuesIn = Array.isArray(data.issues) ? data.issues : [];
  const issues: TriageIssue[] = issuesIn
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const issue = item as Record<string, unknown>;
      const title = String(issue.title ?? "").trim();
      if (!title) return null;
      return {
        title,
        severity: asSeverity(issue.severity),
        evidence: String(issue.evidence ?? "").trim() || "See inspection materials.",
        suggested_ask:
          String(issue.suggested_ask ?? "").trim() ||
          "Conservative repair or credit; do not invent a dollar amount.",
      };
    })
    .filter((item): item is TriageIssue => item !== null);

  return {
    source: "llm",
    model: fallback.model,
    issues: issues.length ? issues : fallback.issues,
    ask_type: asAskType(data.ask_type),
    estimate_band:
      data.estimate_band === null || data.estimate_band === undefined
        ? null
        : String(data.estimate_band),
    missing_info: Array.isArray(data.missing_info)
      ? data.missing_info.map((item) => String(item))
      : fallback.missing_info,
    risks: Array.isArray(data.risks)
      ? data.risks.map((item) => String(item))
      : fallback.risks,
  };
}

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(body.slice(start, end + 1));
}

async function completeChat(
  system: string,
  user: string,
): Promise<{ text: string; model: string } | null> {
  const { xaiKey, xaiModel, openaiKey, openaiModel } = llmConfig();

  const call = async (
    url: string,
    key: string,
    model: string,
  ): Promise<{ text: string; model: string }> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`LLM HTTP ${response.status}: ${err.slice(0, 200)}`);
    }
    const json = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = json.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty LLM response");
    return { text, model };
  };

  try {
    if (xaiKey) {
      return await call("https://api.x.ai/v1/chat/completions", xaiKey, xaiModel);
    }
    if (openaiKey) {
      return await call(
        "https://api.openai.com/v1/chat/completions",
        openaiKey,
        openaiModel,
      );
    }
  } catch (error) {
    console.warn("LLM triage failed; using stub.", error);
    return null;
  }
  return null;
}

function jobPrompt(job: Job, extra?: string): string {
  return [
    `Property address: ${job.address}`,
    `Buyer/client name: ${job.buyerName}`,
    `Ask target: ${job.askTargetName} (${job.askTargetRole})`,
    `Ask intent: ${intentLabel(job.askIntent, job.askIntentOther)}`,
    job.deadline ? `Deadline: ${job.deadline}` : "Deadline: none",
    `Inspection PDF uploaded: ${job.pdfFilename ? "yes — " + job.pdfFilename : "no"}`,
    `Photos uploaded: ${job.photoFilenames.length} (${job.photoFilenames.join(", ") || "none"})`,
    extra ? `Reviewer notes: ${extra}` : "",
    "PDF/photo bytes are stored privately and are not inlined here.",
    "Do not invent dollar amounts. Do not threaten legal action.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function runTriage(job: Job, extra?: string): Promise<Triage> {
  const fallback = stubTriage(job);
  const llm = await completeChat(triageSystem, jobPrompt(job, extra));
  if (!llm) return fallback;
  try {
    const parsed = extractJson(llm.text);
    return normalizeTriage(parsed, { ...fallback, model: llm.model, source: "llm" });
  } catch (error) {
    console.warn("Could not parse LLM JSON; using stub.", error);
    return fallback;
  }
}

export async function draftLetter(
  job: Job,
  triage: Triage,
  reviseNotes?: string,
): Promise<string> {
  return fillLetter(job, triage, reviseNotes);
}
