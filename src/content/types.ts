/**
 * Content engine types — the contract between authored content and the
 * rendering engine. Content (worlds/lessons/questions/glossary) is authored as
 * typed data in `src/content/**` and NEVER hardcoded inside components. The app
 * renders whatever the registry returns, so new content = new data, no code.
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

/* ------------------------------------------------------------------ *
 * Interactive activities
 * ------------------------------------------------------------------ *
 * Every lesson has one. Rather than 11 bespoke screens, the named activities
 * from the brief (Pattern Recognition, Temperature Simulator, Prompt Builder,
 * Agent Workflow Builder, …) are themed configs over 4 reusable primitives.
 * A primitive is functional interactivity; `title` carries the themed name.
 */
export type ActivityKind = 'sequence' | 'bucket' | 'slider' | 'steps';

/** Guess-the-next: pattern recognition / guess-next-token. */
export interface SequenceConfig {
  /** Shown to the learner as the visible run so far. */
  shown: string[];
  options: string[];
  correctIndex: number;
  /** Explains the underlying rule after answering. */
  reveal: string;
}

/** Sort items into the right bucket: classify / match concept / AI-vs-not. */
export interface BucketConfig {
  buckets: string[];
  items: { label: string; bucket: number }[];
}

/** Move a slider, watch behaviour change: temperature / threshold / complexity. */
export interface SliderConfig {
  min: number;
  max: number;
  step: number;
  /** Label for the value (e.g. "Temperature", "Model complexity"). */
  valueLabel: string;
  /** Bands, checked in order; first whose `upTo` >= value wins. */
  stops: { upTo: number; title: string; detail: string }[];
}

/** Arrange in the right order: ML pipeline / agent workflow / RAG / MCP flow. */
export interface StepsConfig {
  /** The correct order. The UI shuffles a copy deterministically. */
  steps: string[];
}

export type Activity =
  | { kind: 'sequence'; title: string; instructions: string; config: SequenceConfig }
  | { kind: 'bucket'; title: string; instructions: string; config: BucketConfig }
  | { kind: 'slider'; title: string; instructions: string; config: SliderConfig }
  | { kind: 'steps'; title: string; instructions: string; config: StepsConfig };

/* ------------------------------------------------------------------ *
 * Question bank
 * ------------------------------------------------------------------ */

export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'identify-prompt'
  | 'predict-output'
  | 'scenario'
  | 'match'
  | 'order';

interface QuestionMeta {
  id: string;
  worldId: string;
  lessonId: string;
  difficulty: Difficulty;
  topic: string;
  prompt: string;
  /** Shown after the learner answers — this is where the teaching happens. */
  explanation: string;
}

/** MC family: multiple-choice, true-false, identify-prompt, predict-output, scenario. */
export interface ChoiceQuestion extends QuestionMeta {
  type: 'multiple-choice' | 'true-false' | 'identify-prompt' | 'predict-output' | 'scenario';
  options: string[];
  correctIndex: number;
}

/** Match the concept — pair each left with its right. */
export interface MatchQuestion extends QuestionMeta {
  type: 'match';
  pairs: { left: string; right: string }[];
}

/** Arrange in the correct order. `items` are given in the CORRECT order. */
export interface OrderQuestion extends QuestionMeta {
  type: 'order';
  items: string[];
}

export type Question = ChoiceQuestion | MatchQuestion | OrderQuestion;

/* ------------------------------------------------------------------ *
 * Lessons & worlds
 * ------------------------------------------------------------------ */

export interface Lesson {
  id: string;
  worldId: string;
  order: number;
  title: string;
  subtitle: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xp: number;
  coins: number;
  /** One or two short sentences — the hook. Never a wall of text. */
  description: string;
  /** Simple real-world explanation / analogy. */
  realWorld: string;
  objectives: string[];
  activity: Activity;
  keyTakeaways: string[];
  prerequisiteLessonIds: string[];
  nextLessonId: string | null;
}

export interface World {
  id: string;
  slug: string;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  gradient: [string, string];
  icon: string;
}

/* ------------------------------------------------------------------ *
 * Glossary & badges
 * ------------------------------------------------------------------ */

export interface GlossaryTerm {
  slug: string;
  name: string;
  simple: string;
  technical: string;
  example: string;
  /** Ionicons name used as the term's illustration reference. */
  icon: string;
  related: string[]; // slugs
}

export interface Badge {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

/** A generated daily-challenge session: a set of questions drawn from the bank. */
export interface DailyChallenge {
  date: string; // yyyy-mm-dd
  questionIds: string[];
  xpReward: number;
  coinReward: number;
}
