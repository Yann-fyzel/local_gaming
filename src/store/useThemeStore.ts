import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () =>
        set((state) => {
          const newMode = !state.isDark;
          document.documentElement.classList.toggle("dark", newMode);
          return { isDark: newMode };
        }),
    }),
    { name: "theme-storage" },
  ),
);
