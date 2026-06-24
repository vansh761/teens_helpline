"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoWithWordmark } from "./Logo";
import { useAuth } from "@/context/AuthContext";

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

const ROLE_NAV: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: "/student", label: "Find a session" },
    { href: "/student/bookings", label: "My bookings" },
  ],
  counselor: [
    { href: "/counselor", label: "My bookings" },
    { href: "/counselor/availability", label: "Availability" },
  ],
  admin: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/counselors", label: "Counselors" },
    { href: "/admin/bookings", label: "All bookings" },
  ],
};

export function DashboardHeader() {
  const { token, role, fullName, logout } = useAuth();
  const router = useRouter();

  const navLinks = role ? ROLE_NAV[role] ?? [] : [];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{ background: "rgba(247,244,236,0.94)", borderColor: "var(--mist)" }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-5 sm:px-8 h-[64px]">
        <Link href={role ? `/${role}` : "/"}>
          <LogoWithWordmark size={32} subtitle="Dashboard" />
        </Link>

        {token && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium" style={{ color: "var(--ink-soft)" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:opacity-70 transition-opacity">
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <a
            href={WEBSITE_URL}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-white"
            style={{ borderColor: "var(--mist-dark)", color: "var(--evergreen-dark)" }}
            title="Back to the Teens Helpline website"
          >
            ← Helpline site
          </a>

          {token ? (
            <div className="flex items-center gap-3">
              {fullName && (
                <span className="hidden sm:inline text-sm" style={{ color: "var(--ink-soft)" }}>
                  {fullName}
                </span>
              )}
              <button
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="text-sm font-medium px-3.5 py-2 rounded-[var(--radius-sm)] border transition-colors hover:bg-white"
                style={{ borderColor: "var(--mist-dark)", color: "var(--ink)" }}
              >
                Log out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 rounded-[var(--radius-sm)]"
              style={{ background: "var(--evergreen)", color: "var(--paper)" }}
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
