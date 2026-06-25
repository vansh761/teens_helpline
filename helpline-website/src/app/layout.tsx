import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CrisisStrip } from "@/components/CrisisStrip";

export const metadata: Metadata = {
  title: "Teens Helpline — Guidance for doubts, career, and tough days",
  description:
    "A free, judgement-free space for teenagers 13-19 to get help with doubts, career guidance, peer pressure, stress and anxiety.",
  // Explicitly set metadataBase so Next.js doesn't generate stale open-graph
  // preload hints pointing at removed assets like hero-illustration.png.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://teens-helpline-sepia.vercel.app"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--paper)" }}>
        <CrisisStrip />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
