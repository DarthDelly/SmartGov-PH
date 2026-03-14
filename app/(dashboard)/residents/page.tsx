import { Users } from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { ResidentTable } from "@/components/residents/resident-table";
import residentsData from "@/lib/mock/residents.json";
import type { Resident } from "@/components/residents/resident-table";

export default function ResidentsPage() {
  return (
    <RoleGuard
      allowedRoles={["staff", "admin"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--surface-2)] dark:bg-zinc-800">
            <Users className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Access Restricted</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              This page is only available to Barangay Staff and Municipal Admins.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
            Residents
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage registered residents of the barangay.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Registered", value: residentsData.length },
            { label: "Active", value: residentsData.filter((r) => r.status === "active").length },
            { label: "Inactive", value: residentsData.filter((r) => r.status === "inactive").length },
            { label: "Puroks", value: Array.from(new Set(residentsData.map((r) => r.purok))).length },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm px-4 py-3"
            >
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium">
                {stat.label}
              </p>
              <p className="mt-1 text-xl font-bold font-jakarta text-[var(--text-primary)] tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <ResidentTable residents={residentsData as Resident[]} />
        </div>
      </div>
    </RoleGuard>
  );
}
