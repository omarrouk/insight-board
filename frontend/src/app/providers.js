"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/store";

function ThemeSync() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Sync theme with DOM on mount and when theme changes
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return null;
}

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      {children}
    </QueryClientProvider>
  );
}
