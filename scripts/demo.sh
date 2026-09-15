#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE="${1:-${APP_URL:-http://localhost:3000}}"
BASE="${BASE%/}"

if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example"
  cp .env.example .env.local
fi

echo "==> CreditAsk demo against $BASE"
echo "==> Waiting for /api/health (start the app with: npm run dev)"

ok=0
for _ in $(seq 1 60); do
  if curl -sf "$BASE/api/health" >/dev/null; then
    ok=1
    break
  fi
  sleep 1
done

if [ "$ok" != "1" ]; then
  echo "App did not become ready at $BASE"
  echo "In another terminal: cp .env.example .env.local && npm run dev"
  exit 1
fi

echo "==> Seed example job"
curl -sf -X POST "$BASE/api/demo/setup" | tee /tmp/creditask-demo-setup.json
echo

echo '==> Demo $79 payment (stub, no Stripe charge)'
PAY_JSON="$(curl -sf -X POST "$BASE/api/checkout" \
  -H "Content-Type: application/json" \
  -d '{"mode":"demo"}')"
echo "$PAY_JSON"
PAYMENT_ID="$(printf '%s' "$PAY_JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{process.stdout.write(JSON.parse(s).paymentId||"")})')"

FIXTURE="$ROOT/scripts/fixtures/sample-inspection.pdf"
if [ ! -f "$FIXTURE" ]; then
  echo "Missing $FIXTURE"
  exit 1
fi

echo "==> Intake with sample inspection PDF"
INTAKE_JSON="$(curl -sf -X POST "$BASE/api/intake" \
  -F "address=456 Demo Street, Springfield, IL 62704" \
  -F "buyerName=Sam Buyer" \
  -F "askTargetRole=seller" \
  -F "askTargetName=Pat Seller" \
  -F "askIntent=repair_credit" \
  -F "paymentId=$PAYMENT_ID" \
  -F "pdf=@${FIXTURE};type=application/pdf")"
echo "$INTAKE_JSON"
JOB_ID="$(printf '%s' "$INTAKE_JSON" | node -e 'let s="";process.stdin.on("data",d=>s+=d);process.stdin.on("end",()=>{process.stdout.write(JSON.parse(s).id||"")})')"

if [ -z "$JOB_ID" ]; then
  echo "Intake did not return a job id"
  exit 1
fi

echo "==> Job after triage/draft"
curl -sf "$BASE/api/jobs/$JOB_ID"
echo

echo "==> Approve (demo helper; UI path is /admin then /jobs/$JOB_ID/approve)"
curl -sf -X POST "$BASE/api/demo/advance" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\":\"$JOB_ID\",\"action\":\"approve\"}" >/dev/null

echo "==> Mark delivered"
curl -sf -X POST "$BASE/api/demo/advance" \
  -H "Content-Type: application/json" \
  -d "{\"jobId\":\"$JOB_ID\",\"action\":\"deliver\"}" >/dev/null

echo "==> Printable letter should be unlocked"
HTML="$(curl -sf "$BASE/jobs/$JOB_ID/pdf")"
echo "$HTML" | grep -q "Sam Buyer"
echo "$HTML" | grep -q "456 Demo Street"
echo "$HTML" | grep -q "Prepared with CreditAsk"
echo "$HTML" | grep -q "Draft for buyer review"

echo
echo "Demo path OK."
echo "  Landing:     $BASE/"
echo "  Pay:         $BASE/pay"
echo "  New job:     $BASE/jobs/$JOB_ID"
echo "  Approve UI:  $BASE/jobs/$JOB_ID/approve"
echo "  PDF:         $BASE/jobs/$JOB_ID/pdf"
echo "  Example job: $BASE/jobs/example"
echo "  Admin:       $BASE/admin/login"
echo
echo "Disclaimer: CreditAsk is not a law firm and does not negotiate with the seller."
