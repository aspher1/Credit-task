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
        className="text-sm text-white/70 transition-colors hover:text-white"
      >
        How it works
      </Link>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b1220]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-[#f7f4ee]">
            CreditAsk
          </span>
          <span className="hidden text-[0.7rem] text-white/50 sm:block">
            {product.tagline}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 sm:flex">
          <NavLinks />
          <Button asChild>
            <Link href="/pay">{cta}</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-white/20 bg-transparent text-[#f7f4ee] hover:bg-white/5 sm:hidden"
              aria-label="Open menu"
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>CreditAsk</SheetTitle>
            <div className="mt-8 flex flex-col gap-6">
              <Link
                href="/#how"
                className="text-sm text-stone-600 hover:text-stone-900"
              >
                How it works
              </Link>
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
