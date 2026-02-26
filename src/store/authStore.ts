import { create } from "zustand";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDb } from "../db/mockDb";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AUTH_KEY = "@lotengo_auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,

  setUser: (user) => {
    set({ user });
    if (user) {
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
    } else {
      AsyncStorage.removeItem(AUTH_KEY);
    }
  },

  logout: async () => {
    set({ user: null });
    await AsyncStorage.removeItem(AUTH_KEY);
  },

  loadSession: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as User;
        // Use fresh data from DB (includes migrations) to keep user profile up to date
        const freshFromDb = getDb().users.find((u) => u.id === stored.id);
        set({ user: freshFromDb ?? stored, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, ...updates };
      set({ user: updated });
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updated));
    }
  },
}));
