"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
  BookOpen,
  BarChart2,
  MapPin,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { AppLogo } from "@/components/ui/app-logo";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { NAV_ITEMS_BY_ROLE } from "@/lib/constants/nav-items";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Bell,
  FileText,
  AlertCircle,
  ClipboardList,
  Users,
  BookOpen,
  BarChart2,
  MapPin,
  ShieldAlert,
  Settings,
  User,
};

const ROLE_LABELS: Record<string, string> = {
  resident: "Resident",
  staff: "Barangay Staff",
  admin: "Municipal Admin",
};

const ROLE_BADGE: Record<string, string> = {
  resident: "bg-[var(--brand-100)] text-[var(--brand-600)] dark:bg-[#1e3a8a30] dark:text-[var(--brand-400)]",
  staff:    "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
  admin:    "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, user, logout } = useAuthStore();
  const navItems = NAV_ITEMS_BY_ROLE[role];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const renderNavLink = (item: (typeof navItems)[number]) => {
    const Icon = ICON_MAP[item.icon];
    const isActive =
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(item.href));

    const linkEl = (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150 group",
          collapsed ? "justify-center" : "",
          isActive
            ? "bg-[var(--brand-50)] text-[var(--brand-600)] dark:bg-[#1e3a8a20] dark:text-[var(--brand-400)] font-medium"
            : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 hover:text-[var(--text-primary)]"
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "shrink-0 transition-colors",
              collapsed ? "w-5 h-5" : "w-4 h-4",
              isActive
                ? "text-[var(--brand-600)] dark:text-[var(--brand-400)]"
                : "text-[var(--text-muted)] group-hover:text-[var(--text-primary)]"
            )}
          />
        )}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.href}>
          <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      );
    }
    return linkEl;
  };

  /* Split nav items: main items vs account/settings at the end */
  const accountHrefs = new Set(["/account", "/settings"]);
  const mainItems = navItems.filter((i) => !accountHrefs.has(i.href));
  const accountItems = navItems.filter((i) => accountHrefs.has(i.href));

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-[var(--surface-3)] transition-all duration-300 ease-in-out shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 border-b border-[var(--surface-3)] shrink-0 px-3">
          <AppLogo size="sm" collapsed={collapsed} />
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2 scrollbar-thin">
          {mainItems.map(renderNavLink)}

          {/* Divider before account/settings */}
          <div className="pt-2 pb-1">
            <Separator />
          </div>

          {accountItems.map(renderNavLink)}
        </nav>

        <Separator />

        {/* Bottom: user profile + logout */}
        <div className="py-3 px-2 space-y-0.5">

          {/* User row → /account */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/account"
                  className={cn(
                    "flex w-full items-center justify-center rounded-lg px-2 py-2 transition-colors",
                    pathname === "/account"
                      ? "bg-[var(--brand-50)] dark:bg-[#1e3a8a20]"
                      : "hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800"
                  )}
                >
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs opacity-70">{ROLE_LABELS[role]}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/account"
              className={cn(
                "flex items-center rounded-lg px-2 py-2 gap-2.5 transition-colors",
                pathname === "/account"
                  ? "bg-[var(--brand-50)] dark:bg-[#1e3a8a20]"
                  : "hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800"
              )}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate leading-tight">{user.name}</p>
                <span className={cn(
                  "inline-flex mt-0.5 px-1.5 py-px rounded text-[9px] font-bold uppercase tracking-wide leading-tight",
                  ROLE_BADGE[role]
                )}>
                  {ROLE_LABELS[role]}
                </span>
              </div>
            </Link>
          )}

          {/* Logout */}
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center rounded-lg px-2 py-2 text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Log out</TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-[4.5rem] z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-900 border border-[var(--surface-3)] shadow-sm hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-[var(--text-muted)]" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}
