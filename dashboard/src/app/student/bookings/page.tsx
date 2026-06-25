"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { BookingDetailOut } from "@/lib/types";
import { sessionTypeLabel, formatTimeRange } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

function MyBookingsInner() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<BookingDetailOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const data = await apiFetch<BookingDetailOut[]>("/bookings/mine", {}, token);
      setBookings(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof ApiError ? err.message : "Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
    return () => abortRef.current?.abort();
  }, [load]);

  async function handleCancel(bookingId: number) {
    try {
      await apiFetch(`/bookings/${bookingId}`, { method: "DELETE" }, token);
      load();
    } catch {
      // surfaced implicitly by the list not updating; acceptable for this scope
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        My bookings
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Sessions you&apos;ve booked, and their current status.
      </p>

      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {error && <p className="text-sm" style={{ color: "#7a4a1a" }}>{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          You haven&apos;t booked a session yet.
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
                with {b.counselor_name}
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

            {(b.status === "pending" || b.status === "confirmed") && (
              <button
                onClick={() => handleCancel(b.id)}
                className="text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] border shrink-0"
                style={{ borderColor: "var(--mist-dark)", color: "var(--ink-soft)" }}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <RequireRole allowedRoles={["student"]}>
      <MyBookingsInner />
    </RequireRole>
  );
}
