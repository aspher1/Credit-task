import { Disclaimer } from "@/components/Disclaimer";
import { Frame } from "@/components/Frame";
import { PayActions } from "@/components/PayActions";
import { SiteShell } from "@/components/SiteShell";
import { paywall, product, shortCompliance } from "@/lib/copy";
import { stripePaymentLinkUrl, stripeSecretKey } from "@/lib/env";

export const dynamic = "force-dynamic";

function checkoutReady(): boolean {
  try {
    if (stripeSecretKey()) return true;
  } catch {
    /* buyer UI never surfaces config errors */
  }
  try {
    if (stripePaymentLinkUrl()) return true;
  } catch {
    /* buyer UI never surfaces config errors */
  }
  return false;
}

export default function PayPage() {
  const ready = checkoutReady();

  return (
    <SiteShell>
      <Frame className="grid gap-10 py-12 sm:py-16 lg:grid-cols-12 lg:items-start lg:gap-16">
        <div className="lg:col-span-7">
          <p className="kicker">{product.heroBadge}</p>
          <span className="mt-5 block h-px w-10 bg-primary" aria-hidden />
          <h1 className="display mt-6 max-w-xl text-4xl text-foreground sm:text-5xl">
            {paywall.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {paywall.body}
          </p>
          <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-foreground">
            {shortCompliance}
          </p>
          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {product.trustRow.map((item) => (
              <li key={item} className="border-t border-border pt-4">
                <p className="text-sm font-medium text-foreground">{item}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>

        <aside className="border border-border bg-card p-7 shadow-[0_24px_60px_rgba(12,17,24,0.06)] sm:p-9 lg:sticky lg:top-24 lg:col-span-5">
          <p className="kicker">Inspection pack</p>
          <p className="mt-4 text-4xl font-medium tracking-tight text-foreground">
            {product.price}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Once · Stripe test checkout</p>
          <div className="mt-8">
            <PayActions checkoutReady={ready} />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            {paywall.finePrint}
          </p>
        </aside>
      </Frame>
    </SiteShell>
  );
}
