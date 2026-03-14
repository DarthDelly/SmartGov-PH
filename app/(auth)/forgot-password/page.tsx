"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Building2, Sun, Mail, ArrowLeft } from "lucide-react";

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

      <Card className="shadow-md">
        {sent ? (
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--brand-50)] dark:bg-[#1e3a8a20]">
              <Mail className="w-7 h-7 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
            </div>
            <div>
              <p className="font-jakarta font-semibold text-[var(--text-primary)] text-lg">
                Check your inbox
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                If an account exists for{" "}
                <span className="font-medium text-[var(--text-primary)]">{email}</span>, you will receive a password reset link shortly.
              </p>
            </div>
            <Link href="/login" className="w-full mt-2">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Button>
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="font-jakarta font-semibold text-[var(--text-primary)] text-base leading-tight">
                  Forgot your password?
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                  Enter your email and we&apos;ll send you a link to reset your password.
                </p>
              </div>

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
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pb-6">
              <Button type="submit" className="w-full font-medium" disabled={isLoading}>
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
                <Button variant="ghost" className="w-full gap-2 text-[var(--text-secondary)]" type="button">
                  <ArrowLeft className="w-4 h-4" />
                  Back to sign in
                </Button>
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>

      <div className="flex items-center justify-center gap-2 mt-6 text-[var(--text-muted)]">
        <Building2 className="w-3.5 h-3.5" />
        <p className="text-xs">Department of the Interior and Local Government</p>
      </div>
    </div>
  );
}
