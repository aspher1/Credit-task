"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { approveCheckbox } from "@/lib/copy";

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
  const [understood, setUnderstood] = useState(false);

  async function post(path: string, body: Record<string, string | boolean>) {
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
      <div className="space-y-2">
        <Label htmlFor="letter">Letter preview (editable)</Label>
        <Textarea
          id="letter"
          className="min-h-[28rem] font-serif leading-7"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Revise notes / reject reason</Label>
        <Textarea
          id="notes"
          className="min-h-[6rem]"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional notes for one revise loop, or a reject reason"
        />
      </div>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <label className="flex items-start gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="mt-1"
          checked={understood}
          onChange={(event) => setUnderstood(event.target.checked)}
          name="understood"
          required
        />
        <span>{approveCheckbox}</span>
      </label>
      <div className="flex flex-wrap gap-3">
        <Button
          disabled={!!pending || !understood}
          type="button"
          onClick={() =>
            post(`/api/jobs/${jobId}/approve`, { letter: draft, understood: true })
          }
        >
          {pending?.endsWith("/approve") ? "Approving…" : "Approve"}
        </Button>
        <Button
          variant="outline"
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
        </Button>
        <Button
          variant="destructive"
          disabled={!!pending}
          type="button"
          onClick={() =>
            post(`/api/jobs/${jobId}/reject`, {
              reason: notes || "Rejected in review",
            })
          }
        >
          Reject
        </Button>
        <Button
          variant="outline"
          disabled={!!pending}
          type="button"
          onClick={() => post(`/api/jobs/${jobId}/deliver`, {})}
        >
          Mark delivered
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Approve is required before delivery. PDF download stays gated on $79 payment.
        One revise loop, then re-approve. We don’t send this letter to the seller.
      </p>
    </div>
  );
}
