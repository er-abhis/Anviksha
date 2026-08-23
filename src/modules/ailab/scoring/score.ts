/**
 * Understandable, non-arbitrary mission scoring. Every point is traceable to a
 * labelled line so the learner can see exactly how their score was earned.
 */

export interface ScoreInput {
  /** Did the built architecture pass validation? */
  architectureValid: boolean;
  /** Mission base reward (from difficulty). */
  baseScore: number;
  challengesSolved: number;
  /** Optional components the learner added (rewards richer builds). */
  optionalUsed: number;
  /** Failed "Check my fix" attempts across the challenges. */
  retries: number;
}

export interface ScoreLine {
  label: string;
  points: number;
}

export interface ScoreResult {
  total: number;
  lines: ScoreLine[];
}

const PER_CHALLENGE = 25;
const PER_OPTIONAL = 15;
const OPTIONAL_CAP = 2; // reward up to two optional upgrades
const RETRY_PENALTY = 5;

export const computeScore = (input: ScoreInput): ScoreResult => {
  const lines: ScoreLine[] = [];

  lines.push({
    label: 'Working architecture',
    points: input.architectureValid ? input.baseScore : 0,
  });

  if (input.challengesSolved > 0) {
    lines.push({
      label: `Challenges solved (${input.challengesSolved})`,
      points: input.challengesSolved * PER_CHALLENGE,
    });
  }

  const optional = Math.min(input.optionalUsed, OPTIONAL_CAP);
  if (optional > 0) {
    lines.push({
      label: `Optional upgrades (${optional})`,
      points: optional * PER_OPTIONAL,
    });
  }

  if (input.retries > 0) {
    lines.push({
      label: `Retries (${input.retries})`,
      points: -input.retries * RETRY_PENALTY,
    });
  }

  const total = Math.max(
    0,
    lines.reduce((sum, l) => sum + l.points, 0),
  );
  return { total, lines };
};

/** AI Builder Level from accumulated AI-Lab XP. 250 XP per level, understandable. */
export const builderLevelForXp = (xp: number): number =>
  Math.floor(xp / 250) + 1;

/** XP still needed to reach the next AI Builder Level. */
export const xpToNextLevel = (xp: number): number => 250 - (xp % 250);
