"use client";

import { HybridNav } from "@/components/layout/nav-hybrid";
import { TopBar } from "@/components/layout/top-bar";

export function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <HybridNav />
      <div className="relative z-0 flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="relative z-0 mx-auto flex min-w-0 w-full max-w-screen-2xl flex-1 flex-col overflow-hidden bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
