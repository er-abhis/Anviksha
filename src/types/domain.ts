/**
 * Core domain models. These mirror the SQLite schema (`src/database/schema.ts`)
 * and are the single source of truth for entity shapes across the app.
 * No data/business logic yet — types only.
 */

export type ID = string;

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface World {
  id: ID;
  slug: string;
  title: string;
  subtitle: string;
  order: number;
  accentColor: string;
  icon: string;
  isLocked: boolean;
}

export interface Lesson {
  id: ID;
  worldId: ID;
  title: string;
  summary: string;
  order: number;
  estimatedMinutes: number;
}

export interface Simulation {
  id: ID;
  lessonId: ID;
  title: string;
  description: string;
  difficulty: Difficulty;
  order: number;
}

export interface Progress {
  id: ID;
  entityType: 'world' | 'lesson' | 'simulation';
  entityId: ID;
  completed: boolean;
  score: number;
  updatedAt: number;
}

export interface Achievement {
  id: ID;
  slug: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface DailyChallenge {
  id: ID;
  date: string; // ISO yyyy-mm-dd
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface Bookmark {
  id: ID;
  entityType: 'lesson' | 'simulation';
  entityId: ID;
  createdAt: number;
}

/** Aggregated player stats surfaced on Home / Profile. */
export interface PlayerStats {
  xp: number;
  coins: number;
  level: number;
  streakDays: number;
}
