import Link from "next/link";
import { cookies } from "next/headers";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
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
        ? "Stripe test payment recorded. Upload your inspection next."
        : "Stripe session found but not paid yet. You can still start intake; PDF stays locked.";
    } catch (error) {
      detail =
        error instanceof Error
          ? `Could not verify Stripe session: ${error.message}`
          : "Could not verify Stripe session.";
    }
  } else if (params.demo === "1" || paymentId) {
    const payment = paymentId ? await getPayment(paymentId) : null;
    paid = payment?.status === "paid";
    detail = paid
      ? "Demo/test payment on file. Upload your inspection next."
      : "No confirmed payment yet. You can start intake; PDF download stays gated.";
  }

  const intakeHref = paymentId ? `/intake?paymentId=${encodeURIComponent(paymentId)}` : "/intake";

  return (
    <SiteShell>
      <h1 className="font-serif text-4xl text-[var(--navy)]">Payment step complete</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">{detail}</p>
      <div className="mt-6 max-w-xl space-y-4">
        <Disclaimer />
        <div className="flex flex-wrap gap-3">
          <Link className="btn-primary" href={intakeHref}>
            Continue to intake
          </Link>
          <Link className="btn-secondary" href="/pay">
            Back to pay
          </Link>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Status: {paid ? "paid (test/demo)" : "unpaid"}
        </p>
      </div>
    </SiteShell>
  );
}
