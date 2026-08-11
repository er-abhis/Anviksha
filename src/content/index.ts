/**
 * Content engine — the ONLY module the app imports content through.
 * It aggregates authored data (worlds, lessons, questions, glossary, badges)
 * and exposes lookup + progression + daily-challenge logic. Adding Worlds 3–10
 * later = author a `lessons/worldN.ts` and register it here. No screen changes.
 */
import {
  DailyChallenge,
  GlossaryTerm,
  Lesson,
  Question,
  World,
} from './types';
import { WORLDS } from './worlds';
import { GLOSSARY } from './glossary';
import { BADGES } from './badges';
import { WORLD1_LESSONS, WORLD1_QUESTIONS } from './lessons/world1';
import { WORLD2_LESSONS, WORLD2_QUESTIONS } from './lessons/world2';
import { WORLD3_LESSONS, WORLD3_QUESTIONS } from './lessons/world3';
import { WORLD4_LESSONS, WORLD4_QUESTIONS } from './lessons/world4';
import { WORLD5_LESSONS, WORLD5_QUESTIONS } from './lessons/world5';
import { WORLD6_LESSONS, WORLD6_QUESTIONS } from './lessons/world6';
import { WORLD7_LESSONS, WORLD7_QUESTIONS } from './lessons/world7';
import { WORLD8_LESSONS, WORLD8_QUESTIONS } from './lessons/world8';
import { WORLD9_LESSONS, WORLD9_QUESTIONS } from './lessons/world9';
import { WORLD10_LESSONS, WORLD10_QUESTIONS } from './lessons/world10';
import { WORLD11_LESSONS, WORLD11_QUESTIONS } from './lessons/world11';

export * from './types';
export { WORLDS, GLOSSARY, BADGES };

/* -------------------- aggregate registries -------------------- */
/** Register a new world's content here — that's the only wiring step. */
export const LESSONS: Lesson[] = [
  ...WORLD1_LESSONS, ...WORLD2_LESSONS, ...WORLD3_LESSONS, ...WORLD4_LESSONS,
  ...WORLD5_LESSONS, ...WORLD6_LESSONS, ...WORLD7_LESSONS, ...WORLD8_LESSONS,
  ...WORLD9_LESSONS, ...WORLD10_LESSONS, ...WORLD11_LESSONS,
];
export const QUESTIONS: Question[] = [
  ...WORLD1_QUESTIONS, ...WORLD2_QUESTIONS, ...WORLD3_QUESTIONS, ...WORLD4_QUESTIONS,
  ...WORLD5_QUESTIONS, ...WORLD6_QUESTIONS, ...WORLD7_QUESTIONS, ...WORLD8_QUESTIONS,
  ...WORLD9_QUESTIONS, ...WORLD10_QUESTIONS, ...WORLD11_QUESTIONS,
];

const LESSON_BY_ID = new Map(LESSONS.map(l => [l.id, l]));
const WORLD_BY_ID = new Map(WORLDS.map(w => [w.id, w]));

/* -------------------- lookups -------------------- */
export const getWorld = (id: string): World | undefined => WORLD_BY_ID.get(id);
export const getLesson = (id: string): Lesson | undefined =>
  LESSON_BY_ID.get(id);

export const lessonsForWorld = (worldId: string): Lesson[] =>
  LESSONS.filter(l => l.worldId === worldId).sort((a, b) => a.order - b.order);

export const questionsForLesson = (lessonId: string): Question[] =>
  QUESTIONS.filter(q => q.lessonId === lessonId);

export const questionsForWorld = (worldId: string): Question[] =>
  QUESTIONS.filter(q => q.worldId === worldId);

export const glossaryTerm = (slug: string): GlossaryTerm | undefined =>
  GLOSSARY.find(t => t.slug === slug);

/* -------------------- dates -------------------- */
export const todayISO = (): string => new Date().toISOString().slice(0, 10);

/* -------------------- progression -------------------- */
/** Passing score for a lesson quiz. */
export const PASS_THRESHOLD = 0.7;

/** A world with lessons is complete once all of them are completed. */
export const isWorldComplete = (
  worldId: string,
  completed: Record<string, number>,
): boolean => {
  const lessons = lessonsForWorld(worldId);
  return lessons.length > 0 && lessons.every(l => l.id in completed);
};

/** World 1 is always open; later worlds open when the previous world is done. */
export const isWorldUnlocked = (
  world: World,
  completed: Record<string, number>,
): boolean => {
  if (world.order === 1) return true;
  const prev = WORLDS.find(w => w.order === world.order - 1);
  return prev ? isWorldComplete(prev.id, completed) : false;
};

/** Lessons unlock sequentially, and only inside an unlocked world. */
export const isLessonUnlocked = (
  lesson: Lesson,
  completed: Record<string, number>,
): boolean => {
  const world = getWorld(lesson.worldId);
  if (!world || !isWorldUnlocked(world, completed)) return false;
  if (lesson.order === 1) return true;
  const prev = lessonsForWorld(lesson.worldId).find(
    l => l.order === lesson.order - 1,
  );
  return prev ? prev.id in completed : true;
};

/** Fraction (0..1) of a world's lessons completed. */
export const worldProgress = (
  worldId: string,
  completed: Record<string, number>,
): number => {
  const lessons = lessonsForWorld(worldId);
  if (lessons.length === 0) return 0;
  const done = lessons.filter(l => l.id in completed).length;
  return done / lessons.length;
};

/** The world the user is currently working through (first unlocked, incomplete). */
export const currentWorld = (completed: Record<string, number>): World => {
  const ordered = [...WORLDS].sort((a, b) => a.order - b.order);
  return (
    ordered.find(
      w => isWorldUnlocked(w, completed) && !isWorldComplete(w.id, completed),
    ) ?? ordered[0]
  );
};

/** First not-yet-completed, unlocked lesson — the "continue" target. */
export const firstAvailableLesson = (
  completed: Record<string, number>,
): Lesson | undefined => {
  const world = currentWorld(completed);
  const lessons = lessonsForWorld(world.id);
  return (
    lessons.find(l => !(l.id in completed) && isLessonUnlocked(l, completed)) ??
    lessons.find(l => !(l.id in completed)) ??
    lessons[0]
  );
};

/** Badge slug awarded when a world is completed. */
export const worldCompleteBadge = (worldId: string): string =>
  `${worldId}-complete`;

/* -------------------- deterministic RNG -------------------- */
/* eslint-disable no-bitwise -- integer hashing / mulberry32 need bit ops */
const hashString = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
};

const mulberry32 = (seed: number) => (): number => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const seededShuffle = <T>(arr: T[], seed: number): T[] => {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
/* eslint-enable no-bitwise */

/* -------------------- lesson quiz -------------------- */
/** A random subset for a lesson quiz (fresh each attempt so retries vary). */
export const quizForLesson = (lessonId: string, count = 8): Question[] => {
  const all = questionsForLesson(lessonId);
  const seed = hashString(lessonId + Math.floor(Math.random() * 1e9));
  return seededShuffle(all, seed).slice(0, Math.min(count, all.length));
};

/* -------------------- daily challenge -------------------- */
export const DAILY_XP_PER_CORRECT = 10;
export const DAILY_COINS_PER_CORRECT = 2;

/**
 * Build the day's challenge: 5–10 questions drawn from UNLOCKED lessons,
 * deterministically per date (so it's stable all day and replay is identical).
 */
export const buildDailyChallenge = (
  date: string,
  completed: Record<string, number>,
): DailyChallenge => {
  const unlocked = LESSONS.filter(l => isLessonUnlocked(l, completed));
  let pool = unlocked.flatMap(l => questionsForLesson(l.id));
  if (pool.length < 5) pool = questionsForWorld(WORLDS[0].id);

  const seed = hashString(date);
  const shuffled = seededShuffle(pool, seed);
  // Duolingo-style set: aim for 12, never more than the pool has.
  const count = Math.min(12, shuffled.length);
  const picked = shuffled.slice(0, count);

  return {
    date,
    questionIds: picked.map(q => q.id),
    xpReward: count * DAILY_XP_PER_CORRECT,
    coinReward: count * DAILY_COINS_PER_CORRECT,
  };
};

/** Resolve question ids back to full questions (for a saved daily session). */
export const questionsByIds = (ids: string[]): Question[] => {
  const byId = new Map(QUESTIONS.map(q => [q.id, q]));
  return ids.map(id => byId.get(id)).filter((q): q is Question => Boolean(q));
};
