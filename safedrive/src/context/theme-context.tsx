import React, { createContext, useContext, useState, useEffect } from "react";
import { DarkTheme, LightTheme, ThemeType } from "../constants/theme";
import { getThemeMode, saveThemeMode } from "../services/storage";

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      const mode = await getThemeMode();
      setIsDark(mode === "dark");
    }
    loadTheme();
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      saveThemeMode(next ? "dark" : "light");
      return next;
    });
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
