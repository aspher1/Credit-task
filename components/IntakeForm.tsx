"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { intakeHelp, intakeSteps, product, shortCompliance, uploadPrivacy } from "@/lib/copy";
import {
  ASK_INTENTS,
  ASK_TARGET_ROLES,
  roleLabel,
  type AskIntent,
  type AskTargetRole,
} from "@/lib/types";
import { cn } from "@/lib/utils";

export function IntakeForm({
  paymentId,
  paid,
}: {
  paymentId?: string;
  paid: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [intent, setIntent] = useState<AskIntent>("repair_credit");
  const [role, setRole] = useState<AskTargetRole>("seller");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const progress = ((step + 1) / intakeSteps.length) * 100;
  const fileHint = useMemo(() => {
    if (pdfFile && photos.length) return `${pdfFile.name} + ${photos.length} photo(s)`;
    if (pdfFile) return pdfFile.name;
    if (photos.length) return `${photos.length} photo(s)`;
    return "Add a PDF or photos to continue";
  }, [pdfFile, photos.length]);

  function onPdfFiles(files: FileList | File[] | null) {
    const file = files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Inspection file must be a PDF.");
      return;
    }
    setError(null);
    setPdfFile(file);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < intakeSteps.length - 1) {
      if (step === 1 && !pdfFile && photos.length === 0) {
        setError("Upload an inspection PDF or at least one photo.");
        return;
      }
      setError(null);
      setStep((current) => current + 1);
      return;
    }
    setError(null);
    if (!pdfFile && photos.length === 0) {
      setError("Upload an inspection PDF or at least one photo.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    if (pdfFile) data.set("pdf", pdfFile);
    else data.delete("pdf");
    data.delete("photos");
    for (const photo of photos) data.append("photos", photo);
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
      <div className="space-y-3">
        <Progress value={progress} />
        <ol className="flex justify-between text-[0.7rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {intakeSteps.map((item, index) => (
            <li key={item.key} className={index <= step ? "text-foreground" : undefined}>
              {item.label}
            </li>
          ))}
        </ol>
      </div>

      {paymentId ? <input type="hidden" name="paymentId" value={paymentId} /> : null}
      <input type="hidden" name="askIntent" value={intent} />
      <input type="hidden" name="askTargetRole" value={role} />

      <div className={step === 0 ? "space-y-5" : "hidden"}>
        <p className="text-sm text-muted-foreground">{shortCompliance}</p>
        <Field label="Property address" required help={intakeHelp.address}>
          <Input required name="address" placeholder="123 Main St, City, ST 00000" />
        </Field>
        <Field label="Your name" required help={intakeHelp.buyerName}>
          <Input required name="buyerName" placeholder="Jordan Lee" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ask target" required help={intakeHelp.askTarget}>
            <select
              className="flex h-12 w-full rounded-sm border border-input bg-card px-3.5 text-sm"
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
            <Input required name="askTargetName" placeholder="Name of seller, agent, or landlord" />
          </Field>
        </div>
      </div>

      <div className={step === 1 ? "space-y-5" : "hidden"}>
        <Field label="Inspection PDF">
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              onPdfFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-[var(--rule-strong)] bg-[var(--paper)] px-4 py-12 text-center text-sm text-muted-foreground",
              dragOver && "border-foreground bg-[var(--paper-2)]",
            )}
          >
            <input
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              id="pdf-drop"
              onChange={(event) => onPdfFiles(event.target.files)}
            />
            <label htmlFor="pdf-drop" className="cursor-pointer">
              <span className="font-medium text-stone-900">Drop PDF here or browse</span>
              <span className="mt-1 block">{pdfFile ? pdfFile.name : "PDF preferred"}</span>
            </label>
          </div>
          <p className="text-sm text-muted-foreground">{uploadPrivacy}</p>
        </Field>
        <Field label="Inspection photos">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
            multiple
            onChange={(event) =>
              setPhotos(Array.from(event.target.files ?? []).filter((file) => file.size > 0))
            }
          />
          <p className="text-sm text-muted-foreground">{uploadPrivacy}</p>
        </Field>
        <p className="text-xs text-muted-foreground">{fileHint}</p>
      </div>

      <div className={step === 2 ? "space-y-5" : "hidden"}>
        <div>
          <Label>Priorities</Label>
          <p className="mt-1 text-sm text-muted-foreground">{intakeHelp.askIntent}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ASK_INTENTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setIntent(value)}
                className={cn(
                  "rounded-sm border px-3 py-2 text-sm",
                  intent === value
                    ? "border-foreground bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-[var(--paper-2)]",
                )}
              >
                {chipLabel(value)}
              </button>
            ))}
          </div>
        </div>
        {intent === "other" ? (
          <Field label="Describe the ask">
            <Input name="askIntentOther" placeholder="Other ask in plain language" />
          </Field>
        ) : null}
        <Field label="Deadline (optional)" help={intakeHelp.deadline}>
          <Input type="date" name="deadline" />
        </Field>
      </div>

      <div className={step === 3 ? "space-y-4" : "hidden"}>
        {paid ? (
          <Alert variant="muted">
            <AlertDescription>
              Payment on file. After drafting, a human still has to approve before
              download. {product.successSend}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="muted">
            <AlertDescription>
              You can submit now. The final PDF stays locked until {product.price} is
              paid. {product.successSend}
            </AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-stone-600">
          We’ll take this to <strong>Received → Drafting → Ready</strong>. Submit for
          drafting when the files and priorities look right.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setError(null);
              setStep((current) => current - 1);
            }}
          >
            Back
          </Button>
        ) : null}
        <Button disabled={pending} type="submit">
          {pending
            ? "Saving & drafting…"
            : step < intakeSteps.length - 1
              ? "Continue"
              : "Submit for drafting"}
        </Button>
      </div>
    </form>
  );
}

function chipLabel(intent: AskIntent): string {
  switch (intent) {
    case "repair_credit":
      return "Repair credit";
    case "price_reduction":
      return "Price reduction";
    case "close_credit":
      return "Closing credit";
    case "landlord_fix":
      return "Landlord fix";
    case "other":
      return "Other";
  }
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
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="text-foreground"> *</span> : null}
      </Label>
      {help ? <p className="text-sm text-muted-foreground">{help}</p> : null}
      {children}
    </div>
  );
}
