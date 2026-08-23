/**
 * Builds a randomized, replayable challenge run from validated local data.
 *
 * Everything is derived deterministically from a seed (same seed → identical
 * run, for bug repro) and only ever reshuffles / rephrases EXISTING valid data —
 * it never fabricates a technically-invalid challenge. Anti-repetition uses the
 * recent-variant ring buffer so the same wording doesn't appear twice in a row.
 */

import { Challenge } from '../types';
import { challengesFor } from './resolve';
import { mulberry32, pick, shuffle } from '../random/rng';

/** A challenge with its wording + option order resolved for this run. */
export interface ResolvedChallenge extends Challenge {
  /** Stable key `${challengeId}#${variantIndex}` for history/repro. */
  variantKey: string;
}

export const buildChallengeRun = (
  missionId: string,
  seed: number,
  recentVariantKeys: string[] = [],
): ResolvedChallenge[] => {
  const rand = mulberry32(seed);
  const base = challengesFor(missionId);
  const recent = new Set(recentVariantKeys);

  // Randomize the order challenges are presented in.
  const ordered = shuffle(base, rand);

  return ordered.map(c => {
    const variants = [c.prompt, ...(c.promptVariants ?? [])];
    // Prefer a phrasing the learner hasn't just seen.
    const fresh = variants.filter(
      (_, i) => !recent.has(`${c.id}#${i}`),
    );
    const chosen = pick(fresh.length ? fresh : variants, rand);
    const variantIndex = variants.indexOf(chosen);

    return {
      ...c,
      prompt: chosen,
      // Reshuffle the tray so the fix isn't always in the same spot.
      options: shuffle(c.options, rand),
      variantKey: `${c.id}#${variantIndex}`,
    };
  });
};
