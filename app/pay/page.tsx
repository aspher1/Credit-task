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
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-12 lg:items-start lg:gap-12 lg:py-14">
        <div className="lg:col-span-7">
          <p className="kicker">{product.heroBadge}</p>
          <div className="accent-rule mt-5" />
          <h1 className="font-display mt-5 max-w-xl text-[2rem] leading-[1.1] text-stone-900 sm:text-5xl">
            {paywall.headline}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-700 sm:text-xl">
            {paywall.body}
          </p>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-stone-700">
            {shortCompliance}
          </p>
        </div>

        <div className="border border-stone-200 bg-white p-6 shadow-sm sm:p-8 lg:sticky lg:top-24 lg:col-span-5">
          <PayActions checkoutReady={ready} />
          <p className="mt-5 text-sm leading-relaxed text-stone-600">{paywall.finePrint}</p>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid gap-3 sm:grid-cols-3">
            {product.trustRow.map((item) => (
              <li key={item} className="border-t border-stone-300 pt-3 text-sm font-medium text-stone-900">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
