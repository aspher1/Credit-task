import { Disclaimer } from "@/components/Disclaimer";
import { PayActions } from "@/components/PayActions";
import { SiteShell } from "@/components/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { paywall, product, shortCompliance } from "@/lib/copy";
import {
  allowDemo,
  stripePaymentLinkUrl,
  stripeSecretKey,
} from "@/lib/env";

export const dynamic = "force-dynamic";

export default function PayPage() {
  let hasStripe = false;
  let paymentLink: string | null = null;
  let stripeError: string | null = null;
  try {
    hasStripe = !!stripeSecretKey();
  } catch (error) {
    stripeError = error instanceof Error ? error.message : "Stripe config error";
  }
  try {
    paymentLink = stripePaymentLinkUrl();
  } catch (error) {
    stripeError =
      stripeError ||
      (error instanceof Error ? error.message : "Payment Link config error");
  }

  const pathLabel = hasStripe
    ? "Stripe Checkout Session (sk_test_)"
    : paymentLink
      ? "Stripe test Payment Link"
      : "Stub checkout (no charge)";

  return (
    <SiteShell width="intake">
      <p className="text-xs font-medium text-stone-500">Stripe test mode · {pathLabel}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {paywall.headline}
      </h1>
      <p className="mt-4 text-lg text-stone-600">{paywall.body}</p>
      <p className="mt-2 text-sm text-muted-foreground">{shortCompliance}</p>
      <div className="mt-8 space-y-6">
        <Disclaimer />
        <Card>
          <CardContent className="space-y-4 pt-5">
            <p className="text-sm">
              {product.name} is {product.price} once. Checkout uses Stripe{" "}
              <strong>test mode only</strong>. Live keys and live Payment Links are
              rejected. Payment unlocks PDF deliver; a human still approves the draft.
            </p>
            {stripeError ? (
              <p className="text-sm text-red-800">{stripeError}</p>
            ) : null}
            <PayActions
              hasStripe={hasStripe}
              paymentLink={paymentLink}
              allowDemo={allowDemo()}
            />
            <p className="text-xs text-muted-foreground">{paywall.finePrint}</p>
          </CardContent>
        </Card>
      </div>
    </SiteShell>
  );
}
