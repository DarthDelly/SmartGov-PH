"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore, type Role } from "@/lib/store/auth-store";
import { Building2 } from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  { value: "resident", label: "Resident", description: "Access permits, concerns & notifications" },
  { value: "staff", label: "Barangay Staff", description: "Manage requests, residents & blotter" },
  { value: "admin", label: "Municipal Admin", description: "Analytics, monitoring & oversight" },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("resident");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const names: Record<Role, string> = {
      resident: "Maria Santos",
      staff: "Juan dela Cruz",
      admin: "Ana Reyes",
    };
    const barangays: Record<Role, string> = {
      resident: "Brgy. San Isidro",
      staff: "Brgy. San Isidro",
      admin: "Municipality of Calamba",
    };

    login(selectedRole, { name: names[selectedRole], barangay: barangays[selectedRole] });
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-lg animate-fade-in flex flex-col items-center gap-0">

      {/* Logo */}
      <AppLogo size="lg" />

      {/* Card */}
      <div className="w-full rounded-2xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="px-8 pt-7 pb-1 text-left">
          <h2 className="font-jakarta font-semibold text-[var(--text-primary)] text-lg leading-snug">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn}>
          <div className="px-8 pt-5 pb-2 space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)]">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-[var(--text-secondary)]">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {/* DEV role switcher */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-medium text-[var(--text-secondary)]">Role</Label>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wide">
                  Dev only
                </span>
              </div>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as Role)}>
                <SelectTrigger className="w-full">
                  <span className="font-medium">
                    {ROLE_OPTIONS.find((o) => o.value === selectedRole)?.label}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="font-medium">{opt.label}</span>
                      <span className="block text-xs text-[var(--text-muted)]">{opt.description}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full font-medium h-10" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--brand-600)] dark:text-[var(--brand-400)] font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
