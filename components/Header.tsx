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
        className="text-sm text-stone-600 transition-colors hover:text-stone-900"
      >
        How it works
      </Link>
    </>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#f7f4ee]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-stone-900">
            CreditAsk
          </span>
          <span className="hidden text-[0.7rem] text-stone-500 sm:block">
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
            <Button variant="outline" size="icon" className="sm:hidden" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>CreditAsk</SheetTitle>
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
