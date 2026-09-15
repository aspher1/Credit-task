import Link from "next/link";
import { legalDisclaimer } from "@/lib/copy";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-medium text-stone-800">CreditAsk</p>
        <p className="mt-2 max-w-2xl leading-relaxed">{legalDisclaimer.body}</p>
        <p className="mt-4">
          <Link className="underline-offset-4 hover:underline" href="/admin/login">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
