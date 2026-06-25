"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PlatformCurrency = "AED" | "USD";

interface PlatformAuthState {
  isPlatformAdmin: boolean;
  adminName: string;
  adminEmail: string;
  platformCurrency: PlatformCurrency;
  _hasHydrated: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
  setCurrency: (currency: PlatformCurrency) => void;
  setHasHydrated: (v: boolean) => void;
}

export const usePlatformAuthStore = create<PlatformAuthState>()(
  persist(
    (set) => ({
      isPlatformAdmin: false,
      adminName: "",
      adminEmail: "",
      platformCurrency: "AED",
      _hasHydrated: false,

      signIn: (email: string) => {
        set({
          isPlatformAdmin: true,
          adminName: "Platform Admin",
          adminEmail: email,
        });
      },

      signOut: () => {
        set({ isPlatformAdmin: false, adminName: "", adminEmail: "" });
      },

      setCurrency: (currency: PlatformCurrency) => set({ platformCurrency: currency }),

      setHasHydrated: (v: boolean) => set({ _hasHydrated: v }),
    }),
    {
      name: "platform-auth",
      partialize: (state) => ({
        isPlatformAdmin: state.isPlatformAdmin,
        adminName: state.adminName,
        adminEmail: state.adminEmail,
        platformCurrency: state.platformCurrency,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
