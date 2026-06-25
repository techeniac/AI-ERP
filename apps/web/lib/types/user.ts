export type UserRole =
  | "super_admin"
  | "finance"
  | "sales_manager"
  | "support_agent"
  | "operations"
  | "hr"
  | "employee";

export type UserStatus = "active" | "inactive" | "invited";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
  phone?: string;
}

export type ResourceAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export type Resource =
  | "users"
  | "roles"
  | "leads"
  | "customers"
  | "invoices"
  | "payments"
  | "gl"
  | "procurement"
  | "vendors"
  | "tickets"
  | "tasks"
  | "projects"
  | "employees"
  | "documents"
  | "approvals"
  | "reports"
  | "ai"
  | "settings"
  | "dashboard";

export interface Permission {
  resource: Resource;
  actions: ResourceAction[];
  scope: "own" | "department" | "all";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
}
