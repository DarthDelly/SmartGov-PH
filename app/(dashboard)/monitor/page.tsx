"use client";

import { useState } from "react";
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BarangayStatus = "operational" | "busy" | "critical";

interface BarangayRecord {
  id: string;
  name: string;
  captain: string;
  status: BarangayStatus;
  residents: number;
  pendingRequests: number;
  processedThisMonth: number;
  openConcerns: number;
  lastActivity: string;
  trend: "up" | "down" | "stable";
}

const BARANGAYS: BarangayRecord[] = [
  { id: "BRG-01", name: "Brgy. San Isidro",   captain: "Capt. Roberto Lim",      status: "operational", residents: 1240, pendingRequests: 8,  processedThisMonth: 42, openConcerns: 2, lastActivity: "2 min ago",  trend: "up"     },
  { id: "BRG-02", name: "Brgy. Poblacion",     captain: "Capt. Lucia Delos Reyes", status: "busy",        residents: 980,  pendingRequests: 14, processedThisMonth: 35, openConcerns: 5, lastActivity: "5 min ago",  trend: "down"   },
  { id: "BRG-03", name: "Brgy. San Roque",     captain: "Capt. Ernesto Buan",      status: "operational", residents: 760,  pendingRequests: 4,  processedThisMonth: 28, openConcerns: 1, lastActivity: "12 min ago", trend: "stable" },
  { id: "BRG-04", name: "Brgy. Sta. Cruz",     captain: "Capt. Marisa Fontanilla", status: "operational", residents: 620,  pendingRequests: 3,  processedThisMonth: 21, openConcerns: 0, lastActivity: "1 hr ago",   trend: "up"     },
  { id: "BRG-05", name: "Brgy. Bagumbayan",    captain: "Capt. Dante Ocampo",      status: "critical",    residents: 530,  pendingRequests: 21, processedThisMonth: 18, openConcerns: 7, lastActivity: "30 min ago", trend: "down"   },
  { id: "BRG-06", name: "Brgy. Maligaya",      captain: "Capt. Felisa Serrano",    status: "operational", residents: 890,  pendingRequests: 6,  processedThisMonth: 31, openConcerns: 1, lastActivity: "8 min ago",  trend: "up"     },
  { id: "BRG-07", name: "Brgy. Pag-asa",       captain: "Capt. Victor Reyes",      status: "busy",        residents: 710,  pendingRequests: 11, processedThisMonth: 24, openConcerns: 4, lastActivity: "20 min ago", trend: "stable" },
  { id: "BRG-08", name: "Brgy. Mabuhay",       captain: "Capt. Connie Adriano",    status: "operational", residents: 450,  pendingRequests: 2,  processedThisMonth: 15, openConcerns: 0, lastActivity: "3 hr ago",   trend: "stable" },
  { id: "BRG-09", name: "Brgy. Rizal",         captain: "Capt. Hernando Cruz",     status: "operational", residents: 670,  pendingRequests: 5,  processedThisMonth: 19, openConcerns: 2, lastActivity: "45 min ago", trend: "up"     },
  { id: "BRG-10", name: "Brgy. Masagana",      captain: "Capt. Nilda Flores",      status: "busy",        residents: 580,  pendingRequests: 9,  processedThisMonth: 22, openConcerns: 3, lastActivity: "15 min ago", trend: "down"   },
  { id: "BRG-11", name: "Brgy. Kalayaan",      captain: "Capt. Benito Pascual",    status: "operational", residents: 840,  pendingRequests: 7,  processedThisMonth: 33, openConcerns: 1, lastActivity: "1 hr ago",   trend: "up"     },
  { id: "BRG-12", name: "Brgy. Pagbabago",     captain: "Capt. Rosario Mendez",    status: "operational", residents: 390,  pendingRequests: 1,  processedThisMonth: 10, openConcerns: 0, lastActivity: "4 hr ago",   trend: "stable" },
];

const STATUS_CONFIG: Record<BarangayStatus, { label: string; dot: string; badge: string }> = {
  operational: {
    label: "Operational",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400",
  },
  busy: {
    label: "Busy",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
  },
  critical: {
    label: "Critical",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
  },
};

export default function MonitorPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BarangayStatus | "all">("all");
  const [lastRefreshed] = useState(new Date());

  const filtered = BARANGAYS.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(query.toLowerCase()) ||
      b.captain.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const totals = {
    operational: BARANGAYS.filter((b) => b.status === "operational").length,
    busy: BARANGAYS.filter((b) => b.status === "busy").length,
    critical: BARANGAYS.filter((b) => b.status === "critical").length,
    pendingTotal: BARANGAYS.reduce((a, b) => a + b.pendingRequests, 0),
  };

  return (
    <RoleGuard
      allowedRoles={["admin"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <MapPin className="w-10 h-10 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Access restricted to Municipal Admins.
          </p>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
              Barangay Monitor
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Real-time status of all {BARANGAYS.length} barangays in the municipality.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] shrink-0 mt-1">
            <RefreshCw className="w-3.5 h-3.5" />
            {lastRefreshed.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Operational",     value: totals.operational, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
            { label: "Busy",            value: totals.busy,        icon: Clock,        color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/20"   },
            { label: "Critical",        value: totals.critical,    icon: AlertCircle,  color: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-950/20"       },
            { label: "Pending Requests",value: totals.pendingTotal,icon: FileText,     color: "text-[var(--brand-600)] dark:text-[var(--brand-400)]", bg: "bg-[var(--brand-50)] dark:bg-[#1e3a8a20]" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", s.bg)}>
                <s.icon className={cn("w-4.5 h-4.5", s.color)} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium">{s.label}</p>
                <p className="text-xl font-bold font-jakarta text-[var(--text-primary)] tabular-nums">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <Input
              placeholder="Search barangay or captain…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(["all", "operational", "busy", "critical"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                  statusFilter === s
                    ? "bg-[var(--brand-600)] text-white"
                    : "bg-[var(--surface-2)] dark:bg-zinc-800 text-[var(--text-secondary)] hover:bg-[var(--surface-3)] dark:hover:bg-zinc-700"
                )}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Barangay grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((brgy) => {
            const statusCfg = STATUS_CONFIG[brgy.status];
            return (
              <div
                key={brgy.id}
                className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--brand-50)] dark:bg-[#1e3a8a20] shrink-0">
                      <MapPin className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{brgy.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{brgy.captain}</p>
                    </div>
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium shrink-0", statusCfg.badge)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Users,     label: "Residents",    value: brgy.residents.toLocaleString() },
                    { icon: FileText,  label: "Pending",      value: brgy.pendingRequests },
                    { icon: CheckCircle2, label: "Processed", value: brgy.processedThisMonth },
                    { icon: AlertCircle,  label: "Concerns",  value: brgy.openConcerns },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      <div>
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide leading-none">{stat.label}</p>
                        <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums mt-0.5">{stat.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[var(--surface-3)]">
                  <span className="text-[10px] text-[var(--text-muted)]">Last activity: {brgy.lastActivity}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium">
                    {brgy.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                    {brgy.trend === "down" && <TrendingDown className="w-3 h-3 text-red-400" />}
                    {brgy.trend === "stable" && <span className="w-3 h-px bg-[var(--text-muted)] inline-block" />}
                    <span className={brgy.trend === "up" ? "text-emerald-600" : brgy.trend === "down" ? "text-red-500" : "text-[var(--text-muted)]"}>
                      {brgy.trend === "up" ? "Trending up" : brgy.trend === "down" ? "Needs attention" : "Stable"}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MapPin className="w-8 h-8 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-secondary)]">No barangays match your search.</p>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
