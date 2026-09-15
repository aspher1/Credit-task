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

This MVP **refuses live keys**. Configure one of:

| Env | Use |
|-----|-----|
| `STRIPE_SECRET_KEY=sk_test_…` | Creates a Checkout Session ($79) |
| `STRIPE_PAYMENT_LINK_URL` | Redirects to your test Payment Link |
| neither + `ALLOW_DEMO=true` | Stub checkout marks the job paid locally |

Optional: `STRIPE_WEBHOOK_SECRET` for `POST /api/stripe/webhook` (`checkout.session.completed`). PDF deliver is also gated on `job.paid` even if you skip the webhook and use the success URL.

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
