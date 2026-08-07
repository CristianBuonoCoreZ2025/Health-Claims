"use client";

import { HybridNav } from "@/components/layout/nav-hybrid";
import { TopBar } from "@/components/layout/top-bar";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <HybridNav />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-2 lg:p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
