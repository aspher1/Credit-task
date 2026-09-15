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
  if (key.startsWith("pk_live_")) {
    throw new Error("Live Stripe publishable keys are not allowed in this MVP.");
  }
  return key;
}

export function stripePaymentLinkUrl(): string | null {
  const url = read("STRIPE_PAYMENT_LINK_URL");
  return url || null;
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
