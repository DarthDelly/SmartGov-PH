import { Skeleton } from "@/components/ui/skeleton";

export function ShellSkeleton() {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-1)]">
      {/* Sidebar skeleton */}
      <div className="hidden md:flex flex-col h-screen w-60 bg-white dark:bg-zinc-900 border-r border-[var(--surface-3)] p-4 gap-3 shrink-0">
        <Skeleton className="h-8 w-32 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-lg" />
        ))}
        <div className="mt-auto space-y-2">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      </div>
      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center h-14 px-4 gap-3 bg-white dark:bg-zinc-900 border-b border-[var(--surface-3)]">
          <Skeleton className="h-7 w-7 rounded-md" />
          <Skeleton className="h-4 w-32" />
          <div className="ml-auto flex gap-2">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-lg" />
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
