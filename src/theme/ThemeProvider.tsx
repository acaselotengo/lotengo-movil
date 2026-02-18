import React, { createContext, useMemo, useState, useCallback } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme, AppTheme } from "./tokens";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: "system",
  setMode: () => {},
  isDark: false,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = "system" }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";
  const theme = isDark ? darkTheme : lightTheme;

  const handleSetMode = useCallback((m: ThemeMode) => {
    setMode(m);
  }, []);

  const value = useMemo(
    () => ({ theme, mode, setMode: handleSetMode, isDark }),
    [theme, mode, handleSetMode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
