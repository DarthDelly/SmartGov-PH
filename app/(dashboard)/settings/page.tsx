"use client";

import { useState } from "react";
import { Bell, Palette, Globe, ShieldCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}

function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-600)]",
          checked ? "bg-[var(--brand-600)]" : "bg-[var(--surface-3)] dark:bg-zinc-700"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [notifs, setNotifs] = useState({
    permitUpdates: true,
    concerns: true,
    announcements: true,
    email: false,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    showProfile: true,
    activityLog: true,
  });

  const set = (key: keyof typeof notifs) => (v: boolean) =>
    setNotifs((n) => ({ ...n, [key]: v }));

  const setPriv = (key: keyof typeof privacy) => (v: boolean) =>
    setPrivacy((p) => ({ ...p, [key]: v }));

  const THEMES = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">

      {/* Header */}
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your preferences and application settings.</p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Appearance</h2>
        </div>
        <div className="px-6 py-5">
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-3">Theme</p>
          <div className="flex gap-2">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors",
                  theme === t.value
                    ? "border-[var(--brand-600)] bg-[var(--brand-50)] text-[var(--brand-600)] dark:bg-[#1e3a8a20] dark:text-[var(--brand-400)]"
                    : "border-[var(--surface-3)] text-[var(--text-secondary)] hover:border-[var(--surface-3)] hover:bg-[var(--surface-1)]"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Notifications</h2>
        </div>
        <div className="px-6 divide-y divide-[var(--surface-3)]">
          <Toggle checked={notifs.permitUpdates} onChange={set("permitUpdates")} label="Permit updates" description="Get notified when your permit status changes." />
          <Toggle checked={notifs.concerns} onChange={set("concerns")} label="Concern replies" description="Receive updates when staff responds to your concern." />
          <Toggle checked={notifs.announcements} onChange={set("announcements")} label="Barangay announcements" description="Important announcements from your barangay." />
          <Toggle checked={notifs.email} onChange={set("email")} label="Email notifications" description="Send copies of notifications to your email." />
          <Toggle checked={notifs.sms} onChange={set("sms")} label="SMS notifications" description="Receive text messages for critical updates." />
        </div>
      </section>

      {/* Language */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Language & Region</h2>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Display language</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Currently set to Filipino / English</p>
          </div>
          <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
            Coming soon
          </span>
        </div>
      </section>

      {/* Privacy */}
      <section className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--surface-3)] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Privacy</h2>
        </div>
        <div className="px-6 divide-y divide-[var(--surface-3)]">
          <Toggle checked={privacy.showProfile} onChange={setPriv("showProfile")} label="Show profile to barangay staff" description="Allow staff to view your contact information." />
          <Toggle checked={privacy.activityLog} onChange={setPriv("activityLog")} label="Activity logging" description="Allow the system to log your activity for audit purposes." />
        </div>
      </section>

    </div>
  );
}
