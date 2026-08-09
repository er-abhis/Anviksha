import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../storage/mmkv';
import { PlayerStats } from '../types/domain';

export interface ActivityEntry {
  id: string;
  label: string;
  detail: string;
  icon: string;
  at: number;
}

interface ProgressState extends PlayerStats {
  /** entityId -> score (0..100). Presence implies "completed". */
  completed: Record<string, number>;
  /** worldId -> true once all its lessons are done. */
  completedWorlds: Record<string, true>;
  /** ISO date of the last completed daily challenge, or null. */
  dailyCompletedDate: string | null;
  /** Recent activity feed, newest first. */
  activity: ActivityEntry[];
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  markCompleted: (entityId: string, score: number) => void;
  completeWorld: (worldId: string) => void;
  completeDailyChallenge: (date: string, xp: number, coins: number) => void;
  logActivity: (entry: Omit<ActivityEntry, 'id'>) => void;
  reset: () => void;
}

const initial = {
  xp: 0,
  coins: 0,
  level: 1,
  streakDays: 0,
  completed: {} as Record<string, number>,
  completedWorlds: {} as Record<string, true>,
  dailyCompletedDate: null as string | null,
  activity: [] as ActivityEntry[],
};

// Simple, tunable curve. ponytail: flat 500xp/level; swap for a curve when design lands.
const levelForXp = (xp: number) => Math.floor(xp / 500) + 1;

const MAX_ACTIVITY = 20;

export const useProgressStore = create<ProgressState>()(
  persist(
    set => ({
      ...initial,
      addXp: amount =>
        set(state => {
          const xp = state.xp + amount;
          return { xp, level: levelForXp(xp) };
        }),
      addCoins: amount => set(state => ({ coins: state.coins + amount })),
      markCompleted: (entityId, score) =>
        set(state => ({
          completed: { ...state.completed, [entityId]: score },
        })),
      completeWorld: worldId =>
        set(state => ({
          completedWorlds: { ...state.completedWorlds, [worldId]: true },
        })),
      completeDailyChallenge: (date, xp, coins) =>
        set(state => {
          const nextXp = state.xp + xp;
          return {
            dailyCompletedDate: date,
            xp: nextXp,
            level: levelForXp(nextXp),
            coins: state.coins + coins,
            // ponytail: naive streak (1 on first completion). Real day-gap logic later.
            streakDays: state.streakDays === 0 ? 1 : state.streakDays,
          };
        }),
      logActivity: entry =>
        set(state => ({
          activity: [
            { ...entry, id: `${entry.at}-${entry.label}` },
            ...state.activity,
          ].slice(0, MAX_ACTIVITY),
        })),
      reset: () => set(initial),
    }),
    {
      name: StorageKeys.progress,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
