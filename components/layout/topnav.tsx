"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, ChevronRight, LogOut, Settings, User, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Map href segments → readable names
const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Home",
  permits: "Barangay Permits",
  concerns: "Report Concerns",
  notifications: "Notifications",
  residents: "Residents",
  analytics: "Analytics",
  monitor: "Barangay Monitor",
  disaster: "Disaster Response",
  blotter: "Blotter",
  clearance: "Barangay Clearance",
  indigency: "Certificate of Indigency",
  residency: "Residency Certificate",
  business: "Business Clearance",
  id: "Barangay ID",
};

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label: BREADCRUMB_LABELS[seg] ?? seg.replace(/-/g, " "),
    href: "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

interface TopnavProps {
  onMenuClick: () => void;
}

export function Topnav({ onMenuClick }: TopnavProps) {
  const router = useRouter();
  const { user, role, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const breadcrumbs = useBreadcrumbs();

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleBadgeColors: Record<string, string> = {
    resident: "bg-[var(--brand-100)] text-[var(--brand-600)] dark:bg-[#1e3a8a30] dark:text-[var(--brand-400)]",
    staff: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    admin: "bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400",
  };
  const roleLabels: Record<string, string> = {
    resident: "Resident",
    staff: "Barangay Staff",
    admin: "Municipal Admin",
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 gap-3 bg-white dark:bg-zinc-900 border-b border-[var(--surface-3)]">
      {/* Hamburger — always visible on mobile, toggles sidebar on desktop */}
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4 text-[var(--text-secondary)]" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />}
            {crumb.isLast ? (
              <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors text-[var(--text-secondary)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Notification bell */}
        <Link
          href="/notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900" />
        </Link>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors ml-1"
              aria-label="Account menu"
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-[var(--text-primary)] leading-none">{user.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate max-w-[120px]">{user.barangay}</p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="pb-1">
              <p className="text-sm font-medium">{user.name}</p>
              <span
                className={cn(
                  "inline-flex mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                  roleBadgeColors[role]
                )}
              >
                {roleLabels[role]}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
