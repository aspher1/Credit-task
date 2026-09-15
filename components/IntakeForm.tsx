"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { intakeHelp, product } from "@/lib/copy";
import {
  ASK_INTENTS,
  ASK_TARGET_ROLES,
  intentLabel,
  roleLabel,
  type AskIntent,
  type AskTargetRole,
} from "@/lib/types";

export function IntakeForm({
  paymentId,
  paid,
}: {
  paymentId?: string;
  paid: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [intent, setIntent] = useState<AskIntent>("repair_credit");
  const [role, setRole] = useState<AskTargetRole>("seller");
  const [pdfName, setPdfName] = useState("");
  const [photoCount, setPhotoCount] = useState(0);

  const fileHint = useMemo(() => {
    if (pdfName && photoCount) return `${pdfName} + ${photoCount} photo(s)`;
    if (pdfName) return pdfName;
    if (photoCount) return `${photoCount} photo(s)`;
    return "Add a PDF or photos to continue";
  }, [pdfName, photoCount]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    const pdf = data.get("pdf");
    const photos = data.getAll("photos").filter((item) => item instanceof File && item.size > 0);
    const hasPdf = pdf instanceof File && pdf.size > 0;
    if (!hasPdf && photos.length === 0) {
      setError("Upload an inspection PDF or at least one photo.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/intake", { method: "POST", body: data });
      const json = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !json.id) {
        throw new Error(json.error || "Could not save intake");
      }
      router.push(`/jobs/${json.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save intake");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Disclaimer />
      {!paid ? (
        <p className="rounded-lg border border-[var(--line)] bg-[var(--cream)] px-4 py-3 text-sm">
          You can submit intake now. The PDF stays locked until {product.price} is
          paid.{" "}
          <a className="underline" href="/pay">
            Pay first
          </a>
          .
        </p>
      ) : (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          Payment on file (test/demo). After we draft your letter, a human still
          has to approve it before download.
        </p>
      )}

      {paymentId ? <input type="hidden" name="paymentId" value={paymentId} /> : null}

      <Field label="Property address" required help={intakeHelp.address}>
        <input
          required
          name="address"
          className="input"
          placeholder="123 Main St, City, ST 00000"
        />
      </Field>

      <Field label="Your name" required help={intakeHelp.buyerName}>
        <input required name="buyerName" className="input" placeholder="Jordan Lee" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ask target" required help={intakeHelp.askTarget}>
          <select
            name="askTargetRole"
            className="input"
            value={role}
            onChange={(event) => setRole(event.target.value as AskTargetRole)}
          >
            {ASK_TARGET_ROLES.map((value) => (
              <option key={value} value={value}>
                {roleLabel(value)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Ask target name" required>
          <input
            required
            name="askTargetName"
            className="input"
            placeholder="Name of seller, agent, or landlord"
          />
        </Field>
      </div>

      <Field label="What are you asking for?" required help={intakeHelp.askIntent}>
        <select
          name="askIntent"
          className="input"
          value={intent}
          onChange={(event) => setIntent(event.target.value as AskIntent)}
        >
          {ASK_INTENTS.map((value) => (
            <option key={value} value={value}>
              {intentLabel(value)}
            </option>
          ))}
        </select>
      </Field>

      {intent === "other" ? (
        <Field label="Describe the ask">
          <input name="askIntentOther" className="input" placeholder="Other ask in plain language" />
        </Field>
      ) : null}

      <Field label="Deadline (optional)" help={intakeHelp.deadline}>
        <input type="date" name="deadline" className="input" />
      </Field>

      <Field label="Inspection PDF" help={intakeHelp.pdf}>
        <input
          type="file"
          name="pdf"
          accept="application/pdf,.pdf"
          className="input-file"
          onChange={(event) => setPdfName(event.target.files?.[0]?.name ?? "")}
        />
      </Field>

      <Field label="Inspection photos" help={intakeHelp.photos}>
        <input
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
          multiple
          className="input-file"
          onChange={(event) => setPhotoCount(event.target.files?.length ?? 0)}
        />
        <p className="mt-2 text-xs text-[var(--muted)]">{fileHint}</p>
      </Field>

      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {error}
        </p>
      ) : null}

      <button className="btn-primary" disabled={pending} type="submit">
        {pending ? "Saving & drafting…" : "Submit inspection pack"}
      </button>
    </form>
  );
}

function Field({
  label,
  help,
  required,
  children,
}: {
  label: string;
  help?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[var(--navy)]">
        {label}
        {required ? <span className="text-[var(--accent)]"> *</span> : null}
      </span>
      {help ? <span className="mt-1 block text-sm text-[var(--muted)]">{help}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}
