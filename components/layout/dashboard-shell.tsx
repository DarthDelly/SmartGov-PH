"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topnav } from "@/components/layout/topnav";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { PageTransition } from "@/components/layout/page-transition";
import { ShellSkeleton } from "@/components/layout/shell-skeleton";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <ShellSkeleton />;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--surface-1)]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topnav onMenuClick={() => setCollapsed((c) => !c)} />

        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-[1280px] mx-auto px-6 py-8 pb-24 md:pb-8">
            <PageTransition>{children}</PageTransition>
          </div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
