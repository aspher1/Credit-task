import Link from "next/link";
import { notFound } from "next/navigation";
import { ApproveForm } from "@/components/ApproveForm";
import { Disclaimer } from "@/components/Disclaimer";
import { JobProgress } from "@/components/JobProgress";
import { SiteShell } from "@/components/SiteShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { product } from "@/lib/copy";
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
    <SiteShell>
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
        Human approve packet
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          Job {job.id}
        </h1>
        <StatusBadge status={job.status} />
      </div>
      <p className="mt-2 text-muted-foreground">{job.address}</p>
      <div className="mt-6">
        <JobProgress status={job.status} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Packet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Ask target:</strong> {job.askTargetName} / {roleLabel(job.askTargetRole)}
          </p>
          <p>
            <strong>Ask intent:</strong> {intentLabel(job.askIntent, job.askIntentOther)}
          </p>
          <p>
            <strong>Payment:</strong> {job.paid ? "paid" : "unpaid"} · {job.paymentMode}
          </p>
          <p>
            <strong>Attachments:</strong> PDF {job.pdfFilename ? "yes" : "no"}; photos{" "}
            {job.photoFilenames.length}
          </p>
          <p className="text-muted-foreground">{product.successSend}</p>
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
        </CardContent>
      </Card>

      {job.triage ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Triage summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Ask type: {job.triage.ask_type}</p>
            <p>Estimate band: {job.triage.estimate_band || "none"} (estimate only)</p>
            <p>
              Top issues:{" "}
              {job.triage.issues.map((issue) => issue.title).join("; ") || "none"}
            </p>
            <p>
              Missing info / risks:{" "}
              {[...job.triage.missing_info, ...job.triage.risks].join(" · ")}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <section className="mt-6">
        <h2 className="font-display text-2xl text-foreground">Decision</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Approve requires the not-legal-advice checkbox. One revise loop, then re-approve.
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
