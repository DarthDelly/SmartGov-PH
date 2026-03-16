"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Mail, ArrowLeft } from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setSent(true);
  };

  return (
    <div className="w-full max-w-lg animate-fade-in flex flex-col items-center gap-0">

      {/* Logo */}
      <AppLogo size="lg" />

      {/* Card */}
      <div className="w-full rounded-2xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">

        {sent ? (
          /* ── Success state ── */
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/20">
              <Mail className="w-7 h-7 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
            </div>
            <div>
              <p className="font-jakarta font-semibold text-[var(--text-primary)] text-lg">
                Check your inbox
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                If an account exists for{" "}
                <span className="font-medium text-[var(--text-primary)]">{email}</span>
                , a reset link has been sent.
              </p>
            </div>
            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full gap-2 h-10">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Button>
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit}>
            <div className="px-8 pt-7 pb-1 text-left">
              <h2 className="font-jakarta font-semibold text-[var(--text-primary)] text-lg leading-snug">
                Reset your password
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-0.5">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <div className="px-8 pt-5 pb-2 space-y-4">
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
            </div>

            <div className="px-8 pb-8 pt-4 flex flex-col gap-3">
              <Button type="submit" className="w-full font-medium h-10" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="ghost" className="w-full gap-2 h-10 text-[var(--text-secondary)]" type="button">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
