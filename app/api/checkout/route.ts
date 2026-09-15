import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { allowDemo, appUrl, stripePaymentLinkUrl } from "@/lib/env";
import { newId, savePayment } from "@/lib/store";
import { createCheckoutSession, getStripe } from "@/lib/stripe";
import { PRICE_CENTS } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { mode?: string };
  const mode = body.mode === "demo" ? "demo" : "stripe";

  if (mode === "demo") {
    if (!allowDemo()) {
      return NextResponse.json({ error: "Demo checkout is disabled" }, { status: 403 });
    }
    const payment = await savePayment({
      id: newId("pay"),
      createdAt: new Date().toISOString(),
      mode: "demo",
      status: "paid",
      amountCents: PRICE_CENTS,
    });
    const jar = await cookies();
    jar.set("creditask_payment", payment.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({
      url: `${appUrl()}/pay/success?paymentId=${payment.id}&demo=1`,
      paymentId: payment.id,
    });
  }

  try {
    if (getStripe()) {
      const created = await savePayment({
        id: newId("pay"),
        createdAt: new Date().toISOString(),
        mode: "stripe",
        status: "pending",
        amountCents: PRICE_CENTS,
      });
      const { url, sessionId } = await createCheckoutSession(created.id);
      await savePayment({ ...created, stripeSessionId: sessionId });
      const jar = await cookies();
      jar.set("creditask_payment", created.id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return NextResponse.json({ url, paymentId: created.id, mode: "checkout" });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe checkout failed" },
      { status: 400 },
    );
  }

  try {
    const paymentLink = stripePaymentLinkUrl();
    if (paymentLink) {
      return NextResponse.json({
        url: paymentLink,
        mode: "payment_link",
        note: "Using STRIPE_PAYMENT_LINK_URL. Set the link’s after-payment redirect to /pay/success?session_id={CHECKOUT_SESSION_ID}.",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment Link config error" },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { error: "Checkout is unavailable right now. Please try again shortly." },
    { status: 400 },
  );
}
