import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; up: boolean };
  accent?: "blue" | "green" | "amber" | "red";
  className?: string;
}

const ACCENT_ICON_COLORS: Record<string, string> = {
  blue: "bg-[var(--brand-50)] text-[var(--brand-600)] dark:bg-[#1e3a8a20] dark:text-[var(--brand-400)]",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
  red: "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400",
};

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "blue",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[var(--text-primary)] font-jakarta tabular-nums">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
              )}
            >
              {trend.up ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
            ACCENT_ICON_COLORS[accent]
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
