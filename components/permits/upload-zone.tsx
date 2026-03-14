"use client";

import { useCallback, useState } from "react";
import { UploadCloud, X, FileCheck2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

interface UploadZoneProps {
  label?: string;
  accept?: string;
  onChange?: (file: UploadedFile | null) => void;
  className?: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function UploadZone({ label = "Upload file", accept = "image/*,.pdf", onChange, className }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (raw: File) => {
      setError(null);
      if (raw.size > MAX_FILE_SIZE) {
        setError("File exceeds 10 MB limit.");
        return;
      }
      const f: UploadedFile = { name: raw.name, size: raw.size, type: raw.type };
      setFile(f);
      onChange?.(f);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) processFile(picked);
    e.target.value = "";
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
    onChange?.(null);
  };

  if (file) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 p-4",
          className
        )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 shrink-0">
          <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{file.name}</p>
          <p className="text-xs text-[var(--text-muted)]">{formatBytes(file.size)}</p>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 rounded-md text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          aria-label="Remove file"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <p className="text-xs font-medium text-[var(--text-secondary)]">{label}</p>
      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-150 p-8",
          isDragOver
            ? "border-[var(--brand-600)] bg-[var(--brand-50)] dark:bg-[#1e3a8a15] scale-[1.01]"
            : "border-[var(--surface-3)] hover:border-[var(--brand-400)] hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/30"
        )}
      >
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={handleInput}
        />
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-colors",
            isDragOver
              ? "bg-[var(--brand-100)] dark:bg-[#1e3a8a30]"
              : "bg-[var(--surface-2)] dark:bg-zinc-800"
          )}
        >
          <UploadCloud
            className={cn(
              "w-6 h-6 transition-colors",
              isDragOver
                ? "text-[var(--brand-600)] dark:text-[var(--brand-400)]"
                : "text-[var(--text-muted)]"
            )}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {isDragOver ? "Drop it here" : "Drop file or click to browse"}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            PDF, JPG, PNG — max 10 MB
          </p>
        </div>
      </label>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
