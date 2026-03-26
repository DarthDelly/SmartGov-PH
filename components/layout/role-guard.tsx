"use client";

import { useAuthStore, type Role } from "@/lib/store/auth-store";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();
  const role = user?.role ?? "resident";
  if (!allowedRoles.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
