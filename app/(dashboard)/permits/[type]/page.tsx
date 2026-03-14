"use client";

import { use, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChevronLeft,
  Send,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { PERMIT_TYPES } from "@/lib/constants/permit-types";
import { UploadZone } from "@/components/permits/upload-zone";
import { Button } from "@/components/ui/button";
import { PermitStatusBadge } from "@/components/permits/permit-status-badge";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface FileSlot {
  id: string;
  label: string;
  file: UploadedFile | null;
}

function createSlot(index: number): FileSlot {
  return { id: crypto.randomUUID(), label: `Document ${index}`, file: null };
}

export default function PermitUploadPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);

  const permit = PERMIT_TYPES.find((p) => p.id === type);

  const [slots, setSlots] = useState<FileSlot[]>([
    createSlot(1),
    createSlot(2),
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!permit) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-[var(--text-secondary)]">Permit type not found.</p>
        <Button asChild variant="outline">
          <Link href="/permits">Back to permits</Link>
        </Button>
      </div>
    );
  }

  const updateSlot = (id: string, file: UploadedFile | null) => {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, file } : s)));
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, createSlot(prev.length + 1)]);
  };

  const removeSlot = (id: string) => {
    if (slots.length <= 1) return;
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const hasAtLeastOneFile = slots.some((s) => s.file !== null);

  const handleSubmit = async () => {
    if (!hasAtLeastOneFile) {
      toast.error("Please upload at least one document before submitting.");
      return;
    }

    setIsLoading(true);
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSubmitted(true);

    toast.success("Request submitted successfully!", {
      description: `Your ${permit.title} request has been received and is now being processed.`,
    });
  };

  // ── Success state ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-md mx-auto py-16 flex flex-col items-center text-center gap-6 animate-fade-in">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <div>
          <h2 className="font-jakarta text-xl font-bold text-[var(--text-primary)]">
            Request Submitted!
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your <span className="font-medium text-[var(--text-primary)]">{permit.title}</span>{" "}
            request has been received. You will be notified once it&apos;s ready for pickup.
          </p>
        </div>
        <PermitStatusBadge status="received" />
        <p className="text-xs text-[var(--text-muted)]">
          Estimated processing: {permit.processingDays}{" "}
          {permit.processingDays === 1 ? "business day" : "business days"}
        </p>
        <div className="flex gap-3 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/permits">Back to Permits</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/notifications">View Status</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Upload form ──────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <Link
        href="/permits"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to permits
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: upload form ── */}
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
              Submit Requirements
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Upload the required documents for your{" "}
              <span className="font-medium text-[var(--text-primary)]">{permit.title}</span> request.
            </p>
          </div>

          {/* File slots */}
          <div className="space-y-4">
            {slots.map((slot, i) => (
              <div key={slot.id} className="relative group">
                <UploadZone
                  label={slot.label}
                  onChange={(f) => updateSlot(slot.id, f)}
                />
                {slots.length > 1 && (
                  <button
                    onClick={() => removeSlot(slot.id)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 hover:bg-red-200 transition-all"
                    aria-label={`Remove document ${i + 1}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add more */}
          <button
            onClick={addSlot}
            className="flex items-center gap-2 text-sm text-[var(--brand-600)] dark:text-[var(--brand-400)] hover:underline font-medium"
          >
            <Plus className="w-4 h-4" />
            Add another document
          </button>

          {/* Submit */}
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </Button>
            {!hasAtLeastOneFile && (
              <p className="mt-2 text-xs text-center text-[var(--text-muted)]">
                Upload at least one document to submit.
              </p>
            )}
          </div>
        </div>

        {/* ── Right: decorative panel ── */}
        <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center gap-6 rounded-xl border border-[var(--surface-3)] bg-[var(--surface-1)] dark:bg-zinc-800/30 p-8 text-center">
          {/* Envelope SVG */}
          <div className="relative">
            <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-[var(--brand-50)] dark:bg-[#1e3a8a20]">
              <Mail className="w-12 h-12 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
            </div>
            <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--brand-600)] shadow-md">
              <Send className="w-4 h-4 text-white" />
            </div>
          </div>

          <div>
            <h3 className="font-jakarta text-base font-bold text-[var(--text-primary)]">
              Barangay Request
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {permit.title}
            </p>
          </div>

          {/* Requirements checklist */}
          <div className="w-full text-left space-y-2">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">
              Checklist
            </p>
            {permit.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-400)] mt-1.5 shrink-0" />
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{req}</p>
              </div>
            ))}
          </div>

          <div className="w-full pt-2 border-t border-[var(--surface-3)]">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-muted)]">Fee</span>
              <span className="font-semibold text-[var(--text-primary)]">{permit.fee}</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-[var(--text-muted)]">Processing time</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {permit.processingDays} {permit.processingDays === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
