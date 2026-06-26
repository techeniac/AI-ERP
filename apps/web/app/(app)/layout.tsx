"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AICommandBar } from "@/components/layout/ai-command-bar";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUIStore } from "@/lib/stores/ui.store";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const router = useRouter();
  const aiPanelOpen = useUIStore((s) => s.aiPanelOpen);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isOnboarded, hasHydrated, router]);

  // Show spinner while store is hydrating OR if not authenticated / not onboarded yet
  if (!hasHydrated || !isAuthenticated || !isOnboarded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--brand-navy)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div
            className={cn(
              "transition-all duration-300",
              aiPanelOpen ? "mr-[420px]" : "mr-0"
            )}
          >
            {children}
          </div>
        </main>
      </div>
      <AICommandBar />
    </div>
  );
}
