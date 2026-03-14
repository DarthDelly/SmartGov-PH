"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import type { Role } from "@/lib/store/auth-store";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Bell,
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
  BarChart2,
};

// Show max 4-5 items in bottom tab bar (most important per role)
const MOBILE_TABS: Record<Role, { label: string; href: string; icon: string }[]> = {
  resident: [
    { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Permits", href: "/permits", icon: "FileText" },
    { label: "Concerns", href: "/concerns", icon: "AlertCircle" },
    { label: "Alerts", href: "/notifications", icon: "Bell" },
  ],
  staff: [
    { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Queue", href: "/permits", icon: "ClipboardList" },
    { label: "Residents", href: "/residents", icon: "Users" },
    { label: "Alerts", href: "/notifications", icon: "Bell" },
  ],
  admin: [
    { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Analytics", href: "/analytics", icon: "BarChart2" },
    { label: "Alerts", href: "/notifications", icon: "Bell" },
  ],
};

export function MobileTabBar() {
  const pathname = usePathname();
  const { role } = useAuthStore();
  const tabs = MOBILE_TABS[role];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center bg-white dark:bg-zinc-900 border-t border-[var(--surface-3)] pb-safe">
      {tabs.map((tab) => {
        const Icon = ICON_MAP[tab.icon];
        const isActive =
          pathname === tab.href ||
          (tab.href !== "/dashboard" && pathname.startsWith(tab.href));

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
              isActive
                ? "text-[var(--brand-600)] dark:text-[var(--brand-400)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-[var(--brand-600)] dark:text-[var(--brand-400)]"
                    : "text-[var(--text-muted)]"
                )}
              />
            )}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
