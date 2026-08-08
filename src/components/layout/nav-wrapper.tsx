"use client";

import { HybridNav } from "@/components/layout/nav-hybrid";
import { TopBar } from "@/components/layout/top-bar";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <HybridNav />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
