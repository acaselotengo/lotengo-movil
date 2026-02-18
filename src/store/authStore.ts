import { create } from "zustand";
import { User } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        set({ user: JSON.parse(raw), isLoading: false });
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
