"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircle,
  MapPin,
  Send,
  CheckCircle2,
  ArrowRight,
  ImagePlus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleGuard } from "@/components/layout/role-guard";

const CONCERN_TYPES = [
  { value: "infrastructure", label: "Infrastructure", description: "Roads, bridges, drainage, streetlights" },
  { value: "peace-order", label: "Peace & Order", description: "Noise, trespassing, disturbances" },
  { value: "sanitation", label: "Sanitation", description: "Garbage, stray animals, water supply" },
  { value: "environment", label: "Environment", description: "Pollution, illegal dumping, flooding" },
  { value: "social", label: "Social Services", description: "Medical assistance, livelihood, youth" },
  { value: "other", label: "Other", description: "Any other barangay concern" },
] as const;

type ConcernType = (typeof CONCERN_TYPES)[number]["value"];

interface FormState {
  type: ConcernType | "";
  description: string;
  location: string;
  photo: File | null;
}

export default function ConcernsPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    type: "",
    description: "",
    location: "",
    photo: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isValid = form.type !== "" && form.description.trim().length >= 20 && form.location.trim().length > 0;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, photo: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const removePhoto = () => {
    setForm((f) => ({ ...f, photo: null }));
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setSubmitted(true);
    toast.success("Concern reported!", {
      description: "Your report has been sent to the barangay office.",
    });
  };

  // ── Success state ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <RoleGuard allowedRoles={["resident"]}>
        <div className="max-w-md mx-auto py-16 flex flex-col items-center text-center gap-6 animate-fade-in">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/20">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <div>
            <h2 className="font-jakarta text-xl font-bold text-[var(--text-primary)]">
              Concern Submitted!
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Your report has been received by the barangay office. You will be
              notified once it has been reviewed.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-2)] dark:bg-zinc-800 text-sm">
            <span className="text-[var(--text-muted)]">Type:</span>
            <span className="font-medium text-[var(--text-primary)] capitalize">
              {CONCERN_TYPES.find((c) => c.value === form.type)?.label}
            </span>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSubmitted(false);
                setForm({ type: "", description: "", location: "", photo: null });
                setPhotoPreview(null);
              }}
            >
              Report another
            </Button>
            <Button asChild className="flex-1 gap-2">
              <a href="/notifications">
                Track status <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard
      allowedRoles={["resident"]}
      fallback={
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertCircle className="w-10 h-10 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-secondary)] font-medium">
            This page is only available to residents.
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to dashboard
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="font-jakarta text-2xl font-bold text-[var(--text-primary)]">
            Report a Concern
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Submit issues or concerns to your barangay office. We aim to respond within 3 business days.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[var(--surface-3)] bg-white dark:bg-zinc-900 shadow-sm p-6 space-y-5"
        >
          {/* Concern type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[var(--text-secondary)]">
              Concern Type <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as ConcernType }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a concern type…" />
              </SelectTrigger>
              <SelectContent>
                {CONCERN_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-[var(--text-muted)]">{opt.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-[var(--text-secondary)]">
                Description <span className="text-red-500">*</span>
              </Label>
              <span
                className={`text-xs ${
                  form.description.length < 20
                    ? "text-[var(--text-muted)]"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}
              >
                {form.description.length} / 20 min
              </span>
            </div>
            <Textarea
              placeholder="Describe the issue in detail. Include when it started, how often it occurs, and how it affects the community…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={4}
              className="resize-none"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[var(--text-secondary)]">
              Location / Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
              <Input
                placeholder="e.g. Purok 3, near the covered court"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Photo upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-[var(--text-secondary)]">
              Photo <span className="text-[var(--text-muted)] font-normal">(optional)</span>
            </Label>

            {photoPreview ? (
              <div className="relative inline-flex rounded-xl overflow-hidden border border-[var(--surface-3)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoPreview}
                  alt="Concern photo preview"
                  className="w-full max-h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 flex items-center justify-center w-6 h-6 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--surface-3)] hover:border-[var(--brand-400)] hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--surface-2)] dark:bg-zinc-800 shrink-0">
                  <ImagePlus className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Attach a photo
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    JPG, PNG or WEBP — max 10 MB
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Notice */}
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-[var(--surface-1)] dark:bg-zinc-800/50 text-xs text-[var(--text-muted)]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
            <p>
              False or malicious reports may be subject to barangay sanctions under local ordinance.
              Please ensure all information provided is accurate.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
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
                Submit Report
              </>
            )}
          </Button>
        </form>
      </div>
    </RoleGuard>
  );
}
