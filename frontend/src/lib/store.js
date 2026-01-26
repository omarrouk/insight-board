import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (typeof window !== "undefined") {
            if (newTheme === "dark") {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
            localStorage.setItem(
              "theme-storage",
              JSON.stringify({ state: { theme: newTheme } }),
            );
          }
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== "undefined") {
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          localStorage.setItem(
            "theme-storage",
            JSON.stringify({ state: { theme } }),
          );
        }
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (typeof window !== "undefined") {
          const theme = state?.theme || "light";
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
    },
  ),
);

export const useNewsStore = create((set) => ({
  selectedCategory: "general",
  searchQuery: "",
  favorites: [],

  setCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFavorites: (favorites) => set({ favorites }),
  addFavorite: (article) =>
    set((state) => ({
      favorites: [...state.favorites, article],
    })),
  removeFavorite: (articleId) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav.articleId !== articleId),
    })),
}));
