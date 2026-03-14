"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";

interface BarChartCardProps {
  title: string;
  data: { name: string; count: number }[];
  color?: string;
}

export function BarChartCard({ title, data, color }: BarChartCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const barColor = color ?? (isDark ? "#60A5FA" : "#1D4ED8");
  const textColor = isDark ? "#94A3B8" : "#475569";
  const gridColor = isDark ? "#27272A" : "#E2E8F0";
  const tooltipBg = isDark ? "#18181B" : "#FFFFFF";
  const tooltipBorder = isDark ? "#27272A" : "#E2E8F0";

  return (
    <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5">
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="35%">
          <CartesianGrid vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: textColor }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={data.length > 4 ? -30 : 0}
            textAnchor={data.length > 4 ? "end" : "middle"}
            height={data.length > 4 ? 50 : 30}
          />
          <YAxis tick={{ fontSize: 11, fill: textColor }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "8px",
              fontSize: "12px",
              color: isDark ? "#F8FAFC" : "#0F172A",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={barColor} fillOpacity={0.85 + (i % 2) * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
