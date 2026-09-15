import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";

export function SiteShell({
  children,
  chrome = "paper",
}: {
  children: React.ReactNode;
  chrome?: "paper" | "cinematic";
}) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col text-foreground",
        chrome === "cinematic" ? "bg-[var(--ink-deep)]" : "bg-background",
      )}
    >
      <Header chrome={chrome} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
