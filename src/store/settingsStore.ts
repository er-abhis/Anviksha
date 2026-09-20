import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';
import { DEFAULTS, LanguageCode } from '../constants/app';

interface SettingsState {
  language: LanguageCode;
  sound: boolean;
  haptics: boolean;
  notifications: boolean;
  notificationTime: string; // e.g. '09:00', '14:00', '20:00'
  setLanguage: (language: LanguageCode) => void;
  setSound: (sound: boolean) => void;
  setHaptics: (haptics: boolean) => void;
  setNotifications: (notifications: boolean) => void;
  setNotificationTime: (time: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      language: DEFAULTS.language,
      sound: DEFAULTS.sound,
      haptics: DEFAULTS.haptics,
      notifications: DEFAULTS.notifications,
      notificationTime: '20:00',
      setLanguage: language => set({ language }),
      setSound: sound => set({ sound }),
      setHaptics: haptics => set({ haptics }),
      setNotifications: notifications => set({ notifications }),
      setNotificationTime: notificationTime => set({ notificationTime }),
    }),
    {
      name: StorageKeys.language,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
