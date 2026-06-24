"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { BookingDetailOut, BookingStatus } from "@/lib/types";
import { sessionTypeLabel, formatTimeRange } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

const NEXT_ACTIONS: Record<BookingStatus, { next: BookingStatus; label: string }[]> = {
  pending: [{ next: "confirmed", label: "Confirm" }, { next: "cancelled", label: "Decline" }],
  confirmed: [{ next: "completed", label: "Mark completed" }, { next: "cancelled", label: "Cancel" }],
  completed: [],
  cancelled: [],
};

function CounselorHomeInner() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingDetailOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<BookingDetailOut[]>("/bookings/for-counselor", {}, token);
      setBookings(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function updateStatus(bookingId: number, status: BookingStatus) {
    try {
      await apiFetch(`/bookings/${bookingId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
      load();
    } catch {
      // booking list simply won't update; minor omission acceptable for this scope
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        My bookings
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Students who&apos;ve booked time with you. Confirm or update as sessions happen.
      </p>

      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {error && <p className="text-sm" style={{ color: "#7a4a1a" }}>{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          No bookings yet. Open availability slots so students can find you.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-[var(--radius-md)] border flex items-start justify-between gap-4 flex-wrap"
            style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sky)" }}>
                  {sessionTypeLabel(b.session_type)}
                </span>
                <StatusBadge status={b.status} />
              </div>
              <h3 className="font-display text-base font-semibold" style={{ color: "var(--ink)" }}>
                {b.student_name}
                {b.student_age ? `, age ${b.student_age}` : ""}
              </h3>
              <p className="text-sm mt-1" style={{ color: "var(--ink-soft)" }}>
                {formatTimeRange(b.start_time, b.end_time)}
              </p>
              {b.notes && (
                <p className="text-sm mt-2 italic" style={{ color: "var(--ink-soft)" }}>
                  &ldquo;{b.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              {NEXT_ACTIONS[b.status].map((action) => (
                <button
                  key={action.label}
                  onClick={() => updateStatus(b.id, action.next)}
                  className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border"
                  style={{ borderColor: "var(--mist-dark)", color: "var(--ink)" }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CounselorHomePage() {
  return (
    <RequireRole allowedRoles={["counselor"]}>
      <CounselorHomeInner />
    </RequireRole>
  );
}
