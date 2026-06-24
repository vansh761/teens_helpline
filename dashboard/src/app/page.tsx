"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function DashboardHome() {
  const { token, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token && role) {
      router.replace(`/${role}`);
    }
  }, [isLoading, token, role, router]);

  if (isLoading) return null;
  if (token && role) return null; // redirecting

  return (
    <div className="max-w-md mx-auto px-5 py-20 sm:py-28 text-center">
      <h1 className="font-display text-3xl font-semibold mb-3" style={{ color: "var(--ink)" }}>
        Teens Helpline Dashboard
      </h1>
      <p className="text-sm mb-10 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
        Book career counselling, guidance sessions, and subject tuition.
        Counsellors and admins, sign in here too.
      </p>
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="text-sm font-semibold px-5 py-3 rounded-[var(--radius-sm)]"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="text-sm font-semibold px-5 py-3 rounded-[var(--radius-sm)] border"
          style={{ borderColor: "var(--mist-dark)", color: "var(--ink)" }}
        >
          New student? Create an account
        </Link>
      </div>
    </div>
  );
}
