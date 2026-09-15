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
    <div className={cn("mx-auto max-w-7xl px-5 sm:px-8", className)}>{children}</div>
  );
}

export default function HomePage() {
  return (
    <SiteShell width="landing">
      <section className="hero-band relative overflow-x-hidden py-14 sm:py-20 lg:min-h-[calc(100svh-4rem)] lg:py-0 lg:flex lg:items-center">
        <Inner className="grid w-full items-center gap-12 py-4 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <p className="kicker">{product.heroBadge}</p>
            <div className="accent-rule mt-6" />
            <h1 className="font-display mt-7 max-w-4xl text-[2.5rem] leading-[1.08] text-[#f7f4ee] sm:text-6xl lg:text-[4.25rem] lg:leading-[1.04]">
              {product.heroH1}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {product.heroSub}
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/pay">{product.cta}</Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delayMs={80} className="lg:col-span-5">
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
                className="border-t border-stone-200 px-0 py-7 text-base font-medium text-stone-900 sm:border-t-0 sm:border-l sm:px-10 sm:py-10 sm:text-lg sm:first:border-l-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </Inner>
      </section>

      <section className="py-16 sm:py-24">
        <Inner className="grid gap-px overflow-hidden border border-stone-200 bg-stone-200 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <Reveal key={card.title} delayMs={index * 40} className="h-full">
              <article className="h-full bg-[#f7f4ee] p-7 sm:p-9">
                <p className="font-display text-4xl text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-8 text-2xl font-semibold tracking-tight text-stone-900">
                  {card.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-stone-700">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </Inner>
      </section>

      <section id="how" className="scroll-mt-24 border-y border-stone-200 bg-[#f3efe7] py-16 sm:py-24">
        <Inner>
          <Reveal>
            <h2 className="font-display text-4xl text-stone-900 sm:text-5xl">How it works</h2>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {howItWorks.map((step, index) => (
              <Reveal key={step.n} delayMs={index * 40}>
                <article className="border-t border-stone-300 pt-6">
                  <p className="font-display text-5xl leading-none text-primary">
                    {step.n.padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 text-lg font-semibold text-stone-900">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-stone-700">{step.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Inner>
      </section>

      <section className="py-16 sm:py-24">
        <Inner className="grid lg:grid-cols-2">
          <Reveal>
            <article className="border border-stone-200 bg-white p-8 shadow-sm sm:p-10 lg:border-r-0">
              <h2 className="font-display text-4xl text-stone-900">In scope</h2>
              <ul className="mt-8 space-y-5">
                {inclusions.map((item) => (
                  <li key={item} className="flex gap-4 text-base leading-relaxed text-stone-800">
                    <span className="mt-2.5 h-px w-6 shrink-0 bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delayMs={60}>
            <article className="border border-stone-200 bg-[#f3efe7] p-8 sm:p-10">
              <h2 className="font-display text-4xl text-stone-900">Out of scope</h2>
              <ul className="mt-8 space-y-5">
                {outOfScope.map((item) => (
                  <li key={item} className="flex gap-4 text-base leading-relaxed text-stone-700">
                    <span className="mt-2.5 h-px w-6 shrink-0 bg-stone-400" aria-hidden />
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

      <section className="border-t border-stone-200 bg-[#f3efe7] py-16 sm:py-24">
        <Inner className="max-w-3xl">
          <Reveal>
            <h2 className="font-display text-4xl leading-tight text-stone-900 sm:text-5xl">
              {product.heroH1}
            </h2>
            <p className="mt-5 text-base text-stone-700">{product.trustRow.join(" · ")}</p>
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
      <div className="relative mx-auto aspect-[4/5] max-h-[30rem] w-full max-w-[24rem] sm:max-h-[34rem] sm:max-w-none">
        <div className="absolute top-[12%] right-[4%] left-[18%] h-[72%] rotate-6 border border-white/12 bg-[#111a2c]" />
        <div className="absolute inset-x-[8%] inset-y-[4%] overflow-hidden border border-stone-200 bg-white p-8 shadow-md sm:p-10 lg:-rotate-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-stone-500 uppercase">
              {letterAttribution}
            </span>
            <span className="h-px w-10 bg-stone-300" />
          </div>
          <div className="mt-10 space-y-3">
            <span className="block h-2.5 w-2/3 bg-stone-200" />
            <span className="block h-2.5 w-1/2 bg-stone-100" />
          </div>
          <div className="mt-10 space-y-2.5">
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
