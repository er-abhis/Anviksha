/**
 * Color primitives + semantic palettes.
 * Primitives are raw values; semantic palettes (light/dark) map them to roles.
 * Components should ONLY consume semantic colors via `useTheme()`, never primitives.
 *
 * Design language: bold, energetic and premium. Electric violet brand paired
 * with cyan + magenta neon accents, deep near-black surfaces, colored glow and
 * frosted glass. Gradients and glow are first-class tokens (see `gradients`).
 */

const palette = {
  // Brand — electric violet, vivid and confident
  violet50: '#F1EEFF',
  violet100: '#E3DCFF',
  violet300: '#B7A6FF',
  violet400: '#9B85FF',
  violet500: '#7C5CFF',
  violet600: '#6438F5',
  violet700: '#4B21D9',

  // Neon accents
  cyan400: '#22E0D6',
  cyan500: '#06D6C4',
  magenta400: '#FF5FA2',
  magenta500: '#FF2E93',
  blue500: '#3B82F6',
  purple500: '#A855F7',

  // Signal
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  rose500: '#FB3B5C',
  green400: '#34E39B',
  green500: '#12D18E',

  // Neutrals — cool, deep, high-contrast
  white: '#FFFFFF',
  black: '#000000',
  gray0: '#FFFFFF',
  gray50: '#F6F7FB',
  gray100: '#EDEFF6',
  gray200: '#DEE1EC',
  gray300: '#C6CBDB',
  gray400: '#969CB3',
  gray500: '#6B7188',
  gray600: '#494F63',
  gray700: '#2F3345',
  gray800: '#1E2130',
  gray850: '#161826',
  gray900: '#0F111C',
  gray950: '#080910',
} as const;

/** A gradient is an ordered list of stop colors consumed by <Gradient/>. */
export type GradientTuple = readonly [string, string, ...string[]];

export type Gradients = {
  /** Primary brand gradient — violet to magenta. */
  brand: GradientTuple;
  /** Cool secondary — violet to cyan. */
  cool: GradientTuple;
  /** Warm accent — magenta to amber. */
  warm: GradientTuple;
  /** Success — cyan to green. */
  success: GradientTuple;
  /** Subtle backdrop wash matched to the theme background. */
  backdrop: GradientTuple;
  /** Glass sheen overlay (semi-transparent). */
  sheen: GradientTuple;
};

export type ColorPalette = {
  // surfaces
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceElevated: string;
  overlay: string;
  border: string;
  borderStrong: string;

  // glass — frosted surface used by GlassCard / headers / tab bar
  glass: string;
  glassBorder: string;

  // content
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // brand + roles
  primary: string;
  primaryMuted: string;
  onPrimary: string;
  accent: string;
  accentAlt: string;
  xp: string;
  coins: string;
  streak: string;
  success: string;
  warning: string;
  error: string;

  // glow — colored shadow tint for neon elevation
  glow: string;

  // misc
  skeleton: string;
  shadow: string;
};

export const lightColors: ColorPalette = {
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  surfaceElevated: palette.white,
  overlay: 'rgba(15,17,28,0.45)',
  border: palette.gray200,
  borderStrong: palette.gray300,

  glass: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.9)',

  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,

  primary: palette.violet600,
  primaryMuted: 'rgba(124,92,255,0.12)',
  onPrimary: palette.white,
  accent: palette.cyan500,
  accentAlt: palette.magenta500,
  xp: palette.cyan500,
  coins: palette.amber500,
  streak: palette.amber500,
  success: palette.green500,
  warning: palette.amber500,
  error: palette.rose500,

  glow: palette.violet500,

  skeleton: palette.gray200,
  shadow: 'rgba(76,33,217,0.35)',
};

export const darkColors: ColorPalette = {
  background: palette.gray950,
  surface: palette.gray900,
  surfaceAlt: palette.gray850,
  surfaceElevated: palette.gray800,
  overlay: 'rgba(0,0,0,0.66)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.16)',

  glass: 'rgba(30,33,48,0.55)',
  glassBorder: 'rgba(255,255,255,0.12)',

  text: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,

  primary: palette.violet400,
  primaryMuted: 'rgba(124,92,255,0.20)',
  onPrimary: palette.white,
  accent: palette.cyan400,
  accentAlt: palette.magenta400,
  xp: palette.cyan400,
  coins: palette.amber400,
  streak: palette.amber400,
  success: palette.green400,
  warning: palette.amber400,
  error: palette.rose500,

  glow: palette.violet500,

  skeleton: palette.gray800,
  shadow: 'rgba(0,0,0,0.6)',
};

export const lightGradients: Gradients = {
  brand: [palette.violet500, palette.magenta500],
  cool: [palette.violet500, palette.cyan500],
  warm: [palette.magenta500, palette.amber500],
  success: [palette.cyan500, palette.green500],
  backdrop: [palette.violet50, palette.gray50],
  sheen: ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)'],
};

export const darkGradients: Gradients = {
  brand: [palette.violet500, palette.magenta500],
  cool: [palette.violet500, palette.cyan400],
  warm: [palette.magenta500, palette.amber400],
  success: [palette.cyan400, palette.green400],
  backdrop: [palette.gray900, palette.gray950],
  sheen: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'],
};

export { palette };
