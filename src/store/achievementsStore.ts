import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';

interface AchievementsState {
  /** slug -> unlock timestamp (ms). */
  unlocked: Record<string, number>;
  unlock: (slug: string, at: number) => void;
  isUnlocked: (slug: string) => boolean;
  reset: () => void;
}

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      unlocked: {},
      unlock: (slug, at) =>
        set(state =>
          state.unlocked[slug]
            ? state
            : { unlocked: { ...state.unlocked, [slug]: at } },
        ),
      isUnlocked: slug => Boolean(get().unlocked[slug]),
      reset: () => set({ unlocked: {} }),
    }),
    {
      name: StorageKeys.achievements,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
