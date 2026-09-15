import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  width = "default",
}: {
  children: React.ReactNode;
  width?: "landing" | "intake" | "default";
  admin?: boolean;
}) {
  const max =
    width === "landing"
      ? "max-w-3xl"
      : width === "intake"
        ? "max-w-lg md:max-w-2xl"
        : "max-w-3xl";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className={cn("mx-auto w-full flex-1 px-4 py-10", max)}>{children}</main>
      <Footer />
    </div>
  );
}
