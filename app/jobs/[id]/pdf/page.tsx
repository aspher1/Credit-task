import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { LetterPreview } from "@/components/LetterPreview";
import { PrintButton } from "@/components/PrintButton";
import { paywall } from "@/lib/copy";
import { getJob } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function PdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();
  const letter = job.letterFinal || job.letterDraft;
  const unlocked =
    job.paid && (job.status === "approved" || job.status === "delivered") && !!letter;

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <h1 className="font-serif text-3xl text-[var(--navy)]">{paywall.headline}</h1>
        <p className="mt-3 text-[var(--muted)]">
          {job.paid
            ? "This letter is not approved yet. A human reviewer must approve before PDF deliver."
            : paywall.body}
        </p>
        <div className="mt-6">
          <Disclaimer />
        </div>
        <div className="mt-6 flex gap-3">
          {!job.paid ? (
            <Link className="btn-primary" href="/pay">
              {paywall.cta}
            </Link>
          ) : null}
          <Link className="btn-secondary" href={`/jobs/${job.id}`}>
            Back to job
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            Printable letter
          </p>
          <h1 className="font-serif text-2xl text-[var(--navy)]">{job.address}</h1>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <Link className="btn-secondary" href={`/jobs/${job.id}`}>
            Back
          </Link>
        </div>
      </div>
      <LetterPreview text={letter} />
      <p className="no-print mt-6 text-xs text-[var(--muted)]">
        Not legal advice. CreditAsk does not send this letter or negotiate with the seller.
      </p>
    </div>
  );
}
