"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { product } from "@/lib/copy";

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
        <Button disabled={!!pending} onClick={() => start("stripe")} type="button">
          {pending === "stripe" ? "Redirecting to Stripe…" : product.cta}
        </Button>
      ) : paymentLink ? (
        <Button asChild>
          <a href={paymentLink}>{product.cta}</a>
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Stripe test keys are not set. Use the demo checkout below, or add{" "}
          <code>STRIPE_SECRET_KEY</code> / <code>STRIPE_PAYMENT_LINK_URL</code> in
          <code> .env.local</code>.
        </p>
      )}
      {allowDemo ? (
        <Button
          variant="outline"
          disabled={!!pending}
          onClick={() => start("demo")}
          type="button"
        >
          {pending === "demo"
            ? "Starting demo payment…"
            : `Continue in test/stub mode (${product.price} marked paid)`}
        </Button>
      ) : null}
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
