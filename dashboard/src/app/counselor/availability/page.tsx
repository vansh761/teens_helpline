"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { SlotOut } from "@/lib/types";
import { formatTimeRange } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

function AvailabilityInner() {
  const { token } = useAuth();
  const [slots, setSlots] = useState<SlotOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", startTime: "", durationMinutes: "30" });
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<SlotOut[]>("/slots/mine", {}, token);
      setSlots(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load your availability.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.date || !form.startTime) return;
    setCreating(true);
    setError(null);
    try {
      const start = new Date(`${form.date}T${form.startTime}`);
      const end = new Date(start.getTime() + parseInt(form.durationMinutes, 10) * 60000);
      await apiFetch(
        "/slots",
        { method: "POST", body: JSON.stringify({ start_time: start.toISOString(), end_time: end.toISOString() }) },
        token
      );
      setForm({ date: "", startTime: "", durationMinutes: form.durationMinutes });
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create this slot.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(slotId: number) {
    try {
      await apiFetch(`/slots/${slotId}`, { method: "DELETE" }, token);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not remove this slot.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Availability
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Open time slots so students can book sessions with you.
      </p>

      <form
        onSubmit={handleCreate}
        className="p-5 rounded-[var(--radius-md)] border mb-10 flex flex-col sm:flex-row gap-3 sm:items-end"
        style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Date</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper)", color: "var(--ink)" }}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Start time</label>
          <input
            type="time"
            required
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper)", color: "var(--ink)" }}
          />
        </div>
        <div className="w-32">
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>Duration</label>
          <select
            value={form.durationMinutes}
            onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
            className="w-full px-3 py-2 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper)", color: "var(--ink)" }}
          >
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-sm)] disabled:opacity-50"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          Add slot
        </button>
      </form>

      {error && <p className="text-sm mb-4" style={{ color: "#7a4a1a" }}>{error}</p>}
      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {!loading && slots.length === 0 && (
        <p className="text-sm" style={{ color: "var(--ink-soft)" }}>You haven&apos;t opened any slots yet.</p>
      )}

      <div className="flex flex-col gap-2.5">
        {slots.map((slot) => (
          <div
            key={slot.id}
            className="px-5 py-3.5 rounded-[var(--radius-sm)] border flex items-center justify-between gap-3"
            style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
          >
            <span className="text-sm" style={{ color: "var(--ink)" }}>
              {formatTimeRange(slot.start_time, slot.end_time)}
            </span>
            <div className="flex items-center gap-3">
              <StatusBadge status={slot.status} />
              {slot.status === "open" && (
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="text-xs font-medium underline"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AvailabilityPage() {
  return (
    <RequireRole allowedRoles={["counselor"]}>
      <AvailabilityInner />
    </RequireRole>
  );
}
