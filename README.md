# CreditAsk — Inspection Contingency Credit Pack

Home buyers upload a home inspection PDF (or photos) plus priorities. CreditAsk triages findings and delivers a **ready-to-send credit/repair request letter**.

- **Price:** $79
- **Marketing SLA:** ~24 hours
- **Not legal advice.** We are not attorneys.
- **We do not negotiate with the seller.** You send the letter yourself.

This repo is the MVP: Next.js App Router, Auth.js admin approve, Stripe **test mode only**, local private file storage, human review before PDF deliver.

## Local run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default admin login (override in `.env.local`):

- Email: `admin@creditask.local`
- Password: `changeme`

## Demo path (stub / test mode)

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run demo
```

The demo script:

1. Hits `/api/health` until the app is up
2. Seeds the labeled **example** job (`123 Example Lane…`)
3. Creates a **demo payment** ($79 marked paid, no live charge)
4. Submits intake with `scripts/fixtures/sample-inspection.pdf`
5. Runs triage + draft letter (LLM if a key is set, otherwise stub)
6. Approves and marks delivered via the demo helper
7. Checks that the printable letter page is unlocked

You can also click through the UI:

1. `/` landing — $79, ~24h, inclusions / out of scope, disclaimer
2. `/pay` — Stripe test Checkout if `STRIPE_SECRET_KEY` (must be `sk_test_…`) is set, or Payment Link if `STRIPE_PAYMENT_LINK_URL` is set, or **Continue in test/stub mode**
3. `/intake` — address, buyer name, ask target, ask intent, optional deadline, PDF and/or photos
4. `/jobs/[id]` — statuses `intake_received` → `triaged` → `draft_ready` → `approved` → `delivered`
5. `/admin/login` then `/jobs/[id]/approve` — edit letter, approve / one revise loop / reject, mark delivered
6. `/jobs/[id]/pdf` — printable HTML (browser **Print / Save as PDF**), gated on paid + approved

## Stripe (test mode only)

Live charges are **disabled**. `sk_live_` / `pk_live_` keys and live Payment Links (`buy.stripe.com` without `/test`) are rejected at runtime.

**Priority:** Checkout Session (`STRIPE_SECRET_KEY=sk_test_…`) → Payment Link (`STRIPE_PAYMENT_LINK_URL`) → stub checkout (`ALLOW_DEMO=true`).

### Checkout Session (preferred) — $79

1. In [Stripe Dashboard](https://dashboard.stripe.com), turn on **Test mode**.
2. **Developers → API keys** → copy the **Secret key** (`sk_test_…`).
3. Put it in `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_...
APP_URL=http://localhost:3000
```

4. Restart `npm run dev`. **Get your letter — $79** on `/pay` creates a Checkout Session for **7900 cents USD**.
5. Card tests: `4242 4242 4242 4242`, any future expiry, any CVC.
6. Success redirects to `/pay/success?session_id={CHECKOUT_SESSION_ID}` and marks the local payment paid when Stripe reports `paid`.

Optional webhook (Test mode → **Developers → Webhooks**):

- Endpoint: `https://<your-host>/api/stripe/webhook`
- Event: `checkout.session.completed`
- Signing secret → `STRIPE_WEBHOOK_SECRET`

### Payment Link (fallback) — CreditAsk test link

Use this when `STRIPE_SECRET_KEY` is **not** set. If `sk_test_…` is present, **Checkout Sessions win** and this URL is not used.

**Ready test Payment Link (do not use live mode):**

```bash
STRIPE_PAYMENT_LINK_URL=https://buy.stripe.com/test_7sYfZigF9cyO6iseuO6kg00
```

| | Test ids |
|---|---|
| Payment Link | `plink_1UG2W3LRfzVmxUBhldUMkNq5` |
| Price | `price_1UG2VzLRfzVmxUBhrC0lBeZy` — **$79 USD one-time** |
| Product | `prod_VGZfwuTY9wNDi7` |

After-payment redirect is already set to:

`http://localhost:3000/pay/success?session_id={CHECKOUT_SESSION_ID}`

Copy `.env.example` to `.env.local` to pick this up. Live `buy.stripe.com/…` links (no `test_`) are rejected.

Optional: `STRIPE_PRICE_ID=price_1UG2VzLRfzVmxUBhrC0lBeZy` so Checkout Sessions (when `sk_test_` is set) use the same $79 catalog price. The price id must belong to the **same test account** as `STRIPE_SECRET_KEY`; otherwise leave `STRIPE_PRICE_ID` empty and Checkout uses `price_data` at 7900 cents.

### Recreate a Payment Link (if you need a new one)

1. Dashboard **Test mode** on.
2. **Product catalog → Add product**
   - Name: `CreditAsk Inspection Contingency Credit Pack`
   - One-time price: **$79 USD** (not recurring)
3. **Payment links → New**
   - Select that $79 price, quantity 1
   - **After payment** → Don’t show Stripe’s confirmation page → **Redirect to your website**
   - URL: `http://localhost:3000/pay/success?session_id={CHECKOUT_SESSION_ID}`  
     (use your `APP_URL` in deploy)
4. Copy the link. It **must** look like `https://buy.stripe.com/test_...`
5. Set `STRIPE_PAYMENT_LINK_URL` in `.env.local` and restart.

Do **not** paste a live `buy.stripe.com/...` link (no `test_`). The app will refuse it. Do not enable live mode.

### Cursor Stripe connector

The Stripe connector on this Cursor account is **test mode only**. CreditAsk prefers **Checkout Sessions** from `STRIPE_SECRET_KEY` (`sk_test_` only, **$79 / 7900 cents**). The test Payment Link above is the fallback when no secret key is set. Live charges stay disabled.

### Stub (no Stripe)

Leave both Stripe env vars empty and keep `ALLOW_DEMO=true`. `/pay` can mark $79 paid locally with no charge.

No live charges. No CRM. No MLS.

## LLM triage

If `XAI_API_KEY` or `OPENAI_API_KEY` is present, intake calls that API for triage JSON, then fills the letter template.

If no key is set (or the call fails), a conservative **stub** fills the same template so the demo works offline. Stub mode does **not** invent dollar amounts.

## Data & uploads

Runtime files (gitignored):

- `data/store.json` — jobs + payments
- `data/uploads/[jobId]/` — inspection PDF/photos (not served from `/public`)

Admin can open attachments from the approve page (`/api/files/...`, session required).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Marketing one-pager |
| `/pay` | $79 paywall / Stripe test checkout |
| `/intake` | Intake form + upload |
| `/jobs/[id]` | Status, triage, draft |
| `/jobs/[id]/approve` | Human review (Auth.js) |
| `/jobs/[id]/pdf` | Printable letter (gated) |
| `/admin` | Job queue |

## Product rules

- Pay **before PDF deliver** ($79). Intake can be filled unpaid; download stays locked.
- Human approve is required. We do not send the letter to the seller.
- Clear **not an attorney** disclaimer in the UI.
- Copy stubs used for intake help, triage brief, letter template, approve packet, and paywall live under `stubs/`.

## Scripts

```bash
npm run dev      # next dev
npm run build    # production build
npm start        # next start
npm run demo     # end-to-end stub demo against APP_URL (default localhost:3000)
npm run lint
```
