"use client";

import { useState } from "react";
import { User, Lock, Shield, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  resident: "Resident",
  staff: "Barangay Staff",
  admin: "Municipal Admin",
};

const ROLE_COLORS: Record<string, string> = {
  resident: "bg-[var(--brand-100)] text-[var(--brand-600)] dark:bg-[#1e3a8a30] dark:text-[var(--brand-400)]",
  staff: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
};

export default function AccountPage() {
  const { user, role } = useAuthStore();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const [profile, setProfile] = useState({
    firstName: user.name.split(" ")[0] ?? "",
    lastName: user.name.split(" ").slice(1).join(" ") ?? "",
    email: "maria.santos@example.com",
    phone: "+63 912 345 6789",
    barangay: user.barangay,
  });

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    if (passwords.next !== passwords.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordSaved(true);
    setPasswords({ current: "", next: "", confirm: "" });
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">Account</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your profile and login credentials.</p>
      </div>

      {/* Profile card */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <User className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Profile Information</h2>
        </div>

        <div className="px-6 py-5">
          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full bg-[var(--brand-600)] text-white shadow-sm hover:bg-[var(--brand-700)] transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{user.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide", ROLE_COLORS[role])}>
                  {ROLE_LABELS[role]}
                </span>
                <span className="text-xs text-[var(--text-muted)]">{user.barangay}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-[var(--text-secondary)]">First name</Label>
                <Input id="firstName" value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-[var(--text-secondary)]">Last name</Label>
                <Input id="lastName" value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-[var(--text-secondary)]">Email address</Label>
              <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-medium text-[var(--text-secondary)]">Phone number</Label>
              <Input id="phone" value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
            </div>

            <div className="flex items-center justify-between pt-1">
              {profileSaved && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Changes saved.</p>}
              <div className="ml-auto">
                <Button type="submit" size="sm">Save changes</Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Change password */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Change Password</h2>
        </div>

        <div className="px-6 py-5">
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current" className="text-xs font-medium text-[var(--text-secondary)]">Current password</Label>
              <Input id="current" type="password" placeholder="••••••••" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next" className="text-xs font-medium text-[var(--text-secondary)]">New password</Label>
              <Input id="next" type="password" placeholder="Min. 8 characters" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-xs font-medium text-[var(--text-secondary)]">Confirm new password</Label>
              <Input id="confirm" type="password" placeholder="••••••••" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} required />
            </div>

            {passwordError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-2.5">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">{passwordError}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              {passwordSaved && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Password updated.</p>}
              <div className="ml-auto">
                <Button type="submit" size="sm">Update password</Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Role badge */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Access Level</h2>
        </div>
        <div className="px-6 py-5 flex items-center gap-3">
          <span className={cn("inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide", ROLE_COLORS[role])}>
            {ROLE_LABELS[role]}
          </span>
          <p className="text-sm text-[var(--text-muted)]">
            Your access level is managed by your barangay administrator.
          </p>
        </div>
      </section>

    </div>
  );
}
