import Link from "next/link";
import { LogoWithWordmark } from "./Logo";

const NAV_LINKS = [
  { href: "/chat", label: "Talk to us" },
  { href: "/resources", label: "Guidance" },
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
];

// The dashboard lives at a separate deployment. In production this should
// point at the real dashboard URL (e.g. https://dashboard.teenshelpline.org);
// for local dev it falls back to the conventional Next.js dev port for the
// second app.
const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{ background: "rgba(247,244,236,0.92)", borderColor: "var(--mist)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 h-[68px]">
        <Link href="/" className="shrink-0">
          <LogoWithWordmark size={34} />
        </Link>

        <nav className="flex items-center gap-4 sm:gap-7 text-sm font-medium flex-wrap" style={{ color: "var(--ink-soft)" }}>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70 transition-opacity">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={DASHBOARD_URL}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-white"
            style={{ borderColor: "var(--mist-dark)", color: "var(--evergreen-dark)" }}
            title="Book a counselling or tuition session"
          >
            Booking dashboard
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <Link
            href="/chat"
            className="inline-flex items-center text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)] transition-opacity hover:opacity-90"
            style={{ background: "var(--evergreen)", color: "var(--paper)" }}
          >
            Get support
          </Link>
        </div>
      </div>
    </header>
  );
}
