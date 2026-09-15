import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Disclaimer } from "@/components/Disclaimer";
import { JobProgress } from "@/components/JobProgress";
import { LetterPreview } from "@/components/LetterPreview";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paywall, product } from "@/lib/copy";
import { getJob } from "@/lib/store";
import { intentLabel, roleLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();
  const session = await auth();
  const isAdmin = !!session?.user;
  const letter = job.letterFinal || job.letterDraft;
  const ready = job.status === "draft_ready" || job.status === "approved" || job.status === "delivered";
  const approved = job.status === "approved" || job.status === "delivered";
  const canOpenPdf = !!letter && (job.paid || approved);

  return (
    <SiteShell>
      {job.example ? (
        <p className="mb-4 rounded-md border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-700">
          <strong>Example data</strong> — fake address and sample issues for the demo path.
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Job {job.id}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
            {job.address}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={job.status} />
            <span className="text-sm text-muted-foreground">
              Payment: {job.paid ? "paid (test/demo)" : "unpaid"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Button variant="outline" asChild>
              <Link href={`/jobs/${job.id}/approve`}>Review / approve</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/admin/login">Admin review</Link>
            </Button>
          )}
          {canOpenPdf ? (
            <Button asChild>
              <Link href={`/jobs/${job.id}/pdf`}>Open printable letter</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <JobProgress status={job.status} />
      </div>

      {ready ? (
        <p className="mt-4 text-sm text-stone-700">{product.successSend}</p>
      ) : null}

      <div className="mt-8">
        <Disclaimer />
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Item label="Buyer / from-line" value={job.buyerName} />
        <Item
          label="Ask target"
          value={`${job.askTargetName} · ${roleLabel(job.askTargetRole)}`}
        />
        <Item label="Ask intent" value={intentLabel(job.askIntent, job.askIntentOther)} />
        <Item label="Deadline" value={job.deadline || "None"} />
        <Item label="Inspection PDF" value={job.pdfFilename ? "yes (private)" : "no"} />
        <Item label="Photos" value={String(job.photoFilenames.length)} />
      </dl>

      {job.triage ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Triage summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Source: {job.triage.source}
              {job.triage.model ? ` (${job.triage.model})` : ""}. No invented dollar
              amounts.
            </p>
            <p>
              <strong>Ask type:</strong> {job.triage.ask_type.replace(/_/g, " ")}
            </p>
            <p>
              <strong>Estimate band:</strong>{" "}
              {job.triage.estimate_band || "none (no dollar amount invented)"}
            </p>
            <ul className="list-disc space-y-1 pl-5">
              {job.triage.issues.map((issue) => (
                <li key={issue.title}>
                  <strong>{issue.title}</strong> ({issue.severity}) — {issue.evidence}
                </li>
              ))}
            </ul>
            {job.triage.missing_info.length ? (
              <p>
                <strong>Missing info:</strong> {job.triage.missing_info.join(" · ")}
              </p>
            ) : null}
            {job.triage.risks.length ? (
              <p>
                <strong>Risks:</strong> {job.triage.risks.join(" · ")}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">Triage has not run yet.</p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-stone-900">Letter draft</h2>
        <p className="mt-1 text-sm text-muted-foreground">{product.successSend}</p>
        <div className="mt-4 overflow-x-auto">
          {letter ? (
            <LetterPreview text={letter} draft={!approved} />
          ) : (
            <p>No draft yet.</p>
          )}
        </div>
      </section>

      {!job.paid ? (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{paywall.headline}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{paywall.body}</p>
            <Button className="mt-4" asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">{paywall.finePrint}</p>
          </CardContent>
        </Card>
      ) : null}
    </SiteShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
