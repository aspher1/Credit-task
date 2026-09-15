import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { Reveal } from "@/components/Reveal";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import {
  featureCards,
  howItWorks,
  inclusions,
  letterAttribution,
  outOfScope,
  product,
} from "@/lib/copy";
import { cn } from "@/lib/utils";

function Inner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-5 sm:px-8", className)}>{children}</div>
  );
}

export default function HomePage() {
  return (
    <SiteShell width="landing">
      <section className="hero-band relative overflow-x-hidden py-16 sm:py-20 lg:py-28">
        <Inner className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <Reveal>
            <p className="kicker">{product.heroBadge}</p>
            <div className="accent-rule mt-5" />
            <h1 className="font-display mt-6 max-w-3xl text-[2.25rem] leading-[1.12] text-[#f7f4ee] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]">
              {product.heroH1}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              {product.heroSub}
            </p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/pay">{product.cta}</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delayMs={80}>
            <HeroLetterMock />
          </Reveal>
        </Inner>
      </section>

      <section className="border-b border-stone-200 bg-[#f7f4ee]">
        <Inner>
          <ul className="grid sm:grid-cols-3">
            {product.trustRow.map((item) => (
              <li
                key={item}
                className="border-t border-stone-200 px-0 py-6 text-sm text-stone-800 sm:border-t-0 sm:border-l sm:px-8 sm:py-8 sm:first:border-l-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </Inner>
      </section>

      <section className="py-16 sm:py-24">
        <Inner className="grid gap-4 md:grid-cols-3 md:gap-5">
          {featureCards.map((card, index) => (
            <Reveal key={card.title} delayMs={index * 40}>
              <article className="panel rounded-lg p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-5 text-2xl text-stone-900">{card.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </Inner>
      </section>

      <section id="how" className="scroll-mt-24 border-y border-stone-200 bg-[#f3efe7] py-16 sm:py-24">
        <Inner>
          <Reveal>
            <h2 className="font-display text-3xl text-stone-900 sm:text-4xl">How it works</h2>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((step, index) => (
              <Reveal key={step.n} delayMs={index * 40}>
                <article>
                  <p className="font-display text-4xl text-primary">{step.n.padStart(2, "0")}</p>
                  <h3 className="mt-4 text-base font-semibold text-stone-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Inner>
      </section>

      <section className="py-16 sm:py-24">
        <Inner className="grid gap-4 lg:grid-cols-2">
          <Reveal>
            <article className="panel rounded-lg p-7 sm:p-9">
              <h2 className="font-display text-3xl text-stone-900">In scope</h2>
              <ul className="mt-8 space-y-4">
                {inclusions.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-700">
                    <span className="mt-2 h-px w-5 shrink-0 bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delayMs={60}>
            <article className="rounded-lg border border-stone-200 bg-[#f3efe7] p-7 shadow-sm sm:p-9">
              <h2 className="font-display text-3xl text-stone-900">Out of scope</h2>
              <ul className="mt-8 space-y-4">
                {outOfScope.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-stone-600">
                    <span className="mt-2 h-px w-5 shrink-0 bg-stone-300" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </Inner>
      </section>

      <section className="pb-10">
        <Inner>
          <Disclaimer />
        </Inner>
      </section>

      <section className="border-t border-stone-200 bg-[#f3efe7] py-16 sm:py-20">
        <Inner className="max-w-3xl text-center">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight text-stone-900 sm:text-4xl">
              {product.heroH1}
            </h2>
            <p className="mt-4 text-sm text-stone-600">{product.trustRow.join(" · ")}</p>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
          </Reveal>
        </Inner>
      </section>
    </SiteShell>
  );
}

function HeroLetterMock() {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden lg:max-w-none">
      <div className="relative mx-auto aspect-[4/5] max-h-[28rem] w-full max-w-[22rem] sm:max-h-[32rem] sm:max-w-none">
        <div className="absolute top-[12%] right-[6%] left-[20%] h-[70%] rotate-6 border border-white/15 bg-[#111a2c]" />
        <div className="absolute inset-x-[10%] inset-y-[6%] overflow-hidden border border-stone-200 bg-white p-7 shadow-md sm:p-9 lg:-rotate-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-stone-500 uppercase">
              {letterAttribution}
            </span>
            <span className="h-px w-10 bg-stone-300" />
          </div>
          <div className="mt-8 space-y-2.5">
            <span className="block h-2 w-2/3 bg-stone-200" />
            <span className="block h-2 w-1/2 bg-stone-100" />
          </div>
          <div className="mt-8 space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <span
                key={index}
                className="block h-1.5 bg-stone-100"
                style={{ width: `${90 - (index % 4) * 12}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
