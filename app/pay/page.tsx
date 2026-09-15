import { Disclaimer } from "@/components/Disclaimer";
import { PayActions } from "@/components/PayActions";
import { SiteShell } from "@/components/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
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
    <SiteShell width="intake">
      <p className="text-xs font-medium text-stone-500">Stripe test mode</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {paywall.headline}
      </h1>
      <p className="mt-4 text-lg text-stone-600">{paywall.body}</p>
      <div className="mt-8 space-y-6">
        <Disclaimer />
        <Card>
          <CardContent className="space-y-4 pt-5">
            <p className="text-sm">
              {product.name} is {product.price} once. Checkout uses Stripe{" "}
              <strong>test mode only</strong>. Live keys are rejected.
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
