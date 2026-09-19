import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';
import { ThemeMode } from '../theme';

export type ThemePreference = ThemeMode | 'system';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'dark', // Dark mode is default
      setPreference: preference => set({ preference }),
      toggle: () =>
        set({ preference: get().preference === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: StorageKeys.theme,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
