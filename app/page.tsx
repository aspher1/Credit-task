import Link from "next/link";
import { FileText, ListChecks, Upload } from "lucide-react";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  featureCards,
  howItWorks,
  inclusions,
  outOfScope,
  product,
} from "@/lib/copy";

const cardIcons = [Upload, ListChecks, FileText];

export default function HomePage() {
  return (
    <SiteShell width="landing">
      <section className="pt-4">
        <p className="inline-flex rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600">
          {product.heroBadge}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          {product.heroH1}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-stone-600">{product.heroSub}</p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/pay">{product.cta}</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-stone-500">
          {product.trustRow.join(" · ")}
        </p>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        {featureCards.map((card, index) => {
          const Icon = cardIcons[index];
          return (
            <Card key={card.title}>
              <CardHeader>
                <Icon className="size-5 text-blue-700" />
                <CardTitle className="mt-2">{card.title}</CardTitle>
                <CardDescription>{card.body}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </section>

      <section id="how" className="mt-16 scroll-mt-20">
        <h2 className="text-xl font-semibold text-stone-900">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          {howItWorks.map((step) => (
            <li key={step.n} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
                {step.n}
              </span>
              <div>
                <p className="font-medium text-stone-900">{step.title}</p>
                <p className="mt-1 text-sm text-stone-600">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>In scope</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-stone-600">
              {inclusions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Out of scope</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-stone-600">
              {outOfScope.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <div className="mt-12">
        <Disclaimer />
      </div>

      <section className="mt-12 rounded-xl border border-stone-200 bg-white px-6 py-10 text-center">
        <h2 className="text-2xl font-semibold text-stone-900">{product.heroH1}</h2>
        <p className="mt-2 text-sm text-stone-600">{product.trustRow.join(" · ")}</p>
        <Button className="mt-6" size="lg" asChild>
          <Link href="/pay">{product.cta}</Link>
        </Button>
      </section>

      <Separator className="mt-12" />
    </SiteShell>
  );
}
