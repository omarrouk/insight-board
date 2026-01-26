export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: async (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Fetch favorites from backend after login
        try {
          const response = await userAPI.getFavorites();
          const favorites = response.data?.data?.favorites || [];
          useNewsStore.getState().setFavorites(favorites);
        } catch (err) {
          useNewsStore.getState().setFavorites([]);
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Clear favorites on logout
        useNewsStore.getState().setFavorites([]);
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
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
