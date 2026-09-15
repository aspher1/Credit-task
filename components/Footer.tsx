import { legalDisclaimer, product } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/8">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[0.7rem] font-medium tracking-[0.38em] text-foreground uppercase">
              CreditAsk
            </p>
            <p className="mt-2 text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {product.tagline}
            </p>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem] sm:leading-7">
            {legalDisclaimer.body}
          </p>
        </div>
        <p className="mt-10 border-t border-white/8 pt-6 text-xs text-muted-foreground">
          {legalDisclaimer.title}
        </p>
      </div>
    </footer>
  );
}
