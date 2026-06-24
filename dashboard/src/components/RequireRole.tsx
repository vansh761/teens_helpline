"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/types";

/**
 * Wraps a page and redirects to /login if unauthenticated, or to that
 * role's home if the signed-in user's role isn't in allowedRoles. Renders
 * nothing (or a tiny loading state) until the check resolves, so protected
 * content never flashes before the redirect happens.
 */
export function RequireRole({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { token, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!token || !role) {
      router.replace("/login");
      return;
    }
    if (!allowedRoles.includes(role)) {
      router.replace(`/${role}`);
    }
  }, [isLoading, token, role, allowedRoles, router]);

  if (isLoading || !token || !role || !allowedRoles.includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm" style={{ color: "var(--ink-soft)" }}>
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
