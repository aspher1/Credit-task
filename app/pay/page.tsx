import { Disclaimer } from "@/components/Disclaimer";
import { PayActions } from "@/components/PayActions";
import { SiteShell } from "@/components/SiteShell";
import { paywall, product } from "@/lib/copy";
import {
  allowDemo,
  stripePaymentLinkUrl,
  stripeSecretKey,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export default function PayPage() {
  let hasStripe = false;
  let stripeError: string | null = null;
  try {
    hasStripe = !!stripeSecretKey();
  } catch (error) {
    stripeError = error instanceof Error ? error.message : "Stripe config error";
  }
  const paymentLink = stripePaymentLinkUrl();

  return (
    <SiteShell>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Stripe test mode
      </p>
      <h1 className="mt-2 font-serif text-4xl text-[var(--navy)]">{paywall.headline}</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--muted)]">{paywall.body}</p>
      <div className="mt-8 max-w-xl space-y-6">
        <Disclaimer />
        <div className="card space-y-4">
          <p className="text-sm">
            {product.name} is {product.price} once. Checkout uses Stripe{" "}
            <strong>test mode only</strong>. Live keys are rejected.
          </p>
          {stripeError ? (
            <p className="text-sm text-rose-800">{stripeError}</p>
          ) : null}
          <PayActions
            hasStripe={hasStripe}
            paymentLink={paymentLink}
            allowDemo={allowDemo()}
          />
          <p className="text-xs text-[var(--muted)]">{paywall.finePrint}</p>
        </div>
      </div>
    </SiteShell>
  );
}
