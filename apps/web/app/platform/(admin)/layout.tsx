"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, LogOut } from "lucide-react";
import { PlatformSidebar } from "@/components/platform/platform-sidebar";
import { usePlatformAuthStore } from "@/lib/stores/platform-auth.store";
import Link from "next/link";

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const isPlatformAdmin = usePlatformAuthStore((s) => s.isPlatformAdmin);
  const hasHydrated = usePlatformAuthStore((s) => s._hasHydrated);
  const signOut = usePlatformAuthStore((s) => s.signOut);
  const platformCurrency = usePlatformAuthStore((s) => s.platformCurrency);
  const router = useRouter();

  function handleSignOut() {
    signOut();
    router.push("/platform/login");
  }

  useEffect(() => {
    if (hasHydrated && !isPlatformAdmin) {
      router.replace("/platform/login");
    }
  }, [isPlatformAdmin, hasHydrated, router]);

  if (!hasHydrated || !isPlatformAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-indigo-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PlatformSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 items-center justify-between border-b bg-white/50 dark:bg-background px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-700">Platform Admin Console</span>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-600 font-medium">Internal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Phase 1 — Mock Data</span>
            <Link
              href="/platform/settings"
              className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-200 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
              title="Platform currency — click to change"
            >
              {platformCurrency}
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
