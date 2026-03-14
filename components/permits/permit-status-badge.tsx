import { cn } from "@/lib/utils";

export type PermitStatus = "received" | "processing" | "done" | "rejected";

const STATUS_CONFIG: Record<
  PermitStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  received: {
    label: "Received",
    dot: "bg-[var(--status-received)]",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
  },
  processing: {
    label: "Processing",
    dot: "bg-[var(--status-processing)]",
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-400",
  },
  done: {
    label: "Completed",
    dot: "bg-[var(--status-done)]",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-[var(--status-rejected)]",
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-700 dark:text-red-400",
  },
};

interface PermitStatusBadgeProps {
  status: PermitStatus;
  className?: string;
}

export function PermitStatusBadge({ status, className }: PermitStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}
