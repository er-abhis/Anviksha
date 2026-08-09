import { Easing } from 'react-native-reanimated';

/** Shared motion tokens so animations feel consistent across the app. */
export const duration = {
  instant: 120,
  fast: 200,
  base: 300,
  slow: 450,
  slower: 700,
} as const;

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
  spring: { damping: 16, stiffness: 160, mass: 1 },
} as const;

export type Duration = typeof duration;
export type Easings = typeof easing;
