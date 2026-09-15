# CreditAsk — Day-1 delivery checklist

**Product lock (COO):** CreditAsk  
**Pipeline:** intake → Grok triage → draft letter → human approve → PDF deliver  
**Pay:** Stripe Checkout Session **$79** via env test keys (`sk_test_`). Optional: create a test Payment Link in Dashboard and set `STRIPE_PAYMENT_LINK_URL` (`https://buy.stripe.com/test_...`). Live charges disabled. See README.

See the app README for the implemented Day-1 scaffold (routes, statuses, demo script).
