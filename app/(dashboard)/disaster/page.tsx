"use client";

import { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Siren,
  Users,
  Radio,
  PackageCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Plus,
  X,
  Wind,
  Waves,
  Flame,
  CloudRain,
} from "lucide-react";
import { RoleGuard } from "@/components/layout/role-guard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AlertLevel = "watch" | "warning" | "critical";
type IncidentStatus = "active" | "contained" | "resolved";

interface DisasterAlert {
  id: string;
  type: string;
  icon: React.ElementType;
  level: AlertLevel;
  affectedBarangays: string[];
  description: string;
  issuedAt: string;
  status: IncidentStatus;
}

interface ResponseTeam {
  id: string;
  name: string;
  lead: string;
  members: number;
  contact: string;
  status: "standby" | "deployed" | "returning";
  assignedTo?: string;
}

interface EvacuationCenter {
  id: string;
  name: string;
  barangay: string;
  capacity: number;
  occupancy: number;
  status: "open" | "full" | "closed";
}

const ALERTS: DisasterAlert[] = [
  {
    id: "ALT-001",
    type: "Typhoon",
    icon: Wind,
    level: "critical",
    affectedBarangays: ["Brgy. Bagumbayan", "Brgy. Poblacion", "Brgy. Pag-asa"],
    description: "Tropical cyclone advisory. Wind gusts up to 120 kph expected. Preemptive evacuation ordered.",
    issuedAt: "2025-03-14T06:00:00Z",
    status: "active",
  },
  {
    id: "ALT-002",
    type: "Flooding",
    icon: Waves,
    level: "warning",
    affectedBarangays: ["Brgy. San Roque", "Brgy. Masagana"],
    description: "Continuous rainfall causing rising water levels near the river. Residents in low-lying areas advised to evacuate.",
    issuedAt: "2025-03-14T07:30:00Z",
    status: "active",
  },
  {
    id: "ALT-003",
    type: "Fire Incident",
    icon: Flame,
    level: "watch",
    affectedBarangays: ["Brgy. Rizal"],
    description: "Structure fire reported near the public market. BFP units on-site. Area secured.",
    issuedAt: "2025-03-13T22:15:00Z",
    status: "contained",
  },
  {
    id: "ALT-004",
    type: "Heavy Rain",
    icon: CloudRain,
    level: "watch",
    affectedBarangays: ["Brgy. San Isidro", "Brgy. Sta. Cruz", "Brgy. Kalayaan"],
    description: "PAGASA Rainfall Warning Signal No. 1. Light to moderate flooding possible in low areas.",
    issuedAt: "2025-03-14T05:00:00Z",
    status: "active",
  },
];

const TEAMS: ResponseTeam[] = [
  { id: "TM-01", name: "BDRRMC Alpha",   lead: "Capt. Marcos Villafuerte", members: 12, contact: "09171000001", status: "deployed",  assignedTo: "Brgy. Bagumbayan" },
  { id: "TM-02", name: "BDRRMC Bravo",   lead: "Lt. Carina Manalo",        members: 10, contact: "09171000002", status: "deployed",  assignedTo: "Brgy. San Roque"  },
  { id: "TM-03", name: "BDRRMC Charlie", lead: "Sgt. Edwin Tolentino",      members: 8,  contact: "09171000003", status: "standby"                                   },
  { id: "TM-04", name: "Medical Team",   lead: "Dr. Amelia Cruz",           members: 6,  contact: "09171000004", status: "deployed",  assignedTo: "Brgy. Poblacion"  },
  { id: "TM-05", name: "Rescue Unit",    lead: "Capt. Rodel Bautista",      members: 15, contact: "09171000005", status: "returning"                                  },
];

const EVAC_CENTERS: EvacuationCenter[] = [
  { id: "EV-01", name: "Municipal Gymnasium",    barangay: "Brgy. Poblacion",  capacity: 400, occupancy: 312, status: "open"   },
  { id: "EV-02", name: "San Isidro Elem. School",barangay: "Brgy. San Isidro", capacity: 250, occupancy: 89,  status: "open"   },
  { id: "EV-03", name: "Covered Court Bagumbayan",barangay: "Brgy. Bagumbayan",capacity: 180, occupancy: 180, status: "full"   },
  { id: "EV-04", name: "Rizal High School",       barangay: "Brgy. Rizal",     capacity: 300, occupancy: 0,   status: "closed" },
];

const ALERT_CONFIG: Record<AlertLevel, { label: string; badge: string; dot: string }> = {
  watch:    { label: "Watch",    badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",   dot: "bg-amber-500"  },
  warning:  { label: "Warning",  badge: "bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400", dot: "bg-orange-500" },
  critical: { label: "Critical", badge: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",           dot: "bg-red-500 animate-pulse" },
};

const INCIDENT_STATUS_CONFIG: Record<IncidentStatus, { label: string; color: string }> = {
  active:    { label: "Active",    color: "text-red-600 dark:text-red-400"     },
  contained: { label: "Contained", color: "text-amber-600 dark:text-amber-400" },
  resolved:  { label: "Resolved",  color: "text-emerald-600 dark:text-emerald-400" },
};

const TEAM_STATUS_CONFIG: Record<ResponseTeam["status"], { label: string; badge: string }> = {
  standby:   { label: "Standby",   badge: "bg-[var(--surface-2)] text-[var(--text-muted)] dark:bg-zinc-800"              },
  deployed:  { label: "Deployed",  badge: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400"                  },
  returning: { label: "Returning", badge: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"          },
};

const EVAC_STATUS_CONFIG: Record<EvacuationCenter["status"], { label: string; badge: string; bar: string }> = {
  open:   { label: "Open",   badge: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400", bar: "bg-emerald-500" },
  full:   { label: "Full",   badge: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",                 bar: "bg-red-500"     },
  closed: { label: "Closed", badge: "bg-[var(--surface-2)] text-[var(--text-muted)] dark:bg-zinc-800",             bar: "bg-zinc-400"    },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  const m = Math.floor(diff / 60000);
  if (h > 0) return `${h}h ago`;
  return `${m}m ago`;
}

export default function DisasterPage() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const visibleAlerts = ALERTS.filter((a) => !dismissedAlerts.includes(a.id));
  const activeCount = ALERTS.filter((a) => a.status === "active").length;

  return (
    <RoleGuard
      allowedRoles={["admin"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <ShieldAlert className="w-10 h-10 text-[var(--text-muted)]" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Access restricted to Municipal Admins.
          </p>
        </div>
      }
    >
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
              Disaster Response
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Municipal Disaster Risk Reduction and Management Command Center
            </p>
          </div>
          {activeCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 shrink-0">
              <Siren className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                {activeCount} active alert{activeCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Active Alerts",      value: ALERTS.filter((a) => a.status === "active").length,    icon: AlertTriangle, color: "text-red-600 dark:text-red-400",       bg: "bg-red-50 dark:bg-red-950/20"             },
            { label: "Teams Deployed",     value: TEAMS.filter((t) => t.status === "deployed").length,   icon: Users,         color: "text-[var(--brand-600)] dark:text-[var(--brand-400)]", bg: "bg-[var(--brand-50)] dark:bg-[#1e3a8a20]" },
            { label: "Evacuees",           value: EVAC_CENTERS.reduce((s, c) => s + c.occupancy, 0).toLocaleString(), icon: PackageCheck, color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/20"         },
            { label: "Evac Centers Open",  value: EVAC_CENTERS.filter((c) => c.status === "open").length, icon: Radio,        color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/20"     },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", s.bg)}>
                <s.icon className={cn("w-4 h-4", s.color)} />
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] font-medium">{s.label}</p>
                <p className="text-xl font-bold font-jakarta text-[var(--text-primary)] tabular-nums">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Active alerts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Incident Alerts</h2>
            <Button size="sm" className="gap-2 h-8">
              <Plus className="w-3.5 h-3.5" /> New Alert
            </Button>
          </div>

          {visibleAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-sm text-[var(--text-secondary)]">All alerts have been cleared.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAlerts.map((alert) => {
                const alertCfg = ALERT_CONFIG[alert.level];
                const incidentCfg = INCIDENT_STATUS_CONFIG[alert.status];
                const Icon = alert.icon;
                return (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/20 shrink-0">
                        <Icon className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-[var(--text-primary)]">{alert.type}</span>
                          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", alertCfg.badge)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", alertCfg.dot)} />
                            {alertCfg.label}
                          </span>
                          <span className={cn("text-xs font-medium", incidentCfg.color)}>
                            {incidentCfg.label}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{alert.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {timeAgo(alert.issuedAt)}
                          </span>
                          <span className="flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            {alert.affectedBarangays.join(", ")}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDismissedAlerts((p) => [...p, alert.id])}
                        className="p-1 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Response teams + Evac centers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Response teams */}
          <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--surface-3)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Response Teams</h2>
              <span className="text-xs text-[var(--text-muted)]">{TEAMS.length} teams</span>
            </div>
            <div className="divide-y divide-[var(--surface-3)]">
              {TEAMS.map((team) => {
                const tCfg = TEAM_STATUS_CONFIG[team.status];
                return (
                  <div key={team.id} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--surface-2)] dark:bg-zinc-800 shrink-0">
                      <Users className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{team.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {team.lead} · {team.members} members
                        {team.assignedTo && ` · ${team.assignedTo}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${team.contact}`}
                        className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--surface-2)] dark:hover:bg-zinc-800 transition-colors text-[var(--text-muted)]"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", tCfg.badge)}>
                        {tCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Evacuation centers */}
          <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--surface-3)]">
              <h2 className="text-base font-semibold text-[var(--text-primary)]">Evacuation Centers</h2>
              <span className="text-xs text-[var(--text-muted)]">
                {EVAC_CENTERS.reduce((s, c) => s + c.occupancy, 0).toLocaleString()} evacuees
              </span>
            </div>
            <div className="divide-y divide-[var(--surface-3)]">
              {EVAC_CENTERS.map((center) => {
                const eCfg = EVAC_STATUS_CONFIG[center.status];
                const pct = center.capacity > 0 ? Math.round((center.occupancy / center.capacity) * 100) : 0;
                return (
                  <div key={center.id} className="px-5 py-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{center.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{center.barangay}</p>
                      </div>
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium shrink-0", eCfg.badge)}>
                        {eCfg.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                        <span>{center.occupancy.toLocaleString()} / {center.capacity.toLocaleString()} capacity</span>
                        <span className="tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--surface-2)] dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", eCfg.bar)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
