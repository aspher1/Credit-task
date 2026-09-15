import Link from "next/link";
import { product } from "@/lib/copy";

export function Header({ admin }: { admin?: boolean }) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="group">
          <div className="font-serif text-xl tracking-tight text-[var(--navy)]">
            {product.name}
          </div>
          <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            {product.tagline}
          </div>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link className="text-[var(--muted)] hover:text-[var(--navy)]" href="/#how">
            How it works
          </Link>
          <Link className="text-[var(--muted)] hover:text-[var(--navy)]" href="/pay">
            Pay {product.price}
          </Link>
          <Link className="text-[var(--muted)] hover:text-[var(--navy)]" href="/intake">
            Intake
          </Link>
          <Link
            className="rounded-full border border-[var(--line)] px-3 py-1.5 text-[var(--navy)] hover:bg-[var(--cream)]"
            href={admin ? "/admin" : "/admin/login"}
          >
            {admin ? "Jobs" : "Admin"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
