"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, TrendingUp, Building2, Receipt, CreditCard,
  ShoppingCart, HeadphonesIcon, CheckSquare, UserCheck, FileText,
  CheckCircle2, BarChart3, Settings, ChevronLeft, ChevronRight,
  Briefcase, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/stores/ui.store";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import { useNotificationsStore } from "@/lib/stores/notifications.store";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  resource: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ALL_NAV_SECTIONS: NavSection[] = [
  {
    title: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, resource: "dashboard" },
    ],
  },
  {
    title: "Modules",
    items: [
      { label: "CRM", href: "/crm", icon: TrendingUp, resource: "leads" },
      { label: "Customers", href: "/customers", icon: Building2, resource: "customers" },
      { label: "Finance", href: "/finance", icon: Receipt, resource: "invoices" },
      { label: "Procurement", href: "/procurement", icon: ShoppingCart, resource: "procurement" },
      { label: "Support", href: "/support", icon: HeadphonesIcon, resource: "tickets" },
      { label: "Operations", href: "/operations", icon: CheckSquare, resource: "tasks" },
      { label: "HR", href: "/hr", icon: UserCheck, resource: "employees" },
      { label: "Documents", href: "/documents", icon: FileText, resource: "documents" },
      { label: "Approvals", href: "/approvals", icon: CheckCircle2, resource: "approvals" },
      { label: "Reports", href: "/reports", icon: BarChart3, resource: "reports" },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/settings", icon: Settings, resource: "settings" },
    ],
  },
];

function NavLink({
  item,
  collapsed,
  pendingCount,
}: {
  item: NavItem;
  collapsed: boolean;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {pendingCount !== undefined && pendingCount > 0 && (
            <Badge className="h-5 min-w-5 px-1 text-xs bg-brand-amber text-white border-0">
              {pendingCount}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const { canAccess } = usePermissions();
  const notifications = useNotificationsStore((s) => s.notifications);
  const pendingApprovals = notifications.filter(
    (n) => !n.read && n.message.toLowerCase().includes("approval")
  ).length;

  const filteredSections = ALL_NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.resource === "dashboard"
        ? true
        : canAccess(item.resource as Parameters<typeof canAccess>[0])
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4 shrink-0",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
            <Briefcase className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-bold text-sidebar-foreground leading-none">AI ERP</p>
              <p className="text-xs text-sidebar-foreground/50 mt-0.5">Operational Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {filteredSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  pendingCount={item.resource === "approvals" ? pendingApprovals : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden h-9 w-9"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-[var(--brand-navy)]">
          <SidebarContent collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-[var(--brand-navy)] border-r border-sidebar-border transition-all duration-300 relative shrink-0",
          sidebarCollapsed ? "w-[60px]" : "w-64"
        )}
      >
        <SidebarContent collapsed={sidebarCollapsed} />

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-[var(--brand-navy)] text-sidebar-foreground/70 hover:text-sidebar-foreground shadow-sm"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </aside>
    </>
  );
}
