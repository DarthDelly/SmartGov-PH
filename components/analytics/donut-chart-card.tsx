"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "next-themes";

interface DonutChartCardProps {
  title: string;
  data: { name: string; value: number; color: string }[];
}

export function DonutChartCard({ title, data }: DonutChartCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tooltipBg = isDark ? "#18181B" : "#FFFFFF";
  const tooltipBorder = isDark ? "#27272A" : "#E2E8F0";

  return (
    <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5">
      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: "8px",
              fontSize: "12px",
              color: isDark ? "#F8FAFC" : "#0F172A",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: isDark ? "#94A3B8" : "#475569" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
