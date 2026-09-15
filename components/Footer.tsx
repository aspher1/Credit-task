import { Frame } from "@/components/Frame";
import { legalDisclaimer, product } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-[var(--paper)]">
      <Frame className="py-14 sm:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-tight text-foreground">CreditAsk</p>
            <p className="mt-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">
              {product.tagline}
            </p>
          </div>
          <p className="max-w-xl text-[0.9375rem] leading-7 text-muted-foreground">
            {legalDisclaimer.body}
          </p>
        </div>
        <p className="mt-12 border-t border-border pt-6 text-xs tracking-[0.14em] text-muted-foreground uppercase">
          {legalDisclaimer.title}
        </p>
      </Frame>
    </footer>
  );
}
