import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeWebhookSecret } from "@/lib/env";
import { getPayment, markJobsPaidByPayment, savePayment } from "@/lib/store";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = stripeWebhookSecret();
  if (!stripe || !secret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured (test mode)." },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid signature" },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const paymentId = session.metadata?.paymentId;
    if (paymentId) {
      const existing = await getPayment(paymentId);
      if (existing) {
        await savePayment({
          ...existing,
          status: "paid",
          stripeSessionId: session.id,
        });
        await markJobsPaidByPayment(paymentId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
