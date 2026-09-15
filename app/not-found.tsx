import { Frame } from "@/components/Frame";
import { SiteShell } from "@/components/SiteShell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <SiteShell>
      <Frame className="max-w-xl py-20">
        <p className="kicker">404</p>
        <h1 className="display mt-4 text-4xl text-foreground">Not found</h1>
        <p className="mt-4 text-muted-foreground">That page or job does not exist.</p>
        <Button className="mt-8" asChild>
          <Link href="/">Back home</Link>
        </Button>
      </Frame>
    </SiteShell>
  );
}
