import type { UserRole, Resource, ResourceAction } from "@/lib/types";

type PermissionMatrix = Record<UserRole, Partial<Record<Resource, ResourceAction[]>>>;

const PERMISSIONS: PermissionMatrix = {
  super_admin: {
    users: ["view", "create", "edit", "delete", "approve", "export"],
    roles: ["view", "create", "edit", "delete"],
    leads: ["view", "create", "edit", "delete", "approve", "export"],
    customers: ["view", "create", "edit", "delete", "approve", "export"],
    invoices: ["view", "create", "edit", "delete", "approve", "export"],
    payments: ["view", "create", "edit", "delete", "approve", "export"],
    gl: ["view", "create", "edit", "approve", "export"],
    procurement: ["view", "create", "edit", "delete", "approve", "export"],
    vendors: ["view", "create", "edit", "delete", "approve", "export"],
    tickets: ["view", "create", "edit", "delete", "approve", "export"],
    tasks: ["view", "create", "edit", "delete", "approve", "export"],
    projects: ["view", "create", "edit", "delete", "approve", "export"],
    employees: ["view", "create", "edit", "delete", "approve", "export"],
    documents: ["view", "create", "edit", "delete", "export"],
    approvals: ["view", "create", "edit", "approve"],
    reports: ["view", "create", "export"],
    ai: ["view", "create"],
    settings: ["view", "create", "edit", "delete"],
    dashboard: ["view"],
  },
  finance: {
    customers: ["view", "create", "edit"],
    invoices: ["view", "create", "edit", "approve", "export"],
    payments: ["view", "create", "edit", "export"],
    gl: ["view", "create", "edit", "approve", "export"],
    procurement: ["view", "approve"],
    vendors: ["view", "create", "edit"],
    documents: ["view", "create", "edit"],
    approvals: ["view", "approve"],
    reports: ["view", "create", "export"],
    ai: ["view", "create"],
    settings: ["view"],
    dashboard: ["view"],
  },
  sales_manager: {
    leads: ["view", "create", "edit", "delete", "approve", "export"],
    customers: ["view", "create", "edit"],
    documents: ["view", "create"],
    approvals: ["view", "approve"],
    reports: ["view", "export"],
    ai: ["view", "create"],
    dashboard: ["view"],
  },
  support_agent: {
    customers: ["view"],
    tickets: ["view", "create", "edit", "approve"],
    documents: ["view", "create"],
    approvals: ["view"],
    reports: ["view"],
    ai: ["view", "create"],
    dashboard: ["view"],
  },
  operations: {
    tasks: ["view", "create", "edit", "approve"],
    projects: ["view", "create", "edit"],
    procurement: ["view", "create"],
    documents: ["view", "create", "edit"],
    approvals: ["view"],
    reports: ["view"],
    ai: ["view", "create"],
    dashboard: ["view"],
  },
  hr: {
    employees: ["view", "create", "edit", "approve", "export"],
    documents: ["view", "create", "edit"],
    approvals: ["view"],
    reports: ["view"],
    ai: ["view", "create"],
    dashboard: ["view"],
  },
  employee: {
    tasks: ["view", "edit"],
    documents: ["view", "create"],
    approvals: ["view"],
    ai: ["view", "create"],
    dashboard: ["view"],
  },
};

export function canDo(role: UserRole, action: ResourceAction, resource: Resource): boolean {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  const allowed = rolePerms[resource];
  if (!allowed) return false;
  return allowed.includes(action);
}

export function getAccessibleModules(role: UserRole): Resource[] {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return [];
  return Object.keys(rolePerms) as Resource[];
}

export function canAccessModule(role: UserRole, resource: Resource): boolean {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  const perms = rolePerms[resource];
  return Array.isArray(perms) && perms.length > 0;
}
