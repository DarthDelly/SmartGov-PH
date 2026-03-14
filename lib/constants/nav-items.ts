import type { Role } from "@/lib/store/auth-store";

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
}

const ALL_ROLES: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Notifications", href: "/notifications", icon: "Bell" },
];

const RESIDENT_ITEMS: NavItem[] = [
  { label: "Barangay Permits", href: "/permits", icon: "FileText" },
  { label: "Report Concerns", href: "/concerns", icon: "AlertCircle" },
];

const STAFF_ITEMS: NavItem[] = [
  { label: "Permits Queue", href: "/permits", icon: "ClipboardList" },
  { label: "Residents", href: "/residents", icon: "Users" },
  { label: "Blotter", href: "/blotter", icon: "BookOpen" },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Analytics", href: "/analytics", icon: "BarChart2" },
  { label: "Barangay Monitor", href: "/monitor", icon: "MapPin" },
  { label: "Disaster Response", href: "/disaster", icon: "ShieldAlert" },
];

export const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  resident: [...ALL_ROLES, ...RESIDENT_ITEMS],
  staff: [...ALL_ROLES, ...STAFF_ITEMS],
  admin: [...ALL_ROLES, ...ADMIN_ITEMS],
};
