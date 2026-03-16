"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight, Sun, Moon, Settings, User, LogOut } from "lucide-react";
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
import { AppLogo } from "@/components/ui/app-logo";

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
  account: "Account",
  settings: "Settings",
  clearance: "Barangay Clearance",
  indigency: "Certificate of Indigency",
  residency: "Residency Certificate",
  business: "Business Clearance",
  id: "Barangay ID",
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
  const { theme, setTheme } = useTheme();
  const { user, role, logout } = useAuthStore();
  const breadcrumbs = useBreadcrumbs();

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

  return (
    <header className="sticky top-0 z-30 flex items-center h-14 px-4 gap-3 bg-white dark:bg-zinc-900 border-b border-[var(--surface-3)]">

      {/* Logo – mobile only */}
      <div className="flex md:hidden items-center flex-1 min-w-0">
        <AppLogo size="sm" width={100} />
      </div>

      {/* Breadcrumbs – desktop only */}
      <nav className="hidden md:flex items-center gap-1 flex-1 min-w-0">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />}
            {crumb.isLast ? (
              <span className="text-sm font-medium text-[var(--text-primary)] truncate capitalize">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate transition-colors capitalize"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center w-8 h-8 rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Bell */}
        <Link
          href="/notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-zinc-900" />
        </Link>

        {/* Profile dropdown – mobile only (sidebar handles this on desktop) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors"
                aria-label="Account menu"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="pb-2">
                <p className="text-sm font-semibold">{user.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5">{user.barangay}</p>
                <span className={cn(
                  "inline-flex mt-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                  ROLE_BADGE[role]
                )}>
                  {ROLE_LABELS[role]}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <Link href="/account">
                  <User className="w-4 h-4" />
                  Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="gap-2 cursor-pointer">
                <Link href="/settings">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
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
      </div>
    </header>
  );
}
