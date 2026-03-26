"use client";

import Link from "next/link";
import {
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
  MessageSquareWarning,
  BarChart2,
  ArrowRight,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentRequestsTable } from "@/components/dashboard/recent-requests-table";
import { Button } from "@/components/ui/button";

/* ─── Resident View ─────────────────────────────────────────────────── */
function ResidentDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
          Magandang araw, {name.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          What would you like to do today?
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Permits card */}
        <div className="group rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:border-[var(--brand-400)] transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-50)] dark:bg-[#1e3a8a20] shrink-0">
              <FileText className="w-6 h-6 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
            </div>
            <div>
              <h2 className="font-jakarta text-base font-semibold text-[var(--text-primary)]">
                Barangay Permits
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Request clearances, certificates, and official barangay documents.
              </p>
            </div>
          </div>
          <Button asChild className="w-full gap-2">
            <Link href="/permits">
              Request a permit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Concerns card */}
        <div className="group rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:border-amber-400 transition-all duration-200">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-jakarta text-base font-semibold text-[var(--text-primary)]">
                Report Concerns
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Report infrastructure issues, peace and order, sanitation problems, and more.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/20">
            <Link href="/concerns">
              File a report
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Recent requests */}
      <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-3)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">My Recent Requests</h2>
          <Link
            href="/permits"
            className="text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <RecentRequestsTable limit={5} />
      </div>
    </div>
  );
}

/* ─── Staff View ─────────────────────────────────────────────────────── */
function StaffDashboard({ name }: { name: string }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
          Welcome back, {name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Here&apos;s what&apos;s happening at your barangay today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Pending Requests"
          value={3}
          icon={ClipboardList}
          accent="amber"
          trend={{ value: "2 new today", up: true }}
        />
        <StatsCard
          label="Processed Today"
          value={7}
          icon={FileText}
          accent="green"
          trend={{ value: "from 5 yesterday", up: true }}
        />
        <StatsCard
          label="Residents Registered"
          value={248}
          icon={Users}
          accent="blue"
        />
        <StatsCard
          label="Open Concerns"
          value={4}
          icon={MessageSquareWarning}
          accent="red"
          trend={{ value: "1 critical", up: false }}
        />
      </div>

      {/* Permit queue */}
      <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--surface-3)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">Permit Queue</h2>
          <Link
            href="/permits"
            className="text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline font-medium"
          >
            View all
          </Link>
        </div>
        <RecentRequestsTable limit={8} showActions={true} />
      </div>
    </div>
  );
}

/* ─── Admin View ─────────────────────────────────────────────────────── */
function AdminDashboard({ name }: { name: string }) {
  // Simple bar chart using CSS (Recharts added in Phase 7)
  const barangayData = [
    { name: "Brgy. San Isidro", requests: 42 },
    { name: "Brgy. Poblacion", requests: 35 },
    { name: "Brgy. San Roque", requests: 28 },
    { name: "Brgy. Sta. Cruz", requests: 21 },
    { name: "Brgy. Bagumbayan", requests: 18 },
  ];
  const max = Math.max(...barangayData.map((d) => d.requests));

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
          Municipal Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Welcome, {name.split(" ")[0]}. Monitoring all barangays — {new Date().toLocaleDateString("en-PH", { dateStyle: "long" })}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Active Barangays"
          value={12}
          icon={Building2}
          accent="blue"
        />
        <StatsCard
          label="Requests This Month"
          value={144}
          icon={FileText}
          accent="green"
          trend={{ value: "+18% vs last month", up: true }}
        />
        <StatsCard
          label="Flagged Concerns"
          value={6}
          icon={AlertCircle}
          accent="red"
          trend={{ value: "2 unresolved", up: false }}
        />
        <StatsCard
          label="AI Credit Assessments"
          value="—"
          icon={TrendingUp}
          accent="amber"
        />
      </div>

      {/* Charts + table row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart (placeholder — Recharts in Phase 7) */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-[var(--brand-600)]" />
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Requests by Barangay
            </h2>
          </div>
          <div className="space-y-3">
            {barangayData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] w-36 truncate shrink-0">
                  {d.name}
                </span>
                <div className="flex-1 h-2 bg-[var(--surface-2)] dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--brand-600)] dark:bg-[var(--brand-400)] rounded-full transition-all duration-500"
                    style={{ width: `${(d.requests / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--text-primary)] tabular-nums w-6 text-right shrink-0">
                  {d.requests}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-[var(--text-muted)]">
            Full chart with Recharts available in the analytics page →
          </p>
        </div>

        {/* Top barangays summary */}
        <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-6">
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4">
            Top Barangays
          </h2>
          <div className="space-y-3">
            {barangayData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[var(--surface-2)] dark:bg-zinc-800 text-[10px] font-bold text-[var(--text-muted)] shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-[var(--text-secondary)] truncate">
                  {d.name}
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums shrink-0">
                  {d.requests}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/analytics"
            className="mt-5 flex items-center gap-1 text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline font-medium"
          >
            View full analytics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Recent requests */}
      <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm">
        <div className="px-6 py-4 border-b border-[var(--surface-3)]">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Recent Requests Across Barangays
          </h2>
        </div>
        <RecentRequestsTable limit={6} />
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const role = user?.role ?? "resident";
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "";

  if (role === "staff") return <StaffDashboard name={displayName} />;
  if (role === "admin") return <AdminDashboard name={displayName} />;
  return <ResidentDashboard name={displayName} />;
}
