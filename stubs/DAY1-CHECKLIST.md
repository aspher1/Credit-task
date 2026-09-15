# CreditAsk — Day-1 delivery checklist

**Product lock (COO):** CreditAsk  
**Pipeline:** intake → Grok triage → draft letter → human approve → PDF deliver  
**Pay:** Stripe Checkout Session **$79** when `STRIPE_SECRET_KEY=sk_test_…` is set (preferred). Fallback: test Payment Link `https://buy.stripe.com/test_7sYfZigF9cyO6iseuO6kg00` (`plink_1UG2W3LRfzVmxUBhldUMkNq5`, price `price_1UG2VzLRfzVmxUBhrC0lBeZy`). Live charges disabled.

See the app README for the implemented Day-1 scaffold (routes, statuses, demo script).
