import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function SiteShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header admin={admin} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
      <Footer />
    </div>
  );
}
