"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { AdminStats } from "@/lib/types";

function StatCard({ label, value, accent }: { label: string; value: number; accent?: "amber" }) {
  return (
    <div
      className="p-5 rounded-[var(--radius-md)] border"
      style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>
        {label}
      </p>
      <p
        className="font-display text-3xl font-semibold"
        style={{ color: accent === "amber" ? "#7a4a1a" : "var(--ink)" }}
      >
        {value}
      </p>
    </div>
  );
}

function AdminOverviewInner() {
  const { token, fullName } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<AdminStats>("/admin/stats", {}, token)
      .then(setStats)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load stats."));
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Overview
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Welcome back, {fullName}. Here&apos;s how Teens Helpline is doing.
      </p>

      {error && <p className="text-sm mb-4" style={{ color: "#7a4a1a" }}>{error}</p>}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard label="Students" value={stats.total_students} />
          <StatCard label="Counsellors" value={stats.total_counselors} />
          <StatCard label="Total bookings" value={stats.total_bookings} />
          <StatCard label="Pending bookings" value={stats.pending_bookings} />
          <StatCard label="Completed sessions" value={stats.completed_bookings} />
          <StatCard label="Chat messages" value={stats.total_chat_messages} />
          <StatCard label="Flagged for crisis" value={stats.flagged_chat_messages} accent="amber" />
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Link
          href="/admin/counselors"
          className="text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-sm)]"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Manage counsellors
        </Link>
        <Link
          href="/admin/bookings"
          className="text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-sm)] border"
          style={{ borderColor: "var(--mist-dark)", color: "var(--ink)" }}
        >
          View all bookings
        </Link>
      </div>
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <AdminOverviewInner />
    </RequireRole>
  );
}
