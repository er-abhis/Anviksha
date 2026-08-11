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

/** The ISO (yyyy-mm-dd) day before the given ISO day. */
const prevISODay = (iso: string): string => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

/**
 * Next streak length given the previously-completed day and today.
 * Consecutive day → +1; same day (already counted) → unchanged; any gap → 1.
 */
const nextStreak = (prevDate: string | null, today: string, current: number): number => {
  if (prevDate === today) return current || 1;
  if (prevDate === prevISODay(today)) return current + 1;
  return 1;
};

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
            streakDays: nextStreak(state.dailyCompletedDate, date, state.streakDays),
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
