"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Banknote, ArrowRight } from "lucide-react";
import type { PermitType } from "@/lib/constants/permit-types";

interface PermitModalProps {
  permit: PermitType | null;
  open: boolean;
  onClose: () => void;
}

export function PermitModal({ permit, open, onClose }: PermitModalProps) {
  const router = useRouter();

  if (!permit) return null;

  const handleProceed = () => {
    onClose();
    router.push(`/permits/${permit.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-jakarta text-lg font-bold text-[var(--text-primary)] pr-6">
            {permit.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {permit.description}
          </DialogDescription>
        </DialogHeader>

        {/* Fee + processing time */}
        <div className="flex items-center gap-4 py-3 px-4 bg-[var(--surface-1)] dark:bg-zinc-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-[var(--text-muted)]" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Fee</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{permit.fee}</p>
            </div>
          </div>
          <div className="w-px h-8 bg-[var(--surface-3)]" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-medium">Processing</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {permit.processingDays} {permit.processingDays === 1 ? "day" : "days"}
              </p>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-px flex-1 bg-[var(--status-received)]/30" />
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide shrink-0">
              Requirements to be Processed
            </p>
            <div className="h-px flex-1 bg-[var(--status-received)]/30" />
          </div>

          <ul className="space-y-2">
            {permit.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--brand-600)] dark:text-[var(--brand-400)] shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Note */}
        <p className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] dark:bg-zinc-800/50 rounded-lg px-4 py-3 leading-relaxed">
          Please make sure all requirements are complete before proceeding. Incomplete submissions
          may delay processing.
        </p>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleProceed} className="flex-1 gap-2">
            Proceed
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
