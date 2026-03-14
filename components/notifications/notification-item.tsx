import { cn } from "@/lib/utils";
import type { PermitStatus } from "@/components/permits/permit-status-badge";

export interface NotificationEntry {
  id: string;
  permitId: string;
  permitTitle: string;
  applicant: string;
  status: PermitStatus;
  message: string;
  read: boolean;
  createdAt: string;
}

const STATUS_CONFIG: Record<
  PermitStatus,
  { bg: string; label: string; labelColor: string; dot: string }
> = {
  received: {
    bg: "bg-amber-50/60 dark:bg-amber-950/10",
    label: "Received",
    labelColor: "text-amber-600 dark:text-amber-400",
    dot: "bg-[var(--status-received)]",
  },
  processing: {
    bg: "bg-blue-50/60 dark:bg-blue-950/10",
    label: "Processing",
    labelColor: "text-blue-600 dark:text-blue-400",
    dot: "bg-[var(--status-processing)]",
  },
  done: {
    bg: "bg-emerald-50/60 dark:bg-emerald-950/10",
    label: "Finish",
    labelColor: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-[var(--status-done)]",
  },
  rejected: {
    bg: "bg-red-50/60 dark:bg-red-950/10",
    label: "Rejected",
    labelColor: "text-red-600 dark:text-red-400",
    dot: "bg-[var(--status-rejected)]",
  },
};

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
}

interface NotificationItemProps {
  notification: NotificationEntry;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const config = STATUS_CONFIG[notification.status];

  return (
    <div
      onClick={() => !notification.read && onRead?.(notification.id)}
      className={cn(
        "relative flex gap-4 px-5 py-4 transition-colors",
        notification.read
          ? "bg-white dark:bg-zinc-900 opacity-70"
          : cn(
              config.bg,
              "hover:brightness-95 dark:hover:brightness-110"
            ),
        !notification.read && "cursor-pointer"
      )}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--brand-600)] dark:bg-[var(--brand-400)]" />
      )}

      {/* Status dot */}
      <div className="flex items-start pt-1 shrink-0">
        <span className={cn("w-2.5 h-2.5 rounded-full mt-0.5 shrink-0", config.dot)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Information Messages for Results
          </span>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">
          <span className={cn("font-semibold", config.labelColor)}>
            {config.label} —
          </span>{" "}
          {notification.permitTitle} · {notification.applicant}
        </p>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {notification.message}
        </p>

        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-[var(--text-muted)]">
            {notification.permitId}
          </span>
          <span className="text-[var(--text-muted)]">·</span>
          <span className="text-xs text-[var(--text-muted)]">
            {formatRelativeTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}
