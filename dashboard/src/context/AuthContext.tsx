"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import type { TokenResponse, UserRole } from "@/lib/types";

interface AuthState {
  token: string | null;
  role: UserRole | null;
  fullName: string | null;
  userId: number | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signupStudent: (data: {
    full_name: string;
    email: string;
    password: string;
    age: number;
    grade?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "th_dashboard_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    role: null,
    fullName: null,
    userId: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setState({ ...parsed, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const persist = useCallback((resp: TokenResponse) => {
    const next: AuthState = {
      token: resp.access_token,
      role: resp.role,
      fullName: resp.full_name,
      userId: resp.user_id,
      isLoading: false,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const resp = await apiFetch<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      persist(resp);
    },
    [persist]
  );

  const signupStudent = useCallback(
    async (data: { full_name: string; email: string; password: string; age: number; grade?: string }) => {
      const resp = await apiFetch<TokenResponse>("/auth/signup/student", {
        method: "POST",
        body: JSON.stringify(data),
      });
      persist(resp);
    },
    [persist]
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ token: null, role: null, fullName: null, userId: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signupStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
