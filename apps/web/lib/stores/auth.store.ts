"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole, Resource, ResourceAction } from "@/lib/types";
import { canDo } from "@/lib/utils/permissions";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  hasPermission: (action: ResourceAction, resource: Resource) => boolean;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user: User) => {
        set({ currentUser: user, isAuthenticated: true });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      hasPermission: (action: ResourceAction, resource: Resource): boolean => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return canDo(currentUser.role as UserRole, action, resource);
      },

      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
    }),
    {
      name: "ai-erp-auth",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
