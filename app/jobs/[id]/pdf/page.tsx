import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { LetterPreview } from "@/components/LetterPreview";
import { PrintButton } from "@/components/PrintButton";
import { Button } from "@/components/ui/button";
import { paywall, product, shortCompliance } from "@/lib/copy";
import { letterIsUnapprovedDraft } from "@/lib/pdf-gate";
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
    !!letter &&
    job.paid &&
    (job.status === "approved" || job.status === "delivered");

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg bg-[var(--paper)] px-5 py-16 md:max-w-2xl">
        <p className="kicker">PDF deliver</p>
        <h1 className="display mt-4 text-4xl text-foreground">
          {paywall.headline}
        </h1>
        <p className="mt-4 text-muted-foreground">
          {job.paid
            ? "This letter is not ready to print yet."
            : paywall.body}
        </p>
        <p className="mt-3 text-[0.975rem] leading-relaxed text-foreground">{shortCompliance}</p>
        <div className="mt-8">
          <Disclaimer />
        </div>
        <div className="mt-8 flex gap-3">
          {!job.paid ? (
            <Button asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link href={`/jobs/${job.id}`}>Back to job</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[8.5in] bg-[var(--paper)] px-4 py-10">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker">US Letter · 1 in margins · Georgia / Times</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {job.address}
          </h1>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <Button variant="outline" asChild>
            <Link href={`/jobs/${job.id}`}>Back</Link>
          </Button>
        </div>
      </div>
      <LetterPreview text={letter} draft={letterIsUnapprovedDraft(job)} />
      <p className="no-print mt-6 text-xs text-muted-foreground">
        Not legal advice. We don’t negotiate or send this for you. No invented dollar amounts.
      </p>
    </div>
  );
}
