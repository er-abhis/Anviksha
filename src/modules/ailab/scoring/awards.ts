/**
 * Maps AI Lab progress to badge slugs (defined in content/badges.ts, unlocked
 * via achievementsStore). Pure — takes a snapshot of progress and returns the
 * slugs that should now be unlocked. Idempotent unlocks make re-runs harmless.
 */

import { MISSIONS } from '../data/missions';

export interface AwardSnapshot {
  /** Mission ids the learner has fully completed. */
  completedMissionIds: string[];
  /** Total challenges solved across all missions. */
  totalChallengesSolved: number;
}

const VISION_MISSIONS = ['plant_ai', 'image_detective'];

export const awardBadges = (snap: AwardSnapshot): string[] => {
  const completed = new Set(snap.completedMissionIds);
  const slugs: string[] = [];

  if (completed.size > 0) slugs.push('ailab-first-build', 'ailab-architect');
  if (snap.totalChallengesSolved >= 5) slugs.push('ailab-bug-hunter');
  if (completed.has('voice_assistant')) slugs.push('ailab-voice-engineer');
  if (VISION_MISSIONS.some(id => completed.has(id)))
    slugs.push('ailab-vision-explorer');
  if (completed.has('ai_game')) slugs.push('ailab-tool-master');
  if (completed.has('research_assistant')) slugs.push('ailab-agent-builder');
  if (MISSIONS.every(m => completed.has(m.id))) slugs.push('ailab-master');

  return slugs;
};
