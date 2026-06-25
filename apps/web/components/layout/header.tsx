"use client";

import { Bot, ChevronDown, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./notification-bell";
import { useUIStore } from "@/lib/stores/ui.store";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  finance: "Finance",
  sales_manager: "Sales Manager",
  support_agent: "Support Agent",
  operations: "Operations",
  hr: "HR",
  employee: "Employee",
};

export function Header() {
  const { aiPanelOpen, toggleAIPanel, theme, setTheme } = useUIStore();
  const { user, signOut } = useAuth();

  // Apply dark mode class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
      {/* Left: placeholder for breadcrumbs injected by pages */}
      <div className="flex-1" />

      {/* Right: AI bar + actions */}
      <div className="flex items-center gap-2">
        {/* AI Command Bar trigger */}
        <Button
          variant={aiPanelOpen ? "default" : "outline"}
          size="sm"
          className={cn(
            "gap-2 h-9 text-sm",
            aiPanelOpen
              ? "bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal)]/90 border-0"
              : "text-muted-foreground"
          )}
          onClick={toggleAIPanel}
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">AI Assistant</span>
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground ml-1">
            ⌘K
          </kbd>
        </Button>

        {/* Dark mode toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <NotificationBell />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-[var(--brand-navy)] text-white text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">{user?.name ?? "Guest"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? ""}
                </p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
