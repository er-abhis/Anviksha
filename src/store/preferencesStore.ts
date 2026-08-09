import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';

interface PreferencesState {
  onboardingComplete: boolean;
  reducedMotion: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  setReducedMotion: (value: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    set => ({
      onboardingComplete: false,
      reducedMotion: false,
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboardingComplete: false }),
      setReducedMotion: reducedMotion => set({ reducedMotion }),
    }),
    {
      name: StorageKeys.preferences,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
