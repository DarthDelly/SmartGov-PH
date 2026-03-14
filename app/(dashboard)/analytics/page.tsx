"use client";

import {
  Building2,
  FileText,
  AlertCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { MetricCard } from "@/components/analytics/metric-card";
import { BarChartCard } from "@/components/analytics/bar-chart-card";
import { DonutChartCard } from "@/components/analytics/donut-chart-card";
import analyticsData from "@/lib/mock/analytics.json";

export default function AnalyticsPage() {
  const permitsByType = analyticsData.permitsByType.map((d) => ({
    name: d.name.replace("Certificate of ", "Cert. of ").replace("Barangay ", "Brgy. "),
    count: d.count,
  }));

  const requestsByMonth = analyticsData.requestsByMonth.map((d) => ({
    name: d.month,
    count: d.requests,
  }));

  return (
    <RoleGuard
      allowedRoles={["admin"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--surface-2)] dark:bg-zinc-800">
            <TrendingUp className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">Access Restricted</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Analytics are only available to Municipal Admins.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Municipality-wide permit and service request overview.
          </p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Active Barangays"
            value={analyticsData.metrics.activeBarangays}
            icon={Building2}
            accent="blue"
          />
          <MetricCard
            label="Requests This Month"
            value={analyticsData.metrics.totalRequestsThisMonth}
            icon={FileText}
            accent="green"
            trend={{ value: "+22% vs Feb", up: true }}
          />
          <MetricCard
            label="Flagged Concerns"
            value={analyticsData.metrics.flaggedConcerns}
            icon={AlertCircle}
            accent="red"
            trend={{ value: "2 unresolved", up: false }}
          />
          <MetricCard
            label="Avg. Processing"
            value={`${analyticsData.metrics.avgProcessingDays}d`}
            sub="per request"
            icon={Clock}
            accent="amber"
            trend={{ value: "0.3d faster than Feb", up: true }}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <BarChartCard
              title="Requests by Month (Oct 2024 – Mar 2025)"
              data={requestsByMonth}
            />
          </div>
          <DonutChartCard
            title="Status Distribution"
            data={analyticsData.statusDistribution}
          />
        </div>

        {/* Permit type breakdown */}
        <BarChartCard
          title="Permits by Type — March 2025"
          data={permitsByType}
          color="#10B981"
        />

        {/* Barangay volume table */}
        <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--surface-3)]">
            <h3 className="text-base font-semibold text-[var(--text-primary)]">
              Top Barangays by Request Volume
            </h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--surface-3)]">
                <th className="text-left py-3 px-5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">#</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Barangay</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Requests</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide hidden sm:table-cell">Completed</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide hidden sm:table-cell">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-3)]">
              {analyticsData.barangayVolume.map((row, i) => {
                const rate = Math.round((row.completed / row.requests) * 100);
                return (
                  <tr key={row.barangay} className="hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="py-3 px-5 text-[var(--text-muted)] font-medium">{i + 1}</td>
                    <td className="py-3 px-4 font-medium text-[var(--text-primary)]">{row.barangay}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] tabular-nums">{row.requests}</td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] tabular-nums hidden sm:table-cell">{row.completed}</td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 max-w-[80px] bg-[var(--surface-2)] dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] tabular-nums">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-[var(--surface-3)] flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            Data as of March 14, 2025
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
