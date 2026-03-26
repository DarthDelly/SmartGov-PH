"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store/auth-store";
import Link from "next/link";
import { Building2, Sun } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Logo + wordmark */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-600)] shadow-lg">
          <Sun className="text-white w-8 h-8" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] border-2 border-white dark:border-zinc-950" />
        </div>
        <div className="text-center">
          <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            SmartGov PH
          </h1>
          <p className="text-sm text-[var(--text-muted)] font-jakarta italic mt-0.5">
            Padayon sa Paglambo
          </p>
        </div>
      </div>

      {/* Login card */}
      <Card className="shadow-md">
        <form onSubmit={handleSignIn}>
          <CardContent className="pt-6 space-y-4">
            {/* Inline API error */}
            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

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
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pb-6">
            <Button
              type="submit"
              className="w-full font-medium"
              disabled={isLoading}
            >
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
                Sign up
              </Link>
            </p>

            <p className="text-xs text-center text-[var(--text-muted)]">
              SmartGov PH · Powered by Anthropic AI
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Bottom tagline */}
      <div className="flex items-center justify-center gap-2 mt-6 text-[var(--text-muted)]">
        <Building2 className="w-3.5 h-3.5" />
        <p className="text-xs">
          Department of the Interior and Local Government
        </p>
      </div>
    </div>
  );
}
