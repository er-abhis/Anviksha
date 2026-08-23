/**
 * AI Lab — shared domain types.
 *
 * The architecture data (LabArchitecture) is the single source of truth for a
 * user's build; screens render from it and never hold a separate visual copy.
 * Everything here is local/offline — no network, no real AI. A future
 * RealAIProvider plugs in behind AIProvider without changing any of these.
 */

import { ColorPalette } from '../../theme/colors';

/** The fixed catalog of building blocks a learner can place. */
export type LabComponentId =
  | 'voice_input'
  | 'stt'
  | 'brain'
  | 'memory'
  | 'knowledge'
  | 'search'
  | 'tts'
  | 'calculator'
  | 'vision'
  | 'tool';

/** Loose grouping used for tray sections and node tinting (later phases). */
export type LabComponentCategory =
  | 'input'
  | 'process'
  | 'memory'
  | 'knowledge'
  | 'output'
  | 'tool';

export interface LabComponent {
  id: LabComponentId;
  emoji: string;
  label: string;
  /** Ionicons name (matches the rest of the app's iconography). */
  icon: string;
  /** One-line, plain-language explanation of what this block does. */
  blurb: string;
  category: LabComponentCategory;
}

export type MissionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Mission {
  id: string;
  emoji: string;
  title: string;
  /** Short hook shown on the mission card. */
  tagline: string;
  /** The single AI concept this mission teaches. */
  concept: string;
  /** "Your goal is…" briefing shown before building. */
  objective: string;
  difficulty: MissionDifficulty;
  /** Semantic theme color role — resolves correctly in light + dark. */
  accent: keyof ColorPalette;

  /** Components that MUST be present for the build to work. */
  required: LabComponentId[];
  /** Components that improve the build but aren't required. */
  optional: LabComponentId[];
  /** Components that make no sense for this mission (used by validation later). */
  invalid: LabComponentId[];
  /** The ideal pipeline, in order — used by validation + simulation later. */
  solution: LabComponentId[];
}

/**
 * A user's build. The source of truth — the builder UI is a projection of this.
 * `connections` are ordered [from, to] pairs; for the current vertical-pipeline
 * model they mirror adjacency in `components`, but the shape supports richer
 * graphs later without a data migration.
 */
export interface LabArchitecture {
  missionId: string;
  components: LabComponentId[];
  connections: Array<[LabComponentId, LabComponentId]>;
}

/** A locally-saved build the learner can resume, rename, duplicate or delete. */
export interface LabProject {
  id: string;
  name: string;
  missionId: string;
  components: LabComponentId[];
  connections: Array<[LabComponentId, LabComponentId]>;
  score: number;
  level: number;
  completedChallenges: string[];
  createdAt: number;
  updatedAt: number;
}

/** The kinds of hurdle a challenge can pose (drives wording + icon). */
export type ChallengeType =
  | 'missing_component'
  | 'wrong_component'
  | 'wrong_connection'
  | 'missing_capability'
  | 'optimization'
  | 'debugging';

/**
 * A local "hurdle" for the game loop. Starts from a (usually broken)
 * architecture; the learner fixes it by adding / removing / reordering blocks.
 * Success is data-driven via expectAdd / expectRemove / expectOrder — one
 * resolver handles every type, no per-challenge logic.
 */
export interface Challenge {
  id: string;
  missionId: string;
  type: ChallengeType;
  /** The scenario shown to the learner (canonical wording). */
  prompt: string;
  /** Alternate phrasings of the SAME problem, used for replay variety. */
  promptVariants?: string[];
  /** A nudge toward the fix without giving it away. */
  hint: string;
  /** The architecture the challenge begins with. */
  startComponents: LabComponentId[];
  /** Blocks offered in the tray (fix candidates + distractors). */
  options: LabComponentId[];
  expectAdd?: LabComponentId[];
  expectRemove?: LabComponentId[];
  expectOrder?: LabComponentId[];
  /** Why the fix works — shown after "Problem solved!". */
  success: string;
}
