"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { SlotWithCounselorOut } from "@/lib/types";
import { sessionTypeLabel, formatTimeRange } from "@/lib/format";

const FILTERS = [
  { key: "", label: "All" },
  { key: "career", label: "Career" },
  { key: "mental_health", label: "Mental health" },
  { key: "peer_pressure", label: "Peer pressure" },
  { key: "tuition", label: "Tuition" },
];

function StudentHomeInner() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<SlotWithCounselorOut[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadSlots = useCallback(async () => {
    // Cancel any previous in-flight request to avoid stale state updates
    // that trigger the "async response / message channel closed" error.
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);
    try {
      const qs = filter ? `?session_type=${filter}` : "";
      const data = await apiFetch<SlotWithCounselorOut[]>(`/slots/open${qs}`, {}, token);
      setSlots(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof ApiError ? err.message : "Could not load available sessions.");
    } finally {
      setLoading(false);
    }
  }, [filter, token]);

  useEffect(() => {
    loadSlots();
    return () => abortRef.current?.abort();
  }, [loadSlots]);

  async function handleBook(slotId: number) {
    setFeedback(null);
    try {
      await apiFetch(
        "/bookings",
        { method: "POST", body: JSON.stringify({ slot_id: slotId, notes: notes || undefined }) },
        token
      );
      setFeedback("Booked! You'll see it under My bookings.");
      setBookingSlotId(null);
      setNotes("");
      loadSlots();
    } catch (err) {
      setFeedback(err instanceof ApiError ? err.message : "Could not book this session.");
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Find a session
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Browse open slots from counsellors and tutors, and book what fits your schedule.
      </p>

      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors"
            style={
              filter === f.key
                ? { background: "var(--evergreen)", color: "var(--paper)", borderColor: "var(--evergreen)" }
                : { background: "var(--paper-raised)", color: "var(--ink-soft)", borderColor: "var(--mist)" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {feedback && (
        <p className="text-sm px-4 py-2.5 rounded-[var(--radius-sm)] mb-5" style={{ background: "var(--evergreen-tint)", color: "var(--evergreen-dark)" }}>
          {feedback}
        </p>
      )}

      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading sessions…</p>}
      {error && <p className="text-sm" style={{ color: "#7a4a1a" }}>{error}</p>}

      {!loading && !error && slots.length === 0 && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
          No open sessions right now for this filter — check back soon.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="p-5 rounded-[var(--radius-md)] border flex flex-col gap-3"
            style={{ background: "var(--paper-raised)", borderColor: "var(--mist)", boxShadow: "var(--shadow-soft)" }}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sky)" }}>
                {sessionTypeLabel(slot.session_type)}
              </span>
              <h3 className="font-display text-base font-semibold mt-1" style={{ color: "var(--ink)" }}>
                {slot.counselor_name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                {slot.specialization}
              </p>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--ink)" }}>
              {formatTimeRange(slot.start_time, slot.end_time)}
            </p>

            {bookingSlotId === slot.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What would you like help with? (optional)"
                  className="w-full px-3 py-2 rounded-[var(--radius-sm)] border text-sm outline-none resize-none"
                  rows={2}
                  style={{ borderColor: "var(--mist-dark)", background: "var(--paper)", color: "var(--ink)" }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBook(slot.id)}
                    className="flex-1 text-sm font-semibold px-3 py-2 rounded-[var(--radius-sm)]"
                    style={{ background: "var(--evergreen)", color: "var(--paper)" }}
                  >
                    Confirm booking
                  </button>
                  <button
                    onClick={() => setBookingSlotId(null)}
                    className="text-sm font-medium px-3 py-2 rounded-[var(--radius-sm)] border"
                    style={{ borderColor: "var(--mist-dark)", color: "var(--ink-soft)" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setBookingSlotId(slot.id)}
                className="text-sm font-semibold px-3 py-2 rounded-[var(--radius-sm)]"
                style={{ background: "var(--evergreen-tint)", color: "var(--evergreen-dark)" }}
              >
                Book this slot
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentHomePage() {
  return (
    <RequireRole allowedRoles={["student"]}>
      <StudentHomeInner />
    </RequireRole>
  );
}
