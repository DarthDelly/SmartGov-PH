"use client";

import { useState } from "react";
import { Bell, CheckCheck, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NotificationItem,
  type NotificationEntry,
} from "@/components/notifications/notification-item";
import rawNotifications from "@/lib/mock/notifications.json";
import type { PermitStatus } from "@/components/permits/permit-status-badge";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "received", label: "Received" },
  { value: "processing", label: "Processing" },
  { value: "done", label: "Completed" },
  { value: "rejected", label: "Rejected" },
] as const;

type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationEntry[]>(
    rawNotifications as NotificationEntry[]
  );
  const [filter, setFilter] = useState<FilterValue>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.status === (filter as PermitStatus);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "You're all caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllRead}
            className="gap-2 shrink-0"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === "all"
              ? notifications.length
              : opt.value === "unread"
              ? notifications.filter((n) => !n.read).length
              : notifications.filter((n) => n.status === opt.value).length;

          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${
                  filter === opt.value
                    ? "bg-[var(--brand-600)] text-white"
                    : "bg-[var(--surface-2)] dark:bg-zinc-800 text-[var(--text-secondary)] hover:bg-[var(--surface-3)] dark:hover:bg-zinc-700"
                }
              `}
            >
              {opt.label}
              {count > 0 && (
                <span
                  className={`
                    inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[10px] font-bold
                    ${filter === opt.value ? "bg-white/20 text-white" : "bg-[var(--surface-3)] dark:bg-zinc-700 text-[var(--text-muted)]"}
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--surface-2)] dark:bg-zinc-800">
            {filter === "unread" ? (
              <CheckCheck className="w-6 h-6 text-emerald-500" />
            ) : (
              <BellOff className="w-6 h-6 text-[var(--text-muted)]" />
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {filter === "unread" ? "All caught up!" : "No notifications"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {filter === "unread"
                ? "No unread notifications at this time."
                : `No ${filter === "all" ? "" : filter + " "}notifications to show.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm overflow-hidden divide-y divide-[var(--surface-3)]">
          {filtered.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markRead}
            />
          ))}
        </div>
      )}

      {/* Bell icon watermark when all read */}
      {unreadCount === 0 && filter === "all" && filtered.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-2">
          <Bell className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <p className="text-xs text-[var(--text-muted)]">All notifications have been read.</p>
        </div>
      )}
    </div>
  );
}
