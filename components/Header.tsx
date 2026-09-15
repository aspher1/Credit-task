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
        className="text-sm text-stone-600 hover:text-stone-900"
      >
        How it works
      </Link>
    </>
  );
}

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-base font-semibold tracking-tight text-stone-900">
          CreditAsk
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <NavLinks />
          <Button variant="outline" size="sm" asChild>
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
            <div className="mt-6 flex flex-col gap-4">
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
