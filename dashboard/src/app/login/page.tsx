"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/"); // root page resolves to the correct role home
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16 sm:py-24">
      <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
        Log in
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--ink-soft)" }}>
        Students, counsellors, and admins all sign in here.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--ink-soft)" }}>
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] border text-sm outline-none"
            style={{ borderColor: "var(--mist-dark)", background: "var(--paper-raised)", color: "var(--ink)" }}
          />
        </div>

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
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm mt-6 text-center" style={{ color: "var(--ink-soft)" }}>
        New student?{" "}
        <Link href="/signup" className="font-medium" style={{ color: "var(--evergreen)" }}>
          Create an account
        </Link>
      </p>
    </div>
  );
}
