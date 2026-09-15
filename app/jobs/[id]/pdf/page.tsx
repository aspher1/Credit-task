import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/Disclaimer";
import { LetterPreview } from "@/components/LetterPreview";
import { PrintButton } from "@/components/PrintButton";
import { Button } from "@/components/ui/button";
import { paywall, product } from "@/lib/copy";
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
  const approved = job.status === "approved" || job.status === "delivered";
  const unlocked = !!letter && job.paid && job.status !== "rejected";

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 md:max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          {paywall.headline}
        </h1>
        <p className="mt-3 text-stone-600">
          {job.paid
            ? "This letter is not ready to print yet."
            : paywall.body}
        </p>
        <div className="mt-6">
          <Disclaimer />
        </div>
        <div className="mt-6 flex gap-3">
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
    <div className="mx-auto max-w-[8.5in] px-4 py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            US Letter · 1 in margins · Georgia / Times
          </p>
          <h1 className="text-2xl font-semibold text-stone-900">{job.address}</h1>
        </div>
        <div className="flex gap-2">
          <PrintButton />
          <Button variant="outline" asChild>
            <Link href={`/jobs/${job.id}`}>Back</Link>
          </Button>
        </div>
      </div>
      <LetterPreview text={letter} draft={!approved} />
      <p className="no-print mt-6 text-xs text-muted-foreground">
        Not legal advice. We don’t send this letter to the seller. No invented dollar amounts.
      </p>
    </div>
  );
}
