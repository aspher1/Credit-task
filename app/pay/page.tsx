import { Disclaimer } from "@/components/Disclaimer";
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
    <SiteShell width="landing">
      <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-start lg:gap-16 lg:py-20">
        <div>
          <p className="kicker">{product.heroBadge}</p>
          <div className="gold-rule mt-5" />
          <h1 className="font-display mt-6 max-w-xl text-4xl leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
            {paywall.headline}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {paywall.body}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            {shortCompliance}
          </p>
          <p className="font-display mt-10 text-6xl text-foreground sm:text-7xl">
            {product.price}
          </p>
          <ul className="mt-8 space-y-3">
            {product.trustRow.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 text-sm tracking-[0.06em] text-foreground/85 uppercase"
              >
                <span className="h-px w-5 bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12 max-w-lg">
            <Disclaimer />
          </div>
        </div>

        <div className="panel space-y-6 px-6 py-7 sm:px-8 sm:py-9">
          <p className="font-display text-2xl text-foreground">{product.cta}</p>
          <PayActions checkoutReady={ready} />
          <p className="text-xs leading-relaxed text-muted-foreground">{paywall.finePrint}</p>
        </div>
      </div>
    </SiteShell>
  );
}
