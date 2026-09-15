import { SiteShell } from "@/components/SiteShell";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteShell>
      <h1 className="font-serif text-3xl text-[var(--navy)]">Not found</h1>
      <p className="mt-2 text-[var(--muted)]">That page or job does not exist.</p>
      <Link className="btn-primary mt-6" href="/">
        Back home
      </Link>
    </SiteShell>
  );
}
