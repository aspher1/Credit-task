import { NextResponse } from "next/server";
import { PRICE_CENTS, stripePaymentLinkUrl, stripeSecretKey } from "@/lib/env";

export function GET() {
  let stripe: "checkout_test" | "payment_link_test" | "unset" | "rejected" =
    "unset";
  try {
    if (stripeSecretKey()) stripe = "checkout_test";
    else if (stripePaymentLinkUrl()) stripe = "payment_link_test";
  } catch {
    stripe = "rejected";
  }
  return NextResponse.json({
    ok: true,
    service: "creditask",
    stripe,
    liveCharges: false,
    priceCents: PRICE_CENTS,
  });
}
