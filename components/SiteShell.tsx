import { Atmosphere } from "@/components/Atmosphere";
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
      ? "max-w-6xl"
      : width === "intake"
        ? "max-w-lg md:max-w-2xl"
        : "max-w-3xl";

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Atmosphere />
      <Header />
      <main
        className={cn(
          "relative z-10 mx-auto w-full flex-1",
          width === "landing" ? "px-5 py-0 sm:px-8" : "px-4 py-10 sm:px-6 sm:py-14",
          max,
        )}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
