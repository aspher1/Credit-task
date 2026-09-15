import { product } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-[var(--muted)]">
        <p className="max-w-3xl leading-relaxed">{product.disclaimer}</p>
        <p className="mt-3">
          CreditAsk is a document-prep service. Letters are drafts until a human
          approves them. We never claim to be your attorney.
        </p>
      </div>
    </footer>
  );
}
