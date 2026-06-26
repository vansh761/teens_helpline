"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function SignupPage() {
  const { signupStudent } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", age: "", grade: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const age = parseInt(form.age, 10);
    if (!age || age < 13 || age > 19) {
      setError("Teens Helpline is for students aged 13 to 19.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await signupStudent({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        age,
        grade: form.grade || undefined,
      });
      router.replace("/student");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16 sm:py-24">
      <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Create your account
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        For students aged 13–19. Counsellor and admin accounts are created by
        an administrator.
      </p>

      <div className="mb-6 p-4 rounded-[var(--radius-md)]" style={{ background: "var(--sky-tint)" }}>
        <p className="text-sm" style={{ color: "var(--ink)" }}>
          This form creates a <strong>student</strong> account. Counsellor and
          admin accounts are created by an administrator — if you&apos;re a
          counsellor, ask your admin to set up your login instead.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Full name">
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Age">
            <input
              type="number"
              min={13}
              max={19}
              required
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
              style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
            />
          </Field>
          <Field label="Grade (optional)">
            <input
              placeholder="e.g. 11th"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
              style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
            />
          </Field>
        </div>
        <Field label="Password">
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
          />
        </Field>

        {error && (
          <p className="text-sm px-3 py-2 rounded-[var(--radius-sm)]" style={{ background: "var(--amber-tint)", color: "#7a4a1a" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 text-sm font-semibold px-5 py-3 rounded-[var(--radius-sm)] disabled:opacity-50"
          style={{ background: "var(--evergreen)", color: "var(--paper)" }}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="text-sm mt-6 text-center" style={{ color: "var(--ink-soft)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-medium" style={{ color: "var(--evergreen)" }}>
          Log in
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
