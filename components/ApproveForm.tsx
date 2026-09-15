"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveForm({
  jobId,
  letter,
  reviseUsed,
}: {
  jobId: string;
  letter: string;
  reviseUsed: boolean;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(letter);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  async function post(path: string, body: Record<string, string>) {
    setError(null);
    setPending(path);
    try {
      const response = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(json.error || "Request failed");
      router.refresh();
      if (path.endsWith("/approve") || path.endsWith("/deliver")) {
        router.push(`/jobs/${jobId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-[var(--navy)]">Letter preview (editable)</span>
        <textarea
          className="input mt-2 min-h-[28rem] font-serif leading-7"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[var(--navy)]">Revise notes / reject reason</span>
        <textarea
          className="input mt-2 min-h-[6rem]"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes for one revise loop, or a reject reason"
        />
      </label>
      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          className="btn-primary"
          disabled={!!pending}
          type="button"
          onClick={() => post(`/api/jobs/${jobId}/approve`, { letter: draft })}
        >
          {pending?.endsWith("/approve") ? "Approving…" : "Approve"}
        </button>
        <button
          className="btn-secondary"
          disabled={!!pending || reviseUsed}
          type="button"
          title={reviseUsed ? "One revise loop already used" : undefined}
          onClick={() =>
            post(`/api/jobs/${jobId}/revise`, {
              notes: notes || "Please tighten evidence language and keep estimates conservative.",
            })
          }
        >
          {reviseUsed ? "Revise used" : pending?.endsWith("/revise") ? "Revising…" : "Revise"}
        </button>
        <button
          className="btn-danger"
          disabled={!!pending}
          type="button"
          onClick={() =>
            post(`/api/jobs/${jobId}/reject`, {
              reason: notes || "Rejected in review",
            })
          }
        >
          Reject
        </button>
        <button
          className="btn-secondary"
          disabled={!!pending}
          type="button"
          onClick={() => post(`/api/jobs/${jobId}/deliver`, {})}
        >
          Mark delivered
        </button>
      </div>
      <p className="text-xs text-[var(--muted)]">
        Approve is required before delivery. PDF download stays gated on $79 payment.
        One revise loop, then re-approve.
      </p>
    </div>
  );
}
