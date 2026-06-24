"use client";

import { useEffect, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, ApiError } from "@/lib/api";
import type { CounselorOut } from "@/lib/types";
import { sessionTypeLabel } from "@/lib/format";

const SESSION_TYPES = [
  { value: "career", label: "Career counselling" },
  { value: "mental_health", label: "Mental health counselling" },
  { value: "peer_pressure", label: "Peer pressure guidance" },
  { value: "tuition", label: "Subject tuition" },
];

function AdminCounselorsInner() {
  const { token } = useAuth();
  const [counselors, setCounselors] = useState<CounselorOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    specialization: "",
    session_type: "career",
    bio: "",
    subject: "",
    years_experience: "",
  });

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch<CounselorOut[]>("/counselors", {}, token);
      setCounselors(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load counsellors.");
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
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await apiFetch(
        "/auth/signup/counselor",
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            years_experience: form.years_experience ? parseInt(form.years_experience, 10) : undefined,
            subject: form.subject || undefined,
            bio: form.bio || undefined,
          }),
        },
        token
      );
      setSuccess(`${form.full_name} added as a counsellor.`);
      setForm({ full_name: "", email: "", password: "", specialization: "", session_type: "career", bio: "", subject: "", years_experience: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not create this counsellor account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold" style={{ color: "var(--ink)" }}>
          Counsellors
        </h1>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-sm)]"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          {showForm ? "Close" : "Add counsellor"}
        </button>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Counsellor and tutor accounts are created here by an administrator.
      </p>

      {success && (
        <p className="text-sm px-4 py-2.5 rounded-[var(--radius-sm)] mb-5" style={{ background: "var(--evergreen-tint)", color: "var(--evergreen-dark)" }}>
          {success}
        </p>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-5 rounded-[var(--radius-md)] border mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}
        >
          <Field label="Full name">
            <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Email">
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Temporary password">
            <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Session type">
            <select value={form.session_type} onChange={(e) => setForm({ ...form, session_type: e.target.value })} className={inputClass} style={inputStyle}>
              {SESSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Specialization">
            <input required placeholder="e.g. Career Counselling" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className={inputClass} style={inputStyle} />
          </Field>
          <Field label="Years of experience">
            <input type="number" min={0} value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className={inputClass} style={inputStyle} />
          </Field>
          {form.session_type === "tuition" && (
            <Field label="Subject">
              <input placeholder="e.g. Mathematics" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} style={inputStyle} />
            </Field>
          )}
          <div className="sm:col-span-2">
            <Field label="Bio (optional)">
              <textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={`${inputClass} resize-none`} style={inputStyle} />
            </Field>
          </div>

          {error && (
            <p className="sm:col-span-2 text-sm px-3 py-2 rounded-[var(--radius-sm)]" style={{ background: "var(--amber-tint)", color: "#7a4a1a" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="sm:col-span-2 text-sm font-semibold px-4 py-2.5 rounded-[var(--radius-sm)] disabled:opacity-50"
            style={{ background: "var(--evergreen)", color: "var(--paper)" }}
          >
            {submitting ? "Creating…" : "Create counsellor account"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {counselors.map((c) => (
          <div key={c.id} className="p-5 rounded-[var(--radius-md)] border" style={{ background: "var(--paper-raised)", borderColor: "var(--mist)" }}>
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--sky)" }}>
              {sessionTypeLabel(c.session_type)}
            </span>
            <h3 className="font-display text-base font-semibold mt-1" style={{ color: "var(--ink)" }}>
              {c.full_name}
            </h3>
            <p className="text-sm mt-0.5" style={{ color: "var(--ink-soft)" }}>{c.specialization}</p>
            {c.years_experience != null && (
              <p className="text-xs mt-2 font-mono" style={{ color: "var(--ink-soft)" }}>{c.years_experience} yrs experience</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputClass = "w-full px-3 py-2 rounded-[var(--radius-sm)] border text-sm outline-none";
const inputStyle = { borderColor: "var(--mist-dark)", background: "var(--paper)", color: "var(--ink)" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>{label}</label>
      {children}
    </div>
  );
}

export default function AdminCounselorsPage() {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <AdminCounselorsInner />
    </RequireRole>
  );
}
