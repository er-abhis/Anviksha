/**
 * Deterministic pseudo-randomness for AI Lab replayability. A given seed always
 * produces the same sequence, so a randomized challenge run can be reproduced
 * exactly when debugging. mulberry32 is a tiny, well-known 32-bit PRNG.
 */

export type Rng = () => number;

export const mulberry32 = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Fisher–Yates shuffle into a new array (does not mutate the input). */
export const shuffle = <T>(arr: T[], rand: Rng): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const pick = <T>(arr: T[], rand: Rng): T =>
  arr[Math.floor(rand() * arr.length)];
