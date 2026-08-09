import { createMMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

/** Single app-wide key-value store. Fast, synchronous, encrypted-capable. */
export const storage = createMMKV({ id: 'anviksha' });

/** Namespaced keys — never use raw strings at call sites. */
export const StorageKeys = {
  theme: 'settings.theme',
  language: 'settings.language',
  sound: 'settings.sound',
  notifications: 'settings.notifications',
  preferences: 'user.preferences',
  progress: 'user.progress',
  achievements: 'user.achievements',
  onboardingComplete: 'app.onboardingComplete',
} as const;

/** Zustand persist adapter backed by MMKV. */
export const zustandMMKVStorage: StateStorage = {
  setItem: (name, value) => storage.set(name, value),
  getItem: name => storage.getString(name) ?? null,
  removeItem: name => storage.remove(name),
};

/** Small typed helpers for direct reads/writes outside of stores. */
export const kv = {
  getBool: (key: string, fallback = false) =>
    storage.contains(key) ? storage.getBoolean(key)! : fallback,
  setBool: (key: string, value: boolean) => storage.set(key, value),
  getString: (key: string, fallback = '') =>
    storage.getString(key) ?? fallback,
  setString: (key: string, value: string) => storage.set(key, value),
  clearAll: () => storage.clearAll(),
};
