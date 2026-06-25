"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Building2, Users, CreditCard, Flag,
  Megaphone, ClipboardList, Activity, Shield, LogOut, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlatformAuthStore } from "@/lib/stores/platform-auth.store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/platform/dashboard", icon: LayoutDashboard },
  { label: "Organizations", href: "/platform/organizations", icon: Building2 },
  { label: "Users", href: "/platform/users", icon: Users },
  { label: "Billing", href: "/platform/billing", icon: CreditCard },
  { label: "Feature Flags", href: "/platform/feature-flags", icon: Flag },
  { label: "Announcements", href: "/platform/announcements", icon: Megaphone },
  { label: "Audit Logs", href: "/platform/audit-logs", icon: ClipboardList },
  { label: "System Health", href: "/platform/system", icon: Activity },
  { label: "Settings", href: "/platform/settings", icon: Settings },
];

export function PlatformSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, adminEmail } = usePlatformAuthStore();

  function handleSignOut() {
    signOut();
    router.push("/platform/login");
  }

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-indigo-900 border-r border-indigo-800">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-indigo-800 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 shrink-0">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-none">Platform Admin</p>
          <p className="text-xs text-indigo-300 mt-0.5">Internal Console</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-indigo-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-indigo-800 p-3 space-y-1">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 shrink-0">
            <Shield className="h-3.5 w-3.5 text-indigo-300" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">Platform Admin</p>
            <p className="text-xs text-indigo-400 truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white/10 text-white hover:bg-red-600/80 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
