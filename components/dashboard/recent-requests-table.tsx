"use client";

import { useState } from "react";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import { PermitStatusBadge, type PermitStatus } from "@/components/permits/permit-status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import permitsData from "@/lib/mock/permits.json";

export interface PermitRequest {
  id: string;
  type: string;
  title: string;
  applicant: string;
  status: PermitStatus;
  submittedAt: string;
  barangay: string;
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return "Just now";
}

interface RecentRequestsTableProps {
  showActions?: boolean; // staff view gets Accept/Reject
  limit?: number;
  className?: string;
}

export function RecentRequestsTable({
  showActions = false,
  limit = 5,
  className,
}: RecentRequestsTableProps) {
  const [items, setItems] = useState<PermitRequest[]>(
    (permitsData as PermitRequest[]).slice(0, limit)
  );

  const handleAction = (id: string, action: "done" | "rejected") => {
    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 gap-3", className)}>
        <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[var(--text-muted)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">No requests yet</p>
        <p className="text-xs text-[var(--text-muted)]">
          Permit requests will appear here once submitted.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--surface-3)]">
            <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              Request
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide hidden sm:table-cell">
              Applicant
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide hidden md:table-cell">
              Submitted
            </th>
            {showActions && (
              <th className="text-right py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--surface-3)]">
          {items.map((req) => (
            <tr
              key={req.id}
              className="hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/50 transition-colors"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium text-[var(--text-primary)] truncate max-w-[180px]">
                    {req.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{req.id}</p>
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <span className="text-[var(--text-secondary)]">{req.applicant}</span>
              </td>
              <td className="py-3 px-4">
                <PermitStatusBadge status={req.status} />
              </td>
              <td className="py-3 px-4 text-[var(--text-muted)] text-xs hidden md:table-cell">
                {formatRelativeTime(req.submittedAt)}
              </td>
              {showActions && (
                <td className="py-3 px-4 text-right">
                  {req.status === "received" || req.status === "processing" ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 gap-1"
                        onClick={() => handleAction(req.id, "done")}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Approve</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1"
                        onClick={() => handleAction(req.id, "rejected")}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reject</span>
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
