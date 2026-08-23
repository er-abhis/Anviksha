/**
 * Mission completion + base scoring. Pure, local logic shared by the mission
 * screen and (later) the scoring / save layers. A mission is "complete" when the
 * learner has both built a working architecture AND cleared every challenge.
 */

import { LabArchitecture, Mission, MissionDifficulty } from '../types';
import { validateArchitecture } from '../validation/validate';
import { challengesFor } from '../challenges/resolve';

/** Base reward per mission, derived from difficulty (Phase 8 refines with
 * hints / retries / efficiency). Understandable and non-arbitrary. */
const DIFFICULTY_SCORE: Record<MissionDifficulty, number> = {
  Beginner: 100,
  Intermediate: 150,
  Advanced: 200,
};

export const missionBaseScore = (mission: Mission): number =>
  DIFFICULTY_SCORE[mission.difficulty];

export const missionChallengeCount = (mission: Mission): number =>
  challengesFor(mission.id).length;

/** True when the built architecture satisfies the mission (valid, no extras). */
export const isArchitectureComplete = (
  mission: Mission,
  arch: LabArchitecture,
): boolean => validateArchitecture(mission, arch).ok;

/** Full mission completion: working build + all challenges solved. */
export const isMissionComplete = (
  mission: Mission,
  arch: LabArchitecture,
  solvedChallengeIds: string[],
): boolean => {
  if (!isArchitectureComplete(mission, arch)) return false;
  const solved = new Set(solvedChallengeIds);
  return challengesFor(mission.id).every(c => solved.has(c.id));
};

/** Human-readable "how to complete this mission" checklist. */
export const completionCriteria = (mission: Mission): string[] => {
  const n = missionChallengeCount(mission);
  return [
    `Build a working ${mission.title.replace('Build ', '')}`,
    n > 0 ? `Solve ${n} challenge${n === 1 ? '' : 's'}` : 'Explore the simulation',
  ];
};
