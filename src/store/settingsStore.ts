import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';
import { DEFAULTS, LanguageCode } from '../constants/app';

interface SettingsState {
  language: LanguageCode;
  sound: boolean;
  haptics: boolean;
  notifications: boolean;
  setLanguage: (language: LanguageCode) => void;
  setSound: (sound: boolean) => void;
  setHaptics: (haptics: boolean) => void;
  setNotifications: (notifications: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      language: DEFAULTS.language,
      sound: DEFAULTS.sound,
      haptics: DEFAULTS.haptics,
      notifications: DEFAULTS.notifications,
      setLanguage: language => set({ language }),
      setSound: sound => set({ sound }),
      setHaptics: haptics => set({ haptics }),
      setNotifications: notifications => set({ notifications }),
    }),
    {
      name: StorageKeys.language,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
