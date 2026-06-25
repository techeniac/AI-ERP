"use client";

import { create } from "zustand";
import type { NotificationItem } from "@/lib/types";

interface NotificationsState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-001",
    title: "Invoice Overdue",
    message: "INV-2025-0023 from Wipro Technologies is 15 days overdue (₹3,45,000)",
    type: "error",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: "/finance/invoices/inv-023",
  },
  {
    id: "notif-002",
    title: "Approval Required",
    message: "Purchase Request PR-2025-0008 is awaiting your approval (₹1,25,000)",
    type: "warning",
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    link: "/approvals",
  },
  {
    id: "notif-003",
    title: "SLA Breach Alert",
    message: "Ticket TKT-0087 (Infosys Ltd) has breached SLA. Immediate action required.",
    type: "error",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    link: "/support/ticket-087",
  },
  {
    id: "notif-004",
    title: "Payment Received",
    message: "Payment of ₹8,50,000 received from HCL Technologies for INV-2025-0015",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    link: "/finance/payments",
  },
  {
    id: "notif-005",
    title: "New Lead Assigned",
    message: "Lead from Reliance Industries has been assigned to you. Estimated value: ₹25L",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    link: "/crm",
  },
  {
    id: "notif-006",
    title: "Lead Converted",
    message: "Lead from Tata Consultancy Services was approved and converted to customer",
    type: "success",
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    link: "/customers",
  },
];

export const useNotificationsStore = create<NotificationsState>()((set, get) => ({
  notifications: INITIAL_NOTIFICATIONS,
  unreadCount: INITIAL_NOTIFICATIONS.filter((n) => !n.read).length,

  addNotification: (n) => {
    const notification: NotificationItem = {
      ...n,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotification: (id) => {
    set((state) => {
      const notifications = state.notifications.filter((n) => n.id !== id);
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
      };
    });
  },
}));

// Selector for pending approvals count (used in sidebar badge)
export function usePendingApprovalCount(): number {
  const notifications = useNotificationsStore((s) => s.notifications);
  return notifications.filter(
    (n) => !n.read && n.message.toLowerCase().includes("approval")
  ).length;
}
