import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeMode, themes } from './index';
import { useThemeStore } from '../store/themeStore';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const preference = useThemeStore(s => s.preference);
  const systemScheme = useColorScheme();

  const value = useMemo<ThemeContextValue>(() => {
    const mode: ThemeMode =
      preference === 'system'
        ? systemScheme === 'dark'
          ? 'dark'
          : 'light'
        : preference;
    return { theme: themes[mode], mode };
  }, [preference, systemScheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/** Access the active theme. Throws if used outside ThemeProvider. */
export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx.theme;
};

/** Convenience hook when only the mode string is needed (e.g. StatusBar). */
export const useThemeMode = (): ThemeMode => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return ctx.mode;
};
