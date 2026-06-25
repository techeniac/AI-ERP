"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { User, Resource, ResourceAction } from "@/lib/types";
import { canAccessModule } from "@/lib/utils/permissions";

export function useAuth() {
  const { currentUser, isAuthenticated, setUser, logout, hasPermission } = useAuthStore();
  const router = useRouter();

  function signIn(user: User) {
    setUser(user);
    router.push("/dashboard");
  }

  function signOut() {
    logout();
    router.push("/login");
  }

  function can(action: ResourceAction, resource: Resource): boolean {
    return hasPermission(action, resource);
  }

  function canAccess(resource: Resource): boolean {
    if (!currentUser) return false;
    return canAccessModule(currentUser.role, resource);
  }

  return {
    user: currentUser,
    isAuthenticated,
    signIn,
    signOut,
    can,
    canAccess,
    role: currentUser?.role ?? null,
  };
}
