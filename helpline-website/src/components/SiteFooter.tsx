import Link from "next/link";
import { LogoMark } from "./Logo";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t" style={{ borderColor: "var(--mist)", background: "var(--paper-raised)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <LogoMark size={28} />
            <span className="font-display font-semibold" style={{ color: "var(--ink)" }}>
              Teens Helpline
            </span>
          </div>
          <p className="text-sm max-w-xs" style={{ color: "var(--ink-soft)" }}>
            A free, judgement-free space built for teenagers 13–19 navigating
            doubts, career choices, peer pressure, and tough days.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ink-soft)" }}>
            Explore
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            <li><Link href="/chat" className="hover:opacity-70">Talk to us</Link></li>
            <li><Link href="/resources" className="hover:opacity-70">Guidance topics</Link></li>
            <li><Link href="/blog" className="hover:opacity-70">Articles &amp; blog</Link></li>
            <li><Link href="/about" className="hover:opacity-70">About this project</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ink-soft)" }}>
            Need a session?
          </h3>
          <p className="text-sm mb-3" style={{ color: "var(--ink-soft)" }}>
            Book career counselling, guidance sessions, or subject tuition
            through our booking dashboard.
          </p>
          <a
            href={DASHBOARD_URL}
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-[var(--radius-sm)]"
            style={{ background: "var(--evergreen-tint)", color: "var(--evergreen-dark)" }}
          >
            Open the dashboard
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div className="trail-divider" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between gap-3 text-xs" style={{ color: "var(--ink-soft)" }}>
        <span>&copy; {new Date().getFullYear()} Teens Helpline. Built for an internship assignment.</span>
        <span>If you are in immediate danger, please contact local emergency services.</span>
      </div>
    </footer>
  );
}
