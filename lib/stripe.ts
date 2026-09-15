import Stripe from "stripe";
import { PRICE_CENTS, appUrl, stripeSecretKey } from "@/lib/env";

let client: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (client !== undefined) return client;
  const key = stripeSecretKey();
  client = key ? new Stripe(key) : null;
  return client;
}

function assertTestMode(livemode: boolean | undefined) {
  if (livemode) {
    throw new Error("Live Stripe charges are not allowed. Use test mode (sk_test_ / buy.stripe.com/test_).");
  }
}

export async function createCheckoutSession(
  paymentId: string,
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured (test-mode secret key missing).");
  }
  const origin = appUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: PRICE_CENTS,
          product_data: {
            name: "CreditAsk Inspection Contingency Credit Pack",
            description:
              "Triage + draft credit/repair request letter. Not legal advice. You send the letter yourself. Pay $79 unlocks PDF deliver.",
          },
        },
      },
    ],
    metadata: { paymentId, product: "creditask", mode: "test" },
    success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pay`,
  });
  assertTestMode(session.livemode);
  if (!session.url) throw new Error("Stripe did not return a Checkout URL");
  return { url: session.url, sessionId: session.id };
}

export async function retrieveCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured");
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  assertTestMode(session.livemode);
  return session;
}
