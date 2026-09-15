import { legalDisclaimer, product } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-stone-200">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold tracking-tight text-stone-900">CreditAsk</p>
            <p className="mt-1 text-sm text-stone-500">{product.tagline}</p>
          </div>
          <p className="max-w-xl text-[0.9375rem] leading-7 text-stone-600 sm:text-sm sm:leading-relaxed">
            {legalDisclaimer.body}
          </p>
        </div>
        <p className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-500">
          {legalDisclaimer.title}
        </p>
      </div>
    </footer>
  );
}
