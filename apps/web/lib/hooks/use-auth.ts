"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { User, Resource, ResourceAction } from "@/lib/types";
import { canAccessModule } from "@/lib/utils/permissions";

export function useAuth() {
  const { currentUser, isAuthenticated, isOnboarded, setUser, logout, setOnboarded, hasPermission } = useAuthStore();
  const router = useRouter();

  function signIn(user: User) {
    setUser(user);
    const { isOnboarded: alreadyOnboarded } = useAuthStore.getState();
    const isOrgAdmin = user.role === "super_admin";
    if (isOrgAdmin && !alreadyOnboarded) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
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
    isOnboarded,
    signIn,
    signOut,
    setOnboarded,
    can,
    canAccess,
    role: currentUser?.role ?? null,
  };
}
