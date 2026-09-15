import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteShell>
      <h1 className="text-3xl font-semibold tracking-tight text-stone-900">Not found</h1>
      <p className="mt-2 text-muted-foreground">That page or job does not exist.</p>
      <Button className="mt-6" asChild>
        <Link href="/">Back home</Link>
      </Button>
    </SiteShell>
  );
}
