import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import {
  featureCards,
  howItWorks,
  inclusions,
  outOfScope,
  product,
} from "@/lib/copy";

export default function HomePage() {
  return (
    <SiteShell width="landing">
      <section className="relative grid min-h-[calc(100svh-4rem)] items-center gap-12 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-20">
        <div>
          <p className="kicker rise">{product.heroBadge}</p>
          <div className="gold-rule mt-5 rise rise-delay-1" />
          <h1 className="font-display rise rise-delay-1 mt-6 max-w-3xl text-[2.35rem] leading-[1.08] text-foreground sm:text-5xl lg:text-[4.15rem] lg:leading-[1.04]">
            {product.heroH1}
          </h1>
          <p className="rise rise-delay-2 mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {product.heroSub}
          </p>
          <div className="rise rise-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
            <Link
              href="/#how"
              className="text-sm tracking-[0.08em] text-muted-foreground uppercase underline-offset-8 transition-colors hover:text-primary hover:underline"
            >
              How it works
            </Link>
          </div>
        </div>
        <HeroTableau />
      </section>

      <ul className="grid gap-px overflow-hidden border border-white/8 sm:grid-cols-3">
        {product.trustRow.map((item) => (
          <li
            key={item}
            className="bg-background/40 px-5 py-5 text-sm tracking-[0.06em] text-foreground/90 uppercase sm:px-6"
          >
            <span className="mb-2 block h-px w-8 bg-primary" />
            {item}
          </li>
        ))}
      </ul>

      <section className="mt-24 grid gap-4 md:grid-cols-3 md:gap-5">
        {featureCards.map((card, index) => (
          <article key={card.title} className="panel p-6 sm:p-7">
            <p className="font-display text-3xl text-primary/80">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-6 font-display text-2xl text-foreground">{card.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
          </article>
        ))}
      </section>

      <section id="how" className="mt-28 scroll-mt-24 pb-4">
        <p className="kicker">Process</p>
        <h2 className="font-display mt-4 text-3xl text-foreground sm:text-4xl">How it works</h2>
        <div className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            className="pointer-events-none absolute top-7 right-[8%] left-[8%] hidden h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent lg:block"
            aria-hidden
          />
          {howItWorks.map((step) => (
            <article key={step.n} className="relative">
              <p className="font-display text-5xl leading-none text-primary/90">{step.n.padStart(2, "0")}</p>
              <h3 className="mt-5 text-base font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-28 grid gap-4 lg:grid-cols-2">
        <article className="panel p-7 sm:p-9">
          <p className="kicker">Included</p>
          <h2 className="font-display mt-4 text-3xl text-foreground">In scope</h2>
          <ul className="mt-8 space-y-4">
            {inclusions.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                <span className="mt-2 h-px w-5 shrink-0 bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
        <article className="border border-white/8 bg-black/20 p-7 sm:p-9">
          <p className="kicker !text-muted-foreground">Limits</p>
          <h2 className="font-display mt-4 text-3xl text-foreground">Out of scope</h2>
          <ul className="mt-8 space-y-4">
            {outOfScope.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 h-px w-5 shrink-0 bg-foreground/25" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <div className="mt-20">
        <Disclaimer />
      </div>

      <section className="relative mt-20 mb-8 overflow-hidden px-6 py-16 text-center sm:px-10 sm:py-20">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,163,106,0.16),transparent_62%)]"
          aria-hidden
        />
        <div className="absolute inset-0 border border-white/8" aria-hidden />
        <div className="relative">
          <p className="kicker">{product.heroBadge}</p>
          <h2 className="font-display mx-auto mt-5 max-w-3xl text-3xl leading-tight text-foreground sm:text-5xl">
            {product.heroH1}
          </h2>
          <p className="mt-5 text-sm tracking-[0.08em] text-muted-foreground uppercase">
            {product.trustRow.join(" · ")}
          </p>
          <Button className="mt-8" size="lg" asChild>
            <Link href="/pay">{product.cta}</Link>
          </Button>
        </div>
      </section>
    </SiteShell>
  );
}

function HeroTableau() {
  return (
    <div className="rise rise-delay-2 relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,163,106,0.2),transparent_64%)] blur-2xl"
        aria-hidden
      />
      <div className="relative mx-auto aspect-[4/5] max-h-[32rem] w-full">
        <div className="absolute top-[8%] right-[6%] left-[18%] h-[78%] rotate-[7deg] border border-white/8 bg-[#0e0d0b]" />
        <div className="panel absolute inset-x-[8%] inset-y-[4%] rotate-[-5.5deg] overflow-hidden p-8 sm:p-10">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] tracking-[0.28em] text-primary uppercase">
              {product.name}
            </span>
            <span className="h-px w-12 bg-primary" />
          </div>
          <div className="mt-10 space-y-3">
            <span className="block h-2 w-2/3 bg-foreground/18" />
            <span className="block h-2 w-1/2 bg-foreground/10" />
          </div>
          <div className="mt-10 space-y-2.5">
            {Array.from({ length: 9 }).map((_, index) => (
              <span
                key={index}
                className="block h-1.5 bg-foreground/10"
                style={{ width: `${92 - (index % 4) * 14}%` }}
              />
            ))}
          </div>
          <div className="absolute right-8 bottom-8 left-8 flex items-end justify-between">
            <span className="text-[0.62rem] tracking-[0.2em] text-muted-foreground uppercase">
              Draft for buyer review
            </span>
            <span className="font-display text-lg text-primary">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
