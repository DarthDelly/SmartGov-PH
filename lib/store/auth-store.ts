"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { api } from "@/lib/api";

export type Role = "resident" | "staff" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  barangay: string;
  avatar: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post("/api/auth/login/", { email, password });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.detail ?? "Login failed. Please try again.");
        }
        const user: AuthUser = await res.json();
        set({ user, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await api.post("/api/auth/logout/");
        } catch {
          // Network error — still clear local state.
        } finally {
          set({ user: null, isAuthenticated: false });
        }
      },

      /**
       * Called by the api.ts 401 interceptor. Attempts to refresh the access
       * token via the refresh cookie. Returns true on success, false if the
       * session is fully expired.
       */
      refreshAuth: async () => {
        const res = await api.post("/api/auth/refresh/");
        return res.ok;
      },

      clearAuth: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "smartgov-auth",
      // Only persist non-sensitive public user info — no tokens.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
