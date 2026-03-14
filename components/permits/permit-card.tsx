"use client";

import {
  ShieldCheck,
  HeartHandshake,
  Home,
  Briefcase,
  CreditCard,
  ArrowRight,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PermitType } from "@/lib/constants/permit-types";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  HeartHandshake,
  Home,
  Briefcase,
  CreditCard,
};

interface PermitCardProps {
  permit: PermitType;
  onRequest: (permit: PermitType) => void;
}

export function PermitCard({ permit, onRequest }: PermitCardProps) {
  const Icon = ICON_MAP[permit.icon] ?? ShieldCheck;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-5 gap-4",
        "hover:shadow-md hover:border-[var(--brand-400)] transition-all duration-200"
      )}
    >
      {/* Icon + title */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--brand-50)] dark:bg-[#1e3a8a20] shrink-0 group-hover:bg-[var(--brand-100)] dark:group-hover:bg-[#1e3a8a40] transition-colors">
          <Icon className="w-5 h-5 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-jakarta text-base font-semibold text-[var(--text-primary)] leading-tight">
            {permit.title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium text-[var(--brand-600)] dark:text-[var(--brand-400)]">
              {permit.fee}
            </span>
            <span className="text-[var(--text-muted)]">·</span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="w-3 h-3" />
              {permit.processingDays}
              {permit.processingDays === 1 ? " day" : " days"}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
        {permit.description}
      </p>

      {/* Requirements count */}
      <p className="text-xs text-[var(--text-muted)]">
        {permit.requirements.length} requirements needed
      </p>

      {/* CTA */}
      <Button
        onClick={() => onRequest(permit)}
        className="w-full gap-2 group-hover:gap-3 transition-all"
        size="sm"
      >
        Request
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}
