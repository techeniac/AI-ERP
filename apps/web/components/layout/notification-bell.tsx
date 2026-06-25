"use client";

import { Bell, X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/lib/stores/notifications.store";
import { formatRelative } from "@/lib/utils/format";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotificationsStore();
  const router = useRouter();

  const typeColors = {
    info: "bg-blue-500",
    warning: "bg-amber-500",
    success: "bg-emerald-500",
    error: "bg-red-500",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 px-0.5 text-[10px] bg-brand-danger text-white border-0 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="font-semibold text-sm">Notifications</p>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs text-muted-foreground"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-[360px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer group",
                    !n.read && "bg-muted/30"
                  )}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.link) router.push(n.link);
                  }}
                >
                  <div className="mt-1 shrink-0">
                    <span
                      className={cn(
                        "block h-2 w-2 rounded-full",
                        n.read ? "bg-muted-foreground/30" : typeColors[n.type]
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-medium", !n.read && "font-semibold")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatRelative(n.createdAt)}
                    </p>
                  </div>
                  <button
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(n.id);
                    }}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
