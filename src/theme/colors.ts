/**
 * Color primitives + semantic palettes.
 * Primitives are raw values; semantic palettes map them to roles.
 * Components should ONLY consume semantic colors via `useTheme()`, never primitives.
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
  brand: GradientTuple;
  cool: GradientTuple;
  warm: GradientTuple;
  success: GradientTuple;
  backdrop: GradientTuple;
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

// 1. Dark Theme (Default Cyber Violet)
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

export const darkGradients: Gradients = {
  brand: [palette.violet500, palette.magenta500],
  cool: [palette.violet500, palette.cyan400],
  warm: [palette.magenta500, palette.amber400],
  success: [palette.cyan400, palette.green400],
  backdrop: [palette.gray900, palette.gray950],
  sheen: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)'],
};

// 2. Midnight Theme (Deep Sapphire)
export const midnightColors: ColorPalette = {
  background: '#070B14',
  surface: '#0F172A',
  surfaceAlt: '#1E293B',
  surfaceElevated: '#334155',
  overlay: 'rgba(7,11,20,0.75)',
  border: 'rgba(56,189,248,0.12)',
  borderStrong: 'rgba(56,189,248,0.25)',

  glass: 'rgba(15,23,42,0.65)',
  glassBorder: 'rgba(56,189,248,0.20)',

  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#0F172A',

  primary: '#38BDF8',
  primaryMuted: 'rgba(56,189,248,0.18)',
  onPrimary: '#0F172A',
  accent: '#818CF8',
  accentAlt: '#38BDF8',
  xp: '#38BDF8',
  coins: palette.amber400,
  streak: palette.amber400,
  success: '#34D399',
  warning: palette.amber400,
  error: palette.rose500,

  glow: '#0284C7',

  skeleton: '#1E293B',
  shadow: 'rgba(2,132,199,0.4)',
};

export const midnightGradients: Gradients = {
  brand: ['#0284C7', '#6366F1'],
  cool: ['#0369A1', '#38BDF8'],
  warm: ['#6366F1', '#F43F5E'],
  success: ['#38BDF8', '#34D399'],
  backdrop: ['#0F172A', '#070B14'],
  sheen: ['rgba(56,189,248,0.15)', 'rgba(0,0,0,0)'],
};

// 3. Cyberpunk Theme (Neon Yellow & Pink)
export const cyberpunkColors: ColorPalette = {
  background: '#08080A',
  surface: '#121216',
  surfaceAlt: '#1B1B22',
  surfaceElevated: '#272730',
  overlay: 'rgba(0,0,0,0.85)',
  border: 'rgba(250,204,21,0.22)',
  borderStrong: 'rgba(250,204,21,0.45)',

  glass: 'rgba(18,18,22,0.75)',
  glassBorder: 'rgba(250,204,21,0.3)',

  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  textInverse: '#000000',

  primary: '#FACC15',
  primaryMuted: 'rgba(250,204,21,0.22)',
  onPrimary: '#000000',
  accent: '#FF2E93',
  accentAlt: '#22C55E',
  xp: '#FACC15',
  coins: '#FACC15',
  streak: '#FF2E93',
  success: '#22C55E',
  warning: '#FACC15',
  error: '#EF4444',

  glow: '#FACC15',

  skeleton: '#1B1B22',
  shadow: 'rgba(250,204,21,0.35)',
};

export const cyberpunkGradients: Gradients = {
  brand: ['#FACC15', '#FF2E93'],
  cool: ['#FF2E93', '#06B6D4'],
  warm: ['#FACC15', '#EF4444'],
  success: ['#06B6D4', '#22C55E'],
  backdrop: ['#121216', '#08080A'],
  sheen: ['rgba(250,204,21,0.2)', 'rgba(0,0,0,0)'],
};

// 4. Emerald Theme (Matrix Forest)
export const emeraldColors: ColorPalette = {
  background: '#030C08',
  surface: '#081710',
  surfaceAlt: '#0F261B',
  surfaceElevated: '#173627',
  overlay: 'rgba(3,12,8,0.8)',
  border: 'rgba(52,211,153,0.18)',
  borderStrong: 'rgba(52,211,153,0.35)',

  glass: 'rgba(8,23,16,0.7)',
  glassBorder: 'rgba(52,211,153,0.25)',

  text: '#ECFDF5',
  textSecondary: '#6EE7B7',
  textTertiary: '#34D399',
  textInverse: '#040D0A',

  primary: '#10B981',
  primaryMuted: 'rgba(16,185,129,0.2)',
  onPrimary: '#FFFFFF',
  accent: '#34D399',
  accentAlt: '#059669',
  xp: '#34D399',
  coins: palette.amber400,
  streak: palette.amber400,
  success: '#10B981',
  warning: palette.amber400,
  error: palette.rose500,

  glow: '#10B981',

  skeleton: '#0F261B',
  shadow: 'rgba(16,185,129,0.4)',
};

export const emeraldGradients: Gradients = {
  brand: ['#059669', '#34D399'],
  cool: ['#047857', '#2DD4BF'],
  warm: ['#10B981', '#F59E0B'],
  success: ['#2DD4BF', '#10B981'],
  backdrop: ['#081710', '#030C08'],
  sheen: ['rgba(52,211,153,0.18)', 'rgba(0,0,0,0)'],
};

// 5. Sunset Theme (Synthwave Glow)
export const sunsetColors: ColorPalette = {
  background: '#120A1A',
  surface: '#1C1028',
  surfaceAlt: '#271738',
  surfaceElevated: '#35204A',
  overlay: 'rgba(18,10,26,0.8)',
  border: 'rgba(236,72,153,0.2)',
  borderStrong: 'rgba(236,72,153,0.4)',

  glass: 'rgba(28,16,40,0.7)',
  glassBorder: 'rgba(236,72,153,0.25)',

  text: '#FDF4FF',
  textSecondary: '#F472B6',
  textTertiary: '#C084FC',
  textInverse: '#120A1A',

  primary: '#EC4899',
  primaryMuted: 'rgba(236,72,153,0.22)',
  onPrimary: '#FFFFFF',
  accent: '#F59E0B',
  accentAlt: '#8B5CF6',
  xp: '#EC4899',
  coins: '#F59E0B',
  streak: '#F59E0B',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  glow: '#EC4899',

  skeleton: '#271738',
  shadow: 'rgba(236,72,153,0.4)',
};

export const sunsetGradients: Gradients = {
  brand: ['#EC4899', '#F59E0B'],
  cool: ['#8B5CF6', '#EC4899'],
  warm: ['#EC4899', '#EF4444'],
  success: ['#F59E0B', '#10B981'],
  backdrop: ['#1C1028', '#120A1A'],
  sheen: ['rgba(236,72,153,0.2)', 'rgba(0,0,0,0)'],
};

// 6. Light Theme (Solar Clean)
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

export const lightGradients: Gradients = {
  brand: [palette.violet500, palette.magenta500],
  cool: [palette.violet500, palette.cyan500],
  warm: [palette.magenta500, palette.amber500],
  success: [palette.cyan500, palette.green500],
  backdrop: [palette.violet50, palette.gray50],
  sheen: ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0)'],
};

export { palette };
