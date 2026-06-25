"use client";

import { useAuthStore } from "@/lib/stores/auth.store";
import type { Resource, ResourceAction, UserRole } from "@/lib/types";
import { canDo, canAccessModule, getAccessibleModules } from "@/lib/utils/permissions";

export function usePermissions() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const role = (currentUser?.role ?? "employee") as UserRole;

  function can(action: ResourceAction, resource: Resource): boolean {
    return canDo(role, action, resource);
  }

  function canAccess(resource: Resource): boolean {
    return canAccessModule(role, resource);
  }

  function accessibleModules(): Resource[] {
    return getAccessibleModules(role);
  }

  return { can, canAccess, accessibleModules, role };
}
