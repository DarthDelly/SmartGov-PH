"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { PERMIT_TYPES, type PermitType } from "@/lib/constants/permit-types";
import { PermitCard } from "@/components/permits/permit-card";
import { PermitModal } from "@/components/permits/permit-modal";

export default function PermitsPage() {
  const [selected, setSelected] = useState<PermitType | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
          Barangay Request
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Select the type of document or permit you need. Review the requirements before proceeding.
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-[var(--brand-200)] dark:border-[var(--brand-700)] bg-[var(--brand-50)] dark:bg-[#1e3a8a15] px-4 py-3">
        <FileText className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)] shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--brand-600)] dark:text-[var(--brand-400)]">
          Processing times are estimates. You will receive a notification once your request is ready for pickup.
        </p>
      </div>

      {/* Permit cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERMIT_TYPES.map((permit) => (
          <PermitCard
            key={permit.id}
            permit={permit}
            onRequest={setSelected}
          />
        ))}
      </div>

      {/* Requirements modal */}
      <PermitModal
        permit={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
