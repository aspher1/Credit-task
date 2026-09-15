function read(name: string, fallback = ""): string {
  return (process.env[name] ?? fallback).trim();
}

export function appUrl(): string {
  return read("APP_URL", "http://localhost:3000").replace(/\/$/, "");
}

export function allowDemo(): boolean {
  const value = read("ALLOW_DEMO", "true").toLowerCase();
  return value !== "false" && value !== "0";
}

export function adminCredentials() {
  return {
    email: read("ADMIN_EMAIL", "admin@creditask.local"),
    password: read("ADMIN_PASSWORD", "changeme"),
  };
}

export function stripeSecretKey(): string | null {
  const key = read("STRIPE_SECRET_KEY");
  if (!key) return null;
  if (!key.startsWith("sk_test_")) {
    throw new Error(
      "STRIPE_SECRET_KEY must be a test-mode key (sk_test_...). Live keys are not allowed.",
    );
  }
  return key;
}

export function stripePublishableKey(): string | null {
  const key = read("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
  if (!key) return null;
  if (!key.startsWith("pk_test_")) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a test-mode key (pk_test_...). Live keys are not allowed.",
    );
  }
  return key;
}

export function stripePriceId(): string | null {
  const id = read("STRIPE_PRICE_ID");
  if (!id) return null;
  if (!id.startsWith("price_")) {
    throw new Error("STRIPE_PRICE_ID must be a Stripe price id (price_...).");
  }
  return id;
}

export function stripePaymentLinkUrl(): string | null {
  const url = read("STRIPE_PAYMENT_LINK_URL");
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("STRIPE_PAYMENT_LINK_URL is not a valid URL.");
  }
  const testBuyLink =
    parsed.hostname === "buy.stripe.com" && parsed.pathname.startsWith("/test");
  const localPlaceholder =
    parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (!testBuyLink && !localPlaceholder) {
    throw new Error(
      "STRIPE_PAYMENT_LINK_URL must be a test-mode Payment Link (https://buy.stripe.com/test_...). Live links are not allowed.",
    );
  }
  return url;
}

export function stripeWebhookSecret(): string | null {
  return read("STRIPE_WEBHOOK_SECRET") || null;
}

export function llmConfig() {
  const xai = read("XAI_API_KEY");
  const openai = read("OPENAI_API_KEY");
  return {
    xaiKey: xai || null,
    xaiModel: read("XAI_MODEL", "grok-2-latest"),
    openaiKey: openai || null,
    openaiModel: read("OPENAI_MODEL", "gpt-4o-mini"),
  };
}

export const PRICE_CENTS = 7900;
export const PRICE_LABEL = "$79";
