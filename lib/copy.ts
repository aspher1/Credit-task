import { PRICE_LABEL } from "@/lib/env";

export const product = {
  name: "CreditAsk",
  tagline: "Inspection Contingency Credit Pack",
  price: PRICE_LABEL,
  sla: "~24h",
  cta: "Get your letter — $79",
  heroH1: "Turn your inspection into a clear credit request.",
  heroBadge: "Inspection contingency · ~24h",
  heroSub:
    "Upload your inspection. We triage the findings and draft a credit request you send yourself.",
  trustRow: ["Fixed $79", "~24h", "You send the letter"] as const,
  successSend:
    "We don’t send this letter to the seller. Sending it — and any follow-up — is yours.",
};

export const shortCompliance =
  "Not legal advice. We don’t negotiate with sellers.";

export const letterPageFooter =
  "Prepared with CreditAsk · Not legal advice · Draft for buyer review before sending · We don’t negotiate or send this for you";

export const approveCheckbox =
  "I understand this is not legal advice, and I’m responsible for sending this letter and any follow-up.";

export const legalDisclaimer = {
  title: "Not legal advice",
  body: "CreditAsk drafts a ready-to-send letter based on what you upload. We are not a law firm, we do not provide legal advice, and we do not negotiate with sellers. Sending the letter and any negotiation are your responsibility (or your agent’s / attorney’s).",
};

export const intakeHelp = {
  address:
    "Where the inspection was done. Use the full mailing address.",
  pdf: "Your inspection PDF is used only to draft your letter. Access is limited to drafting/review. We don’t send it to the seller. We delete files 30 days after delivery unless you ask sooner.",
  photos:
    "Your inspection photos are used only to draft your letter. Access is limited to drafting/review. We don’t send them to the seller. We delete files 30 days after delivery unless you ask sooner.",
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
  cta: "Get your letter — $79",
  finePrint:
    "Not legal advice. We don’t negotiate with sellers. Test mode until live charges are approved. No letter is sent to the other party unless you choose to send it yourself.",
};

export const featureCards = [
  {
    title: "Upload",
    body: "Inspection PDF or photos of the issues you care about.",
  },
  {
    title: "Triage",
    body: "We sort findings, severity, and evidence gaps — no invented dollar amounts.",
  },
  {
    title: "Letter",
    body: "A ready-to-send credit or repair request. You review it. You send it.",
  },
] as const;

export const howItWorks = [
  {
    n: "1",
    title: "Pay $79",
    body: "One price. Stripe test checkout, or stub checkout for the demo.",
  },
  {
    n: "2",
    title: "Upload",
    body: "Inspection PDF or photos, plus what you want to ask for.",
  },
  {
    n: "3",
    title: "We draft",
    body: "Triage and a letter in about 24 hours (marketing SLA).",
  },
  {
    n: "4",
    title: "You send it",
    body: "Approve the draft and send it yourself. We do not send it to the seller.",
  },
] as const;

export const intakeSteps = [
  { key: "details", label: "Details" },
  { key: "upload", label: "Upload" },
  { key: "priorities", label: "Priorities" },
  { key: "submit", label: "Submit" },
] as const;

export const pipelineSteps = [
  { key: "received", label: "Received" },
  { key: "drafting", label: "Drafting" },
  { key: "ready", label: "Ready" },
] as const;

export const triageSystem = `You are triaging a residential inspection for a CreditAsk letter.

Given: address, ask target, ask intent, inspection PDF text and/or photo notes.

Output JSON:
- issues[]: { title, severity: low|med|high, evidence, suggested_ask }
- ask_type: repair_credit | price_reduction | landlord_remedy | other
- estimate_band: string labeled as estimate only (or null if unknown)
- missing_info[]: what’s needed before a strong letter
- risks[]: overclaim / weak evidence flags

Rules:
- Do not invent dollar amounts without evidence in the materials. If unknown, set estimate_band to null.
- Do not threaten legal action, lawsuits, reporting, or attorney involvement.
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
