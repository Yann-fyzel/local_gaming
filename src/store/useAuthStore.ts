import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "../types/games";

interface AuthState {
  user: Player | null;
  token: string | null;
  setAuth: (user: Player, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => {
        localStorage.removeItem("token"); // Pour Axios
        set({ user: null, token: null });
      },
    }),
    { name: "game-auth-storage" }, // Nom de la clé dans le localStorage
  ),
);
