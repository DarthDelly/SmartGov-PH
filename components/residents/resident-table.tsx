"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  UserPlus,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Resident {
  id: string;
  name: string;
  purok: string;
  status: "active" | "inactive";
  lastTransaction: string;
  phone: string;
  age: number;
  occupation: string;
}

type SortKey = keyof Pick<Resident, "name" | "purok" | "lastTransaction" | "status">;
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

interface ResidentTableProps {
  residents: Resident[];
  loading?: boolean;
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc"
    ? <ChevronUp className="w-3 h-3 text-[var(--brand-600)]" />
    : <ChevronDown className="w-3 h-3 text-[var(--brand-600)]" />;
}

export function ResidentTable({ residents, loading = false }: ResidentTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return residents.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.purok.toLowerCase().includes(q) ||
        r.occupation.toLowerCase().includes(q)
    );
  }, [residents, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const thClass = "text-left py-3 px-4 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide";
  const sortableThClass = "cursor-pointer select-none hover:text-[var(--text-primary)] transition-colors";

  return (
    <div>
      {/* Search + Add */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--surface-3)]">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
          <Input
            placeholder="Search residents…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="ml-auto">
          <Button size="sm" className="gap-2">
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Resident</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface-2)]">
            <Users className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">No residents found</p>
          <p className="text-xs text-[var(--text-muted)]">
            {query ? `No results for "${query}". Try a different search.` : "No residents registered yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--surface-3)]">
              <tr>
                <th
                  className={cn(thClass, sortableThClass)}
                  onClick={() => handleSort("name")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Name <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  className={cn(thClass, sortableThClass, "hidden sm:table-cell")}
                  onClick={() => handleSort("purok")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Purok / Zone <SortIcon column="purok" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={cn(thClass, "hidden md:table-cell")}>Occupation</th>
                <th
                  className={cn(thClass, sortableThClass)}
                  onClick={() => handleSort("status")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Status <SortIcon column="status" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th
                  className={cn(thClass, sortableThClass, "hidden lg:table-cell")}
                  onClick={() => handleSort("lastTransaction")}
                >
                  <span className="inline-flex items-center gap-1.5">
                    Last Transaction <SortIcon column="lastTransaction" sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
                <th className={cn(thClass, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--surface-3)]">
              {paginated.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-[var(--surface-1)] dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{r.name}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{r.id} · {r.age} yrs</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-[var(--text-secondary)]">
                    {r.purok}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-[var(--text-secondary)] text-xs">
                    {r.occupation}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        r.status === "active"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "bg-[var(--surface-2)] text-[var(--text-muted)] dark:bg-zinc-800"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          r.status === "active" ? "bg-emerald-500" : "bg-[var(--text-muted)]"
                        )}
                      />
                      {r.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell text-xs text-[var(--text-muted)]">
                    {new Date(r.lastTransaction).toLocaleDateString("en-PH", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--surface-3)]">
          <p className="text-xs text-[var(--text-muted)]">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                className={cn("h-7 w-7 p-0 text-xs", p === page && "pointer-events-none")}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
