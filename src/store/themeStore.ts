import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system',
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
