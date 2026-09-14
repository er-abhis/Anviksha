import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StorageKeys, zustandMMKVStorage } from '../../storage/mmkv';

/**
 * Local-only progress for the AI Brain playground. Separate from the global
 * progress store so the new features can't corrupt existing data; global XP
 * still flows through `useProgressStore` at the call sites. Everything here is
 * deterministic and offline — including the spaced-revision schedule.
 */

const DAY = 24 * 60 * 60 * 1000;

export interface ConceptStat {
  attempts: number;
  correct: number;
  lastResult: 'right' | 'wrong';
  /** Epoch ms when this concept is next due for review (spaced repetition). */
  nextReviewAt: number;
}

interface BrainState {
  /** simId -> first-completed timestamp. */
  simsCompleted: Record<string, number>;
  /** detective caseId -> { solved, attempts }. */
  cases: Record<string, { solved: boolean; attempts: number }>;
  /** concept -> mastery + revision schedule. */
  concepts: Record<string, ConceptStat>;

  completeSim: (simId: string, concept: string, at: number) => boolean;
  recordCase: (caseId: string, concept: string, correct: boolean, at: number) => void;
  reset: () => void;
}

const initial = {
  simsCompleted: {} as Record<string, number>,
  cases: {} as Record<string, { solved: boolean; attempts: number }>,
  concepts: {} as Record<string, ConceptStat>,
};

/** Wrong → review tomorrow; right → push out by 4 days (classic spacing). */
const scheduleNext = (at: number, correct: boolean): number =>
  at + (correct ? 4 : 1) * DAY;

const bumpConcept = (
  prev: ConceptStat | undefined,
  correct: boolean,
  at: number,
): ConceptStat => ({
  attempts: (prev?.attempts ?? 0) + 1,
  correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
  lastResult: correct ? 'right' : 'wrong',
  nextReviewAt: scheduleNext(at, correct),
});

export const useBrainStore = create<BrainState>()(
  persist(
    set => ({
      ...initial,
      // Returns true only the first time a sim is completed (for one-off XP).
      completeSim: (simId, concept, at) => {
        let firstTime = false;
        set(state => {
          firstTime = !state.simsCompleted[simId];
          return {
            simsCompleted: { ...state.simsCompleted, [simId]: state.simsCompleted[simId] ?? at },
            // Playing a sim counts as a correct concept touch.
            concepts: { ...state.concepts, [concept]: bumpConcept(state.concepts[concept], true, at) },
          };
        });
        return firstTime;
      },
      recordCase: (caseId, concept, correct, at) =>
        set(state => {
          const prev = state.cases[caseId];
          return {
            cases: {
              ...state.cases,
              [caseId]: {
                solved: prev?.solved || correct,
                attempts: (prev?.attempts ?? 0) + 1,
              },
            },
            concepts: {
              ...state.concepts,
              [concept]: bumpConcept(state.concepts[concept], correct, at),
            },
          };
        }),
      reset: () => set(initial),
    }),
    {
      name: StorageKeys.brain,
      storage: createJSONStorage(() => zustandMMKVStorage),
    },
  ),
);

/* ----------------------------- derived selectors --------------------------- */
export const simsCompletedCount = (s: BrainState): number =>
  Object.keys(s.simsCompleted).length;

/** Concepts with at least one correct answer = "mastered". */
export const conceptsMastered = (s: BrainState): number =>
  Object.values(s.concepts).filter(c => c.correct > 0).length;

/**
 * Concepts due for review now, worst (last wrong) first. Takes the raw concepts
 * map (a stable store reference) — NEVER call this inside a zustand selector, as
 * it returns a fresh array and would trigger an infinite re-render loop. Select
 * `s.concepts` and derive with this in a useMemo instead.
 */
export const dueForReview = (
  concepts: Record<string, ConceptStat>,
  now: number,
): string[] =>
  Object.entries(concepts)
    .filter(([, c]) => c.nextReviewAt <= now)
    .sort((a, b) => {
      // Wrong-last beats right-last; then earliest due.
      const wa = a[1].lastResult === 'wrong' ? 0 : 1;
      const wb = b[1].lastResult === 'wrong' ? 0 : 1;
      return wa - wb || a[1].nextReviewAt - b[1].nextReviewAt;
    })
    .map(([concept]) => concept);
