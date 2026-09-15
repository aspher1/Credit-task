import Link from "next/link";
import { Disclaimer } from "@/components/Disclaimer";
import { SiteShell } from "@/components/SiteShell";
import { inclusions, outOfScope, product } from "@/lib/copy";

export default function HomePage() {
  return (
    <SiteShell>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {product.price} · {product.sla} marketing SLA
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-[var(--navy)] sm:text-5xl">
            Turn your inspection into a clear credit request.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            Upload a home inspection PDF or photos, tell us what you want to ask
            for, and CreditAsk triages the findings into a formal credit or
            repair request you can send yourself.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/pay">
              Get your letter — $79
            </Link>
            <Link className="btn-secondary" href="/intake">
              Go to intake
            </Link>
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="font-serif text-2xl text-[var(--navy)]">What you get</h2>
          <ul className="space-y-2 text-sm leading-6">
            {inclusions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <Disclaimer compact />
        </div>
      </section>

      <section id="how" className="mt-16 grid gap-6 md:grid-cols-4">
        {[
          ["1. Pay", `${product.price} test checkout (Stripe) or demo stub.`],
          ["2. Intake", "Address, ask target, intent, PDF and/or photos."],
          ["3. Triage + draft", "LLM if an API key is set; otherwise a high-quality stub."],
          ["4. Human approve", "Edit, approve, then download a printable letter PDF."],
        ].map(([title, body]) => (
          <div key={title} className="card">
            <h3 className="font-medium text-[var(--navy)]">{title}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="font-serif text-2xl text-[var(--navy)]">Included</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {inclusions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-serif text-2xl text-[var(--navy)]">Out of scope</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6">
            {outOfScope.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
