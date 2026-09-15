import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { Frame } from "@/components/Frame";
import { LetterArtifact } from "@/components/LetterArtifact";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import {
  featureCards,
  howItWorks,
  inclusions,
  outOfScope,
  product,
} from "@/lib/copy";

const includedHref = "#whats-included";

export default function HomePage() {
  return (
    <SiteShell chrome="cinematic">
      <section className="hero-cinematic min-h-[calc(100svh-4rem)]">
        <Frame className="grid items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-7">
            <p className="kicker text-[var(--paper)]/55">{product.heroBadge}</p>
            <span className="mt-6 block h-px w-10 bg-[var(--paper)]/35" aria-hidden />
            <h1 className="display mt-8 max-w-[14ch] text-[2.75rem] text-[var(--paper)] sm:text-6xl lg:text-[4.85rem]">
              {product.heroH1}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--paper)]/72 sm:text-xl">
              {product.heroSub}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Button size="lg" variant="inverse" asChild>
                <Link href="/pay">{product.cta}</Link>
              </Button>
              <Link
                href={includedHref}
                className="text-sm text-[var(--paper)]/70 underline-offset-4 hover:text-[var(--paper)] hover:underline"
              >
                See what’s included
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <LetterArtifact />
          </div>
        </Frame>
      </section>

      <section className="border-b border-border bg-[var(--paper)]">
        <Frame>
          <ul className="grid sm:grid-cols-3">
            {product.trustRow.map((item, index) => (
              <li
                key={item}
                className="border-t border-border py-8 sm:border-t-0 sm:border-l sm:px-10 sm:py-12 sm:first:border-l-0 sm:first:pl-0"
              >
                <p className="kicker">
                  {index === 0 ? "Price" : index === 1 ? "Turnaround" : "Responsibility"}
                </p>
                <p className="mt-3 text-xl font-medium tracking-tight text-foreground sm:text-2xl">
                  {item}
                </p>
              </li>
            ))}
          </ul>
        </Frame>
      </section>

      <section className="bg-[var(--paper)] py-20 sm:py-28">
        <Frame>
          <p className="kicker">The pack</p>
          <h2 className="display mt-4 max-w-[16ch] text-4xl text-foreground sm:text-5xl">
            Three moves. One letter.
          </h2>
          <div className="mt-14 grid border-t border-border md:grid-cols-3">
            {featureCards.map((card, index) => (
              <article
                key={card.title}
                className="border-border py-10 md:border-l md:px-10 md:first:border-l-0 md:first:pl-0"
              >
                <p className="display text-4xl text-foreground/40">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-8 text-2xl font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
              </article>
            ))}
          </div>
        </Frame>
      </section>

      <section id="how" className="scroll-mt-24 border-y border-border bg-[var(--paper-2)] py-20 sm:py-28">
        <Frame>
          <p className="kicker">Process</p>
          <h2 className="display mt-4 text-4xl text-foreground sm:text-5xl">How it works</h2>
          <ol className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {howItWorks.map((step) => (
              <li key={step.n} className="border-t border-[var(--rule-strong)] pt-6">
                <p className="display text-5xl text-foreground/80">{step.n.padStart(2, "0")}</p>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.975rem] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Frame>
      </section>

      <section id="whats-included" className="scroll-mt-24 bg-[var(--paper)] py-20 sm:py-28">
        <Frame>
          <p className="kicker">Specification</p>
          <h2 className="display mt-4 text-4xl text-foreground sm:text-5xl">What’s included</h2>
          <div className="mt-14 grid lg:grid-cols-2">
            <article className="border border-border bg-card p-8 sm:p-12 lg:border-r-0">
              <h3 className="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
                In scope
              </h3>
              <ul className="mt-8 space-y-5">
                {inclusions.map((item) => (
                  <li key={item} className="flex gap-4 text-[1.02rem] leading-relaxed text-foreground">
                    <span className="mt-2.5 h-px w-7 shrink-0 bg-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="border border-border bg-[var(--paper-2)] p-8 sm:p-12">
              <h3 className="text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
                Out of scope
              </h3>
              <ul className="mt-8 space-y-5">
                {outOfScope.map((item) => (
                  <li key={item} className="flex gap-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                    <span className="mt-2.5 h-px w-7 shrink-0 bg-[var(--rule-strong)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Frame>
      </section>

      <section className="bg-[var(--paper)] pb-8">
        <Frame>
          <Disclaimer />
        </Frame>
      </section>

      <section className="border-t border-border bg-[var(--paper-2)] py-20 sm:py-28">
        <Frame className="max-w-3xl">
          <h2 className="display text-4xl leading-[1.05] text-foreground sm:text-5xl">
            {product.heroH1}
          </h2>
          <p className="mt-6 text-base text-muted-foreground">
            {product.trustRow.join(" · ")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button size="lg" asChild>
              <Link href="/pay">{product.cta}</Link>
            </Button>
            <Link
              href={includedHref}
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              See what’s included
            </Link>
          </div>
        </Frame>
      </section>
    </SiteShell>
  );
}
