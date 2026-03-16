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
import { Building2, CheckCircle2 } from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";

const BARANGAY_OPTIONS = [
  "Brgy. San Isidro",
  "Brgy. Poblacion",
  "Brgy. San Roque",
];

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    barangay: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setDone(true);
  };

  /* ── Success state ── */
  if (done) {
    return (
      <div className="w-full max-w-lg animate-fade-in flex flex-col items-center gap-0">
        <AppLogo size="lg" />

        <div className="w-full rounded-2xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-8 flex flex-col items-center gap-5 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/20">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-jakarta font-semibold text-[var(--text-primary)] text-lg">
              Account submitted!
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              Your registration is pending review. A barangay staff member will verify your account within 1–2 business days.
            </p>
          </div>
          <Button className="w-full font-medium h-10" onClick={() => router.push("/login")}>
            Back to sign in
          </Button>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="w-full max-w-lg animate-fade-in flex flex-col items-center gap-0">

      {/* Logo */}
      <AppLogo size="lg" />

      {/* Card */}
      <div className="w-full rounded-2xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {/* Card header */}
        <div className="px-8 pt-7 pb-1 text-left">
          <h2 className="font-jakarta font-semibold text-[var(--text-primary)] text-lg leading-snug">
            Create your account
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            Register as a resident of your barangay.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-8 pt-5 pb-2 space-y-4">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-[var(--text-secondary)]">
                  First name
                </Label>
                <Input id="firstName" placeholder="Maria" value={form.firstName} onChange={set("firstName")} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-[var(--text-secondary)]">
                  Last name
                </Label>
                <Input id="lastName" placeholder="Santos" value={form.lastName} onChange={set("lastName")} required />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)]">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                required
              />
            </div>

            {/* Barangay */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--text-secondary)]">Barangay</Label>
              <Select
                value={form.barangay}
                onValueChange={(v) => setForm((f) => ({ ...f, barangay: v }))}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your barangay" />
                </SelectTrigger>
                <SelectContent>
                  {BARANGAY_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-[var(--text-secondary)]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={set("password")}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-medium text-[var(--text-secondary)]">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-2.5">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-snug">{error}</p>
              </div>
            )}
          </div>

          <div className="px-8 pb-8 pt-4 flex flex-col gap-3">
            <Button type="submit" className="w-full font-medium h-10" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-xs text-center text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--brand-600)] dark:text-[var(--brand-400)] font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
