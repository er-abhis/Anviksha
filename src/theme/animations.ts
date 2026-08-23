import { Easing } from 'react-native-reanimated';

/** Shared motion tokens so animations feel consistent across the app. */
export const duration = {
  instant: 120,
  fast: 200,
  base: 300,
  slow: 450,
  slower: 700,
  ambient: 4000, // looping background motion (blobs, sheen)
} as const;

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
  // Springs — reuse across press feedback and entrances for a consistent feel.
  spring: { damping: 16, stiffness: 160, mass: 1 },
  springBouncy: { damping: 11, stiffness: 220, mass: 0.9 },
  springSoft: { damping: 20, stiffness: 120, mass: 1 },
} as const;

export type Duration = typeof duration;
export type Easings = typeof easing;
