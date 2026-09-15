import assert from "node:assert/strict";
import { readFile } from "fs/promises";
import { test } from "node:test";
import path from "path";

const root = process.cwd();

async function read(rel: string) {
  return readFile(path.join(root, rel), "utf8");
}

test("Spec/Trust locked strings stay exact in lib/copy.ts", async () => {
  const copy = await read("lib/copy.ts");
  const required = [
    "Turn your inspection into a clear credit request.",
    "Get your letter — $79",
    "Upload your inspection. We triage the findings and draft a credit request you send yourself.",
    '"~24h turnaround"',
    "Not legal advice. We draft a letter you review and send — we don’t negotiate with sellers.",
    "Your inspection files are used only to draft your letter. We delete uploads within 30 days.",
    "I understand this is not legal advice. I have reviewed this draft, $79 payment unlocks PDF deliver, and inspection files are used only to draft the letter and deleted within 30 days. I’m responsible for sending this letter and any follow-up.",
    "Prepared with CreditAsk · Not legal advice · Draft for buyer review · We don’t negotiate or send for you",
    'letterAttribution = "Prepared with CreditAsk"',
    "We don’t send this letter to the seller. Sending it — and any follow-up — is yours.",
    "We do not negotiate with the seller or listing agent",
    "Pay ${PRICE_LABEL} to unlock PDF deliver. Stripe test checkout. A human still approves the draft before you send it.",
  ];
  for (const snippet of required) {
    assert.ok(copy.includes(snippet), `missing locked copy: ${snippet}`);
  }
  assert.equal(copy.includes("via CreditAsk"), false);
});

test("public /pay does not dump stub checkout or env setup", async () => {
  const payPage = await read("app/pay/page.tsx");
  const payActions = await read("components/PayActions.tsx");
  const footer = await read("components/Footer.tsx");
  const combined = `${payPage}\n${payActions}`;
  for (const forbidden of [
    "STRIPE_SECRET_KEY",
    "STRIPE_PAYMENT_LINK_URL",
    ".env.local",
    "stub checkout",
    "allowDemo",
    "Continue in test/stub mode",
  ]) {
    assert.equal(combined.includes(forbidden), false, `public pay leaked ${forbidden}`);
  }
  assert.equal(footer.includes("/admin/login"), false);
});
