import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: "blue" | "green" | "amber" | "red" | "purple";
}

const ACCENT: Record<string, string> = {
  blue:   "bg-[var(--brand-50)] text-[var(--brand-600)] dark:bg-[#1e3a8a20] dark:text-[var(--brand-400)]",
  green:  "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
  amber:  "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
  red:    "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400",
};

export function MetricCard({ label, value, sub, icon: Icon, trend, accent = "blue" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold font-jakarta text-[var(--text-primary)] tabular-nums">
            {value}
          </p>
          {sub && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</p>}
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400")}>
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0", ACCENT[accent])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
