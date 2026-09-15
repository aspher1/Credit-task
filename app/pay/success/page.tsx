import Link from "next/link";
import { cookies } from "next/headers";
import { Disclaimer } from "@/components/Disclaimer";
import { Frame } from "@/components/Frame";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { shortCompliance } from "@/lib/copy";
import {
  getPayment,
  getPaymentByStripeSession,
  markJobsPaidByPayment,
  savePayment,
} from "@/lib/store";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export default async function PaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; paymentId?: string; demo?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  let paymentId = params.paymentId || cookieStore.get("creditask_payment")?.value;
  let paid = false;
  let detail = "Continue to intake to upload your inspection.";

  if (params.session_id && getStripe()) {
    try {
      const session = await retrieveCheckoutSession(params.session_id);
      paid = session.payment_status === "paid" || session.status === "complete";
      const metaId = session.metadata?.paymentId;
      const existing =
        (metaId ? await getPayment(metaId) : null) ||
        (await getPaymentByStripeSession(params.session_id));
      if (existing) {
        paymentId = existing.id;
        if (paid && existing.status !== "paid") {
          await savePayment({ ...existing, status: "paid", stripeSessionId: params.session_id });
          await markJobsPaidByPayment(existing.id);
        }
        paid = existing.status === "paid" || paid;
      }
      detail = paid
        ? "Payment recorded. Upload your inspection next."
        : "Payment is not confirmed yet. You can still start intake; PDF stays locked.";
    } catch {
      detail = "Could not verify payment yet. You can still start intake; PDF stays locked.";
    }
  } else if (params.demo === "1" || paymentId) {
    const payment = paymentId ? await getPayment(paymentId) : null;
    paid = payment?.status === "paid";
    detail = paid
      ? "Payment on file. Upload your inspection next."
      : "No confirmed payment yet. You can start intake; PDF download stays gated.";
  }

  const intakeHref = paymentId ? `/intake?paymentId=${encodeURIComponent(paymentId)}` : "/intake";

  return (
    <SiteShell>
      <Frame className="max-w-2xl py-14 sm:py-20">
        <p className="kicker">{paid ? "Confirmed" : "Pending"}</p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          Payment step complete
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{detail}</p>
        <p className="mt-4 text-[0.975rem] leading-relaxed text-foreground">{shortCompliance}</p>
        <div className="mt-10 space-y-6">
          <Disclaimer />
          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={intakeHref}>Continue to intake</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/pay">Back to pay</Link>
            </Button>
          </div>
        </div>
      </Frame>
    </SiteShell>
  );
}
