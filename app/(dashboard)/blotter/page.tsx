"use client";

import { useState } from "react";
import { BookOpen, Plus, Search, Eye } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BlotterEntry {
  id: string;
  caseNo: string;
  complainant: string;
  respondent: string;
  incident: string;
  location: string;
  date: string;
  status: "pending" | "ongoing" | "resolved" | "referred";
}

const MOCK_BLOTTER: BlotterEntry[] = [
  { id: "1", caseNo: "BLT-2024-001", complainant: "Maria Santos", respondent: "Pedro Reyes", incident: "Physical Injury", location: "Purok 3, San Isidro", date: "2024-03-10", status: "resolved" },
  { id: "2", caseNo: "BLT-2024-002", complainant: "Ana Cruz", respondent: "Unknown", incident: "Theft", location: "Purok 1, San Isidro", date: "2024-03-12", status: "ongoing" },
  { id: "3", caseNo: "BLT-2024-003", complainant: "Jose Dela Torre", respondent: "Lito Magsino", incident: "Oral Defamation", location: "Purok 5, San Isidro", date: "2024-03-14", status: "pending" },
  { id: "4", caseNo: "BLT-2024-004", complainant: "Rosa Navarro", respondent: "Brgy. Dispute Panel", incident: "Land Dispute", location: "Purok 2, San Isidro", date: "2024-03-15", status: "referred" },
  { id: "5", caseNo: "BLT-2024-005", complainant: "Carlos Villanueva", respondent: "Mark Fajardo", incident: "Noise Complaint", location: "Purok 4, San Isidro", date: "2024-03-16", status: "pending" },
  { id: "6", caseNo: "BLT-2024-006", complainant: "Ligaya Buenaventura", respondent: "Nena Castillo", incident: "Property Damage", location: "Purok 6, San Isidro", date: "2024-03-08", status: "resolved" },
  { id: "7", caseNo: "BLT-2024-007", complainant: "Ramon Tolentino", respondent: "Unknown", incident: "Trespassing", location: "Purok 1, San Isidro", date: "2024-03-05", status: "ongoing" },
];

const STATUS_STYLES: Record<BlotterEntry["status"], string> = {
  pending: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  ongoing: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  resolved: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  referred: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
};

const STATUS_LABELS: Record<BlotterEntry["status"], string> = {
  pending: "Pending",
  ongoing: "Ongoing",
  resolved: "Resolved",
  referred: "Referred",
};

export default function BlotterPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<BlotterEntry["status"] | "all">("all");

  const filtered = MOCK_BLOTTER.filter((b) => {
    const matchSearch =
      b.caseNo.toLowerCase().includes(search.toLowerCase()) ||
      b.complainant.toLowerCase().includes(search.toLowerCase()) ||
      b.respondent.toLowerCase().includes(search.toLowerCase()) ||
      b.incident.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    all: MOCK_BLOTTER.length,
    pending: MOCK_BLOTTER.filter((b) => b.status === "pending").length,
    ongoing: MOCK_BLOTTER.filter((b) => b.status === "ongoing").length,
    resolved: MOCK_BLOTTER.filter((b) => b.status === "resolved").length,
    referred: MOCK_BLOTTER.filter((b) => b.status === "referred").length,
  };

  return (
    <RoleGuard
      allowedRoles={["staff", "admin"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--surface-2)] dark:bg-zinc-800">
            <BookOpen className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Access Restricted</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">This page is only available to Barangay Staff.</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">Blotter Records</h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Official record of incidents and complaints filed at the barangay.
            </p>
          </div>
          <Button className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            New Entry
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Cases", value: counts.all },
            { label: "Pending", value: counts.pending },
            { label: "Ongoing", value: counts.ongoing },
            { label: "Resolved", value: counts.resolved },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm px-4 py-3">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">{s.label}</p>
              <p className="mt-1 text-2xl font-bold font-jakarta text-[var(--text-primary)]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <Input
              placeholder="Search case no., name, or incident…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "pending", "ongoing", "resolved", "referred"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                  filter === s
                    ? "bg-[var(--brand-600)] text-white"
                    : "bg-[var(--surface-2)] dark:bg-zinc-800 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {s === "all" ? `All (${counts.all})` : `${STATUS_LABELS[s]} (${counts[s]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--surface-3)] bg-[var(--surface-1)] dark:bg-zinc-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Case No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Complainant</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Respondent</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Incident</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--surface-3)]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-[var(--text-muted)]">
                      No blotter records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)] whitespace-nowrap">{b.caseNo}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{b.complainant}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{b.respondent}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{b.incident}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                        {new Date(b.date).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium", STATUS_STYLES[b.status])}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="flex items-center gap-1 text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline">
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
