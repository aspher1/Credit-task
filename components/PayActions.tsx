"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { paywall } from "@/lib/copy";

const UNAVAILABLE =
  "Checkout is unavailable right now. Please try again shortly.";

export function PayActions({ checkoutReady }: { checkoutReady: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function start() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "stripe" }),
      });
      const json = (await response.json()) as { url?: string };
      if (!response.ok || !json.url) {
        throw new Error(UNAVAILABLE);
      }
      window.location.href = json.url;
    } catch {
      setError(UNAVAILABLE);
      setPending(false);
    }
  }

  if (!checkoutReady) {
    return <p className="text-sm leading-relaxed text-muted-foreground">{UNAVAILABLE}</p>;
  }

  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={start}
        type="button"
      >
        {pending ? "Redirecting…" : paywall.cta}
      </Button>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
