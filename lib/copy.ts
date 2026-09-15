import { PRICE_LABEL } from "@/lib/env";

export const product = {
  name: "CreditAsk",
  tagline: "Inspection Contingency Credit Pack",
  price: PRICE_LABEL,
  sla: "~24h",
  disclaimer:
    "CreditAsk is not a law firm and does not provide legal advice. We do not negotiate with the seller. You send the letter yourself.",
};

export const intakeHelp = {
  address:
    "Where the inspection was done. Use the full mailing address.",
  pdf: "Upload the full report if you have it. PDF preferred.",
  photos:
    "If you don’t have a PDF, upload clear photos of each issue (wide shot + close-up).",
  askTarget:
    "Who should receive this letter? Seller, listing agent, landlord, or other (include their name).",
  askIntent:
    "e.g. repair credit at closing, price reduction, landlord fix, other.",
  buyerName: "How we sign the letter.",
  deadline: "If you need a response by a certain date.",
};

export const paywall = {
  headline: "Unlock your inspection ask letter (PDF)",
  body: `After you approve the draft, pay ${PRICE_LABEL} once to download the final PDF. Secure checkout via Stripe.`,
  cta: `Pay ${PRICE_LABEL} — get PDF`,
  finePrint:
    "Test mode until live charges are approved. No letter is sent to the other party unless you choose to send it yourself.",
};

export const triageSystem = `You are triaging a residential inspection for a CreditAsk letter.

Given: address, ask target, ask intent, inspection PDF text and/or photo notes.

Output JSON:
- issues[]: { title, severity: low|med|high, evidence, suggested_ask }
- ask_type: repair_credit | price_reduction | landlord_remedy | other
- estimate_band: string labeled as estimate only (or null if unknown)
- missing_info[]: what’s needed before a strong letter
- risks[]: overclaim / weak evidence flags

Rules:
- Do not invent dollar amounts without evidence in the materials.
- Prefer conservative asks when evidence is thin.
- Flag health/safety items clearly.
- Return JSON only.`;

export const inclusions = [
  "Triage of inspection findings (severity, evidence, gaps)",
  "A formal credit / repair request letter draft",
  "Human review before anything is marked approved",
  "Printable PDF of the approved letter",
  `${PRICE_LABEL} once · marketing turnaround ~24 hours`,
];

export const outOfScope = [
  "We do not negotiate with the seller or listing agent",
  "We do not send the letter for you",
  "Not legal advice — we are not attorneys",
  "No MLS lookup, CRM outreach, or live Stripe charges in this MVP",
];
