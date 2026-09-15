"use client";

import { useState } from "react";
import { paywall, product } from "@/lib/copy";

export function PayActions({
  hasStripe,
  paymentLink,
  allowDemo,
}: {
  hasStripe: boolean;
  paymentLink: string | null;
  allowDemo: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"stripe" | "demo" | null>(null);

  async function start(mode: "stripe" | "demo") {
    setError(null);
    setPending(mode);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const json = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !json.url) {
        throw new Error(json.error || "Could not start checkout");
      }
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPending(null);
    }
  }

  return (
    <div className="space-y-3">
      {hasStripe ? (
        <button
          className="btn-primary w-full sm:w-auto"
          disabled={!!pending}
          onClick={() => start("stripe")}
          type="button"
        >
          {pending === "stripe" ? "Redirecting to Stripe…" : paywall.cta}
        </button>
      ) : paymentLink ? (
        <a className="btn-primary inline-flex" href={paymentLink}>
          {paywall.cta} (Payment Link)
        </a>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          Stripe test keys are not set. Use the demo checkout below, or add{" "}
          <code>STRIPE_SECRET_KEY</code> / <code>STRIPE_PAYMENT_LINK_URL</code> in
          <code> .env.local</code>.
        </p>
      )}
      {allowDemo ? (
        <button
          className="btn-secondary w-full sm:w-auto"
          disabled={!!pending}
          onClick={() => start("demo")}
          type="button"
        >
          {pending === "demo"
            ? "Starting demo payment…"
            : `Continue in test/stub mode (${product.price} marked paid)`}
        </button>
      ) : null}
      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>
      ) : null}
    </div>
  );
}
