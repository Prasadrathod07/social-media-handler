import { create } from "zustand";
import { fetchMe, loginUser, logout as apiLogout, registerUser } from "../api/auth";
import { tokenStorage } from "../api/client";
import { User } from "../types";

interface AuthState {
  user: User | null;
  status: "checking" | "authenticated" | "unauthenticated";
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "checking",

  hydrate: async () => {
    const token = await tokenStorage.getAccessToken();
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }
    try {
      const user = await fetchMe();
      set({ user, status: "authenticated" });
    } catch {
      await tokenStorage.clear();
      set({ status: "unauthenticated", user: null });
    }
  },

  login: async (email, password) => {
    const user = await loginUser(email, password);
    set({ user, status: "authenticated" });
  },

  register: async (email, password, name) => {
    const user = await registerUser(email, password, name);
    set({ user, status: "authenticated" });
  },

  logout: async () => {
    await apiLogout();
    set({ user: null, status: "unauthenticated" });
  },

  refreshUser: async () => {
    const user = await fetchMe();
    set({ user });
  },
}));
