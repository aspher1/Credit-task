export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`rounded-lg border border-amber-200 bg-amber-50 text-amber-950 ${compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"}`}
      role="note"
    >
      <strong>Not legal advice.</strong> CreditAsk is not a law firm and is not
      your attorney. We do not negotiate with the seller. You review, approve,
      and send any letter yourself.
    </aside>
  );
}
