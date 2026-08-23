/**
 * AI Lab progress store — persisted with the app's standard zustand + MMKV
 * pattern. Tracks per-mission completion, best score, solved challenges and
 * retries, plus accumulated AI-Lab XP (drives the AI Builder Level). Global XP
 * and badges continue to live in progressStore / achievementsStore.
 *
 * Phase 9 (save/resume) will extend this with full saved projects.
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../../../storage/mmkv';
import { LabProject } from '../types';

export interface MissionRecord {
  bestScore: number;
  completedAt: number;
}

/** Fields the caller supplies when saving; id/timestamps are managed here. */
export type SaveProjectInput = Omit<
  LabProject,
  'id' | 'createdAt' | 'updatedAt'
> & { id?: string };

interface AILabState {
  /** missionId -> best result. Presence implies the mission is complete. */
  completed: Record<string, MissionRecord>;
  /** missionId -> solved challenge ids. */
  solvedChallenges: Record<string, string[]>;
  /** missionId -> failed check attempts (for scoring). */
  retries: Record<string, number>;
  /** Accumulated AI-Lab XP → AI Builder Level. */
  aiLabXp: number;
  /** Saved builds, newest activity kept via updatedAt. */
  projects: Record<string, LabProject>;
  /** Monotonic counter for collision-free project ids. */
  projectSeq: number;

  markChallengeSolved: (missionId: string, challengeId: string) => void;
  addRetry: (missionId: string) => void;
  /** Record a completion; keeps the best score, awards XP on first completion. */
  completeMission: (missionId: string, score: number) => void;

  /** Create a new project or update an existing one (by id). Returns the id. */
  saveProject: (input: SaveProjectInput) => string;
  renameProject: (id: string, name: string) => void;
  duplicateProject: (id: string) => string | null;
  deleteProject: (id: string) => void;

  reset: () => void;
}

const initial = {
  completed: {} as Record<string, MissionRecord>,
  solvedChallenges: {} as Record<string, string[]>,
  retries: {} as Record<string, number>,
  aiLabXp: 0,
  projects: {} as Record<string, LabProject>,
  projectSeq: 0,
};

export const useAILabStore = create<AILabState>()(
  persist(
    (set, get) => ({
      ...initial,
      markChallengeSolved: (missionId, challengeId) =>
        set(state => {
          const prev = state.solvedChallenges[missionId] ?? [];
          if (prev.includes(challengeId)) return state;
          return {
            solvedChallenges: {
              ...state.solvedChallenges,
              [missionId]: [...prev, challengeId],
            },
          };
        }),
      addRetry: missionId =>
        set(state => ({
          retries: {
            ...state.retries,
            [missionId]: (state.retries[missionId] ?? 0) + 1,
          },
        })),
      completeMission: (missionId, score) =>
        set(state => {
          const existing = state.completed[missionId];
          // XP is granted once, on first completion.
          const aiLabXp = existing ? state.aiLabXp : state.aiLabXp + score;
          const bestScore = existing
            ? Math.max(existing.bestScore, score)
            : score;
          return {
            aiLabXp,
            completed: {
              ...state.completed,
              [missionId]: { bestScore, completedAt: Date.now() },
            },
          };
        }),
      saveProject: input => {
        const now = Date.now();
        let id = input.id;
        set(state => {
          const existing = id ? state.projects[id] : undefined;
          if (!existing) {
            id = `proj-${state.projectSeq + 1}`;
          }
          const project: LabProject = {
            id: id as string,
            name: input.name,
            missionId: input.missionId,
            components: input.components,
            connections: input.connections,
            score: input.score,
            level: input.level,
            completedChallenges: input.completedChallenges,
            createdAt: existing ? existing.createdAt : now,
            updatedAt: now,
          };
          return {
            projects: { ...state.projects, [project.id]: project },
            projectSeq: existing ? state.projectSeq : state.projectSeq + 1,
          };
        });
        return id as string;
      },
      renameProject: (id, name) =>
        set(state => {
          const p = state.projects[id];
          if (!p) return state;
          return {
            projects: {
              ...state.projects,
              [id]: { ...p, name, updatedAt: Date.now() },
            },
          };
        }),
      duplicateProject: id => {
        const src = get().projects[id];
        if (!src) return null;
        const now = Date.now();
        let newId = '';
        set(state => {
          newId = `proj-${state.projectSeq + 1}`;
          return {
            projects: {
              ...state.projects,
              [newId]: {
                ...src,
                id: newId,
                name: `${src.name} (copy)`,
                createdAt: now,
                updatedAt: now,
              },
            },
            projectSeq: state.projectSeq + 1,
          };
        });
        return newId;
      },
      deleteProject: id =>
        set(state => {
          const next = { ...state.projects };
          delete next[id];
          return { projects: next };
        }),
      reset: () => set(initial),
    }),
    {
      name: StorageKeys.ailab,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);
