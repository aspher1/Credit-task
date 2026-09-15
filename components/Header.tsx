"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { product } from "@/lib/copy";

const cta = product.cta;

function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      <Link
        href="/#how"
        onClick={onClick}
        className="text-[0.8125rem] tracking-[0.08em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        How it works
      </Link>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#070706]/72 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex flex-col">
          <span className="text-[0.7rem] font-medium tracking-[0.38em] text-foreground uppercase">
            CreditAsk
          </span>
          <span className="mt-0.5 hidden text-[0.62rem] tracking-[0.16em] text-muted-foreground uppercase sm:block">
            {product.tagline}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <NavLinks />
          <Button size="sm" asChild>
            <Link href="/pay">{cta}</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="sm:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="font-display text-xl tracking-tight">CreditAsk</SheetTitle>
            <div className="mt-8 flex flex-col gap-6">
              <NavLinks />
              <Button asChild>
                <Link href="/pay">{cta}</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
