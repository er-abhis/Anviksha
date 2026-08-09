/**
 * Static app content (curriculum). This is authored content — NOT user
 * progress. Progress/unlock state lives in the persisted stores; this file
 * only describes what exists. A brand-new user sees all of this locked/at-zero
 * because their store is empty.
 */

export interface WorldContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  gradient: [string, string];
  icon: string;
}

export interface LessonContent {
  id: string;
  worldId: string;
  title: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
}

export interface AchievementDef {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export interface DailyChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  xpReward: number;
  coinReward: number;
}

export const WORLDS: WorldContent[] = [
  {
    id: 'world-foundations',
    slug: 'foundations',
    title: 'Foundations of Learning',
    subtitle: 'How machines find patterns',
    order: 1,
    gradient: ['#4B58F0', '#2DD4BF'],
    icon: 'planet',
  },
  {
    id: 'world-neural-nets',
    slug: 'neural-nets',
    title: 'Neural Networks',
    subtitle: 'Layers, weights and learning',
    order: 2,
    gradient: ['#7C3AED', '#DB2777'],
    icon: 'git-network',
  },
  {
    id: 'world-language',
    slug: 'language',
    title: 'Language & LLMs',
    subtitle: 'How models understand words',
    order: 3,
    gradient: ['#2563EB', '#06B6D4'],
    icon: 'chatbubbles',
  },
  {
    id: 'world-generative',
    slug: 'generative',
    title: 'Generative AI',
    subtitle: 'Creating images, text and sound',
    order: 4,
    gradient: ['#EA580C', '#F59E0B'],
    icon: 'sparkles',
  },
];

export const LESSONS: LessonContent[] = [
  {
    id: 'lesson-what-is-ai',
    worldId: 'world-foundations',
    title: 'What is Artificial Intelligence?',
    summary: 'The big picture — what AI is and what it is not.',
    order: 1,
    estimatedMinutes: 5,
  },
  {
    id: 'lesson-patterns',
    worldId: 'world-foundations',
    title: 'Finding Patterns in Data',
    summary: 'How machines spot structure humans miss.',
    order: 2,
    estimatedMinutes: 7,
  },
  {
    id: 'lesson-perceptron',
    worldId: 'world-foundations',
    title: 'Perceptron Basics',
    summary: 'The simplest building block of a neural network.',
    order: 3,
    estimatedMinutes: 8,
  },
];

/** Catalog of every achievement. Unlocked state lives in achievementsStore. */
export const ACHIEVEMENTS: AchievementDef[] = [
  {
    slug: 'first-challenge',
    title: 'First Challenge',
    description: 'Complete your first daily challenge.',
    icon: 'sparkles',
  },
  {
    slug: 'first-lesson',
    title: 'First Steps',
    description: 'Finish your first lesson.',
    icon: 'footsteps',
  },
  {
    slug: 'streak-3',
    title: '3-Day Streak',
    description: 'Keep a 3-day learning streak.',
    icon: 'flame',
  },
  {
    slug: 'world-1-complete',
    title: 'Explorer',
    description: 'Complete the Foundations world.',
    icon: 'compass',
  },
];

/** Placeholder daily challenge. Replaced by generated content in a later phase. */
export const DAILY_CHALLENGE: DailyChallengeQuestion = {
  id: 'daily-what-is-ai',
  question: 'What is Artificial Intelligence?',
  options: [
    'Software that lets machines perform tasks that normally need human intelligence',
    'A type of computer monitor',
    'A programming language released in 2020',
    'A brand of robot vacuum',
  ],
  correctIndex: 0,
  xpReward: 50,
  coinReward: 10,
};

/** Today's date as ISO yyyy-mm-dd (local). */
export const todayISO = (): string => new Date().toISOString().slice(0, 10);

/** A world is unlocked if it's the first, or the previous world is completed. */
export const isWorldUnlocked = (
  world: WorldContent,
  completedWorlds: Record<string, true>,
): boolean => {
  if (world.order === 1) return true;
  const prev = WORLDS.find(w => w.order === world.order - 1);
  return prev ? Boolean(completedWorlds[prev.id]) : false;
};

/** The world the user is currently working through (first unlocked, incomplete). */
export const currentWorld = (
  completedWorlds: Record<string, true>,
): WorldContent => {
  const ordered = [...WORLDS].sort((a, b) => a.order - b.order);
  return (
    ordered.find(
      w => isWorldUnlocked(w, completedWorlds) && !completedWorlds[w.id],
    ) ?? ordered[0]
  );
};

/** Lessons of a world, ordered. */
export const lessonsForWorld = (worldId: string): LessonContent[] =>
  LESSONS.filter(l => l.worldId === worldId).sort((a, b) => a.order - b.order);

/** First not-yet-completed lesson in the current world (the "continue" target). */
export const firstAvailableLesson = (
  completed: Record<string, number>,
  completedWorlds: Record<string, true>,
): LessonContent | undefined => {
  const world = currentWorld(completedWorlds);
  const lessons = lessonsForWorld(world.id);
  return lessons.find(l => !(l.id in completed)) ?? lessons[0];
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
