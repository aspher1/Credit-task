import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import "./globals.css";
import { product } from "@/lib/copy";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${product.name} — ${product.tagline}`,
  description:
    "Upload a home inspection. We triage findings and draft a ready-to-send credit or repair request letter. $79. Not legal advice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body
        className={`${sans.variable} ${serif.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
