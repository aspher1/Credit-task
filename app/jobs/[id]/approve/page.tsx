import Link from "next/link";
import { notFound } from "next/navigation";
import { ApproveForm } from "@/components/ApproveForm";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { getJob } from "@/lib/store";
import { intentLabel, roleLabel } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ApprovePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();
  const letter = job.letterFinal || job.letterDraft;

  return (
    <SiteShell admin>
      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
        Human approve packet
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl text-[var(--navy)]">Job {job.id}</h1>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-2 text-[var(--muted)]">{job.address}</p>
      <div className="mt-6">
        <Disclaimer />
      </div>

      <section className="card mt-6 space-y-2 text-sm">
        <p>
          <strong>Ask target:</strong> {job.askTargetName} / {roleLabel(job.askTargetRole)}
        </p>
        <p>
          <strong>Ask intent:</strong> {intentLabel(job.askIntent, job.askIntentOther)}
        </p>
        <p>
          <strong>Payment:</strong> Stripe / demo {job.paid ? "paid" : "unpaid"} ·{" "}
          {job.paymentMode}
        </p>
        <p>
          <strong>Attachments:</strong> PDF {job.pdfFilename ? "yes" : "no"}; photos{" "}
          {job.photoFilenames.length}
        </p>
        {job.pdfFilename ? (
          <p>
            <Link className="underline" href={`/api/files/${job.id}/${job.pdfFilename}`}>
              Open inspection PDF
            </Link>
          </p>
        ) : null}
        {job.photoFilenames.length ? (
          <ul className="list-disc pl-5">
            {job.photoFilenames.map((name) => (
              <li key={name}>
                <Link className="underline" href={`/api/files/${job.id}/${name}`}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      {job.triage ? (
        <section className="card mt-6 space-y-2 text-sm">
          <h2 className="font-serif text-xl text-[var(--navy)]">Triage summary</h2>
          <p>Ask type: {job.triage.ask_type}</p>
          <p>Estimate band: {job.triage.estimate_band || "none"} (estimate only)</p>
          <p>
            Top issues:{" "}
            {job.triage.issues.map((issue) => issue.title).join("; ") || "none"}
          </p>
          <p>Missing info / risks: {[...job.triage.missing_info, ...job.triage.risks].join(" · ")}</p>
        </section>
      ) : null}

      <section className="mt-6">
        <h2 className="font-serif text-xl text-[var(--navy)]">Decision</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Approve → generate PDF after paid. Revise notes, then re-approve (one loop).
          Reject with a reason.
        </p>
        <div className="mt-4">
          <ApproveForm
            jobId={job.id}
            letter={letter}
            reviseUsed={job.reviseCount >= 1}
          />
        </div>
      </section>
    </SiteShell>
  );
}
