"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Frame } from "@/components/Frame";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { product } from "@/lib/copy";
import { cn } from "@/lib/utils";

const cta = product.cta;

function NavLinks({
  onClick,
  tone,
}: {
  onClick?: () => void;
  tone: "cinematic" | "paper";
}) {
  const linkClass =
    tone === "cinematic"
      ? "text-sm text-[var(--paper)]/70 transition-colors hover:text-[var(--paper)]"
      : "text-sm text-muted-foreground transition-colors hover:text-foreground";

  return (
    <>
      <Link href="/#how" onClick={onClick} className={linkClass}>
        How it works
      </Link>
      <Link href="/#whats-included" onClick={onClick} className={linkClass}>
        What’s included
      </Link>
    </>
  );
}

export function Header({ chrome = "paper" }: { chrome?: "paper" | "cinematic" }) {
  const cinematic = chrome === "cinematic";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b",
        cinematic
          ? "border-white/10 bg-[#07090e]/85 backdrop-blur-md"
          : "border-border bg-[var(--paper)]/90 backdrop-blur-md",
      )}
    >
      <Frame className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span
            className={cn(
              "block size-2.5 rotate-45 border",
              cinematic ? "border-[var(--paper)]/80" : "border-foreground",
            )}
            aria-hidden
          />
          <span className="flex flex-col leading-none">
            <span
              className={cn(
                "text-[0.9375rem] font-semibold tracking-tight",
                cinematic ? "text-[var(--paper)]" : "text-foreground",
              )}
            >
              CreditAsk
            </span>
            <span
              className={cn(
                "mt-1 hidden text-[0.65rem] tracking-[0.12em] uppercase sm:block",
                cinematic ? "text-[var(--paper)]/45" : "text-muted-foreground",
              )}
            >
              {product.tagline}
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <NavLinks tone={cinematic ? "cinematic" : "paper"} />
          <Button variant={cinematic ? "inverse" : "default"} asChild>
            <Link href="/pay">{cta}</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant={cinematic ? "inverse" : "outline"}
              size="icon"
              className={cn(
                "sm:hidden",
                cinematic && "border border-white/20 bg-transparent text-[var(--paper)] hover:bg-white/5",
              )}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>CreditAsk</SheetTitle>
            <div className="mt-10 flex flex-col gap-6">
              <NavLinks tone="paper" />
              <Button asChild>
                <Link href="/pay">{cta}</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Frame>
    </header>
  );
}
