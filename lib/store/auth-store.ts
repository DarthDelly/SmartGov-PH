import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "resident" | "staff" | "admin";

export interface AuthUser {
  name: string;
  barangay: string;
  avatar?: string;
}

interface AuthStore {
  role: Role;
  user: AuthUser;
  isAuthenticated: boolean;
  setRole: (role: Role) => void;
  setUser: (user: AuthUser) => void;
  login: (role: Role, user: AuthUser) => void;
  logout: () => void;
}

const DEFAULT_USERS: Record<Role, AuthUser> = {
  resident: { name: "Maria Santos", barangay: "Brgy. San Isidro" },
  staff: { name: "Juan dela Cruz", barangay: "Brgy. San Isidro" },
  admin: { name: "Ana Reyes", barangay: "Municipality of Calamba" },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      role: "resident",
      user: DEFAULT_USERS.resident,
      isAuthenticated: false,

      setRole: (role) =>
        set({ role, user: DEFAULT_USERS[role] }),

      setUser: (user) => set({ user }),

      login: (role, user) =>
        set({ role, user, isAuthenticated: true }),

      logout: () =>
        set({
          role: "resident",
          user: DEFAULT_USERS.resident,
          isAuthenticated: false,
        }),
    }),
    {
      name: "smartgov-auth",
    }
  )
);
