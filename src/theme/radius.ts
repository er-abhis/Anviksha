/** Rounded, bold radii. Large corners are core to the redesign's feel. */
export const radius = {
  none: 0,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  xxl: 36,
  pill: 999,
} as const;

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
