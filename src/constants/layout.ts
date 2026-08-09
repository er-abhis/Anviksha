/** Breakpoints for phone vs tablet, in dp (shortest side). */
export const BREAKPOINTS = {
  tablet: 600,
  largeTablet: 900,
} as const;

/** Max content width so layouts don't stretch edge-to-edge on tablets. */
export const CONTENT_MAX_WIDTH = 640;

/** Reference dimensions used by the responsive scale helpers (iPhone 13). */
export const GUIDELINE_BASE = {
  width: 390,
  height: 844,
} as const;
