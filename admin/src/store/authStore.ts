"use client";

import { create } from "zustand";
import { fetchMe, loginAdmin, logoutAdmin } from "@/lib/auth";
import { tokenStorage } from "@/lib/api";
import { AdminUser } from "@/types";

interface AuthState {
  user: AdminUser | null;
  status: "checking" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "checking",

  hydrate: async () => {
    const token = tokenStorage.get();
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }
    try {
      const user = await fetchMe();
      if (user.role !== "admin") throw new Error("not admin");
      set({ user, status: "authenticated" });
    } catch {
      tokenStorage.clear();
      set({ status: "unauthenticated", user: null });
    }
  },

  login: async (email, password) => {
    const user = await loginAdmin(email, password);
    set({ user, status: "authenticated" });
  },

  logout: () => {
    logoutAdmin();
    set({ user: null, status: "unauthenticated" });
  },
}));
