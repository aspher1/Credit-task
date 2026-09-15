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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start lg:gap-16">
        <div>
          <p className="kicker">{product.heroBadge}</p>
          <div className="accent-rule mt-5" />
          <h1 className="font-display mt-6 max-w-xl text-[2.15rem] leading-[1.12] text-stone-900 sm:text-5xl">
            {paywall.headline}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">
            {paywall.body}
          </p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-stone-600">
            {shortCompliance}
          </p>
          <ul className="mt-8 space-y-3">
            {product.trustRow.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-stone-700">
                <span className="h-px w-5 bg-primary" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-lg">
            <Disclaimer />
          </div>
        </div>

        <div className="panel space-y-5 rounded-xl px-6 py-7 shadow-sm sm:px-8 sm:py-8">
          <PayActions checkoutReady={ready} />
          <p className="text-xs leading-relaxed text-stone-500">{paywall.finePrint}</p>
        </div>
      </div>
    </SiteShell>
  );
}
