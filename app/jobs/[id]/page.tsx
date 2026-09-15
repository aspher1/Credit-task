import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { Disclaimer } from "@/components/Disclaimer";
import { LetterPreview } from "@/components/LetterPreview";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
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
  const canDownload =
    job.paid &&
    (job.status === "approved" || job.status === "delivered") &&
    !!letter;

  return (
    <SiteShell admin={isAdmin}>
      {job.example ? (
        <p className="mb-4 rounded-md bg-[var(--cream)] px-3 py-2 text-sm">
          <strong>Example data</strong> — fake address and sample issues for the demo path.
        </p>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Job {job.id}</p>
          <h1 className="mt-1 font-serif text-3xl text-[var(--navy)]">{job.address}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={job.status} />
            <span className="text-sm text-[var(--muted)]">
              Payment: {job.paid ? "paid (test/demo)" : "unpaid"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Link className="btn-secondary" href={`/jobs/${job.id}/approve`}>
              Review / approve
            </Link>
          ) : (
            <Link className="btn-secondary" href="/admin/login">
              Admin review
            </Link>
          )}
          {canDownload ? (
            <Link className="btn-primary" href={`/jobs/${job.id}/pdf`}>
              Open printable letter
            </Link>
          ) : (
            <Link className="btn-secondary" href="/pay">
              {paywall.cta}
            </Link>
          )}
        </div>
      </div>

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
        <section className="card mt-8 space-y-3">
          <h2 className="font-serif text-2xl text-[var(--navy)]">Triage summary</h2>
          <p className="text-sm text-[var(--muted)]">
            Source: {job.triage.source}
            {job.triage.model ? ` (${job.triage.model})` : ""}. Estimate bands are
            estimates only.
          </p>
          <p>
            <strong>Ask type:</strong> {job.triage.ask_type.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Estimate band:</strong>{" "}
            {job.triage.estimate_band || "none (no dollar amount invented)"}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {job.triage.issues.map((issue) => (
              <li key={issue.title}>
                <strong>{issue.title}</strong> ({issue.severity}) — {issue.evidence}
              </li>
            ))}
          </ul>
          {job.triage.missing_info.length ? (
            <p className="text-sm">
              <strong>Missing info:</strong> {job.triage.missing_info.join(" · ")}
            </p>
          ) : null}
          {job.triage.risks.length ? (
            <p className="text-sm">
              <strong>Risks:</strong> {job.triage.risks.join(" · ")}
            </p>
          ) : null}
        </section>
      ) : (
        <p className="mt-8 text-sm text-[var(--muted)]">Triage has not run yet.</p>
      )}

      <section className="mt-8">
        <h2 className="font-serif text-2xl text-[var(--navy)]">Letter draft</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Draft only — not sent until human approve. {product.name} does not send this
          for you.
        </p>
        <div className="mt-4">
          {letter ? <LetterPreview text={letter} /> : <p>No draft yet.</p>}
        </div>
      </section>

      {!job.paid ? (
        <section className="card mt-8">
          <h2 className="font-serif text-2xl">{paywall.headline}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">{paywall.body}</p>
          <Link className="btn-primary mt-4" href="/pay">
            {paywall.cta}
          </Link>
          <p className="mt-3 text-xs text-[var(--muted)]">{paywall.finePrint}</p>
        </section>
      ) : null}
    </SiteShell>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <dt className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
