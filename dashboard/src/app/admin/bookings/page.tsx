"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { BookingDetailOut } from "@/lib/types";
import { sessionTypeLabel, formatTimeRange } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

function AdminBookingsInner() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingDetailOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<BookingDetailOut[]>("/bookings/all", {}, token)
      .then((data) => { if (!cancelled) setBookings(data); })
      .catch((err) => { if (!cancelled) setError(err instanceof ApiError ? err.message : "Could not load bookings."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        All bookings
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Every session booked across the platform.
      </p>

      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {error && <p className="text-sm" style={{ color: "#7a4a1a" }}>{error}</p>}

      <div className="rounded-[var(--radius-md)] border overflow-hidden" style={{ borderColor: "var(--mist)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--evergreen-tint)" }}>
              <Th>Student</Th>
              <Th>Counsellor</Th>
              <Th>Type</Th>
              <Th>When</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t" style={{ borderColor: "var(--mist)" }}>
                <Td>{b.student_name}</Td>
                <Td>{b.counselor_name}</Td>
                <Td>{sessionTypeLabel(b.session_type)}</Td>
                <Td className="font-mono text-xs">{formatTimeRange(b.start_time, b.end_time)}</Td>
                <Td><StatusBadge status={b.status} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && bookings.length === 0 && (
          <p className="text-sm p-5" style={{ color: "var(--ink-soft)" }}>No bookings yet.</p>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--evergreen-dark)" }}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 ${className}`} style={{ color: "var(--ink)" }}>
      {children}
    </td>
  );
}

export default function AdminBookingsPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <AdminBookingsInner />
    </RequireRole>
  );
}
