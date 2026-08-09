/**
 * Color primitives + semantic palettes.
 * Primitives are raw values; semantic palettes (light/dark) map them to roles.
 * Components should ONLY consume semantic colors via `useTheme()`, never primitives.
 */

const palette = {
  // Brand — deep indigo/violet, premium and calm (Linear/Brilliant feel)
  indigo50: '#EEF0FF',
  indigo100: '#DCE0FF',
  indigo400: '#6C77F5',
  indigo500: '#4B58F0',
  indigo600: '#3A46D9',
  indigo700: '#2C36B0',

  // Accent — teal for XP / success / energy
  teal400: '#2DD4BF',
  teal500: '#14B8A6',

  // Signal
  amber500: '#F59E0B', // coins / streak
  rose500: '#F43F5E', // error / destructive
  green500: '#22C55E', // success

  // Neutrals (warm-cool balanced grays)
  white: '#FFFFFF',
  black: '#000000',
  gray0: '#FFFFFF',
  gray50: '#F7F8FA',
  gray100: '#EEF0F4',
  gray200: '#E1E4EB',
  gray300: '#CBD0DA',
  gray400: '#9AA1AF',
  gray500: '#6B7280',
  gray600: '#4B515C',
  gray700: '#343841',
  gray800: '#23262D',
  gray850: '#1A1C22',
  gray900: '#121317',
  gray950: '#0B0C0F',
} as const;

export type ColorPalette = {
  // surfaces
  background: string;
  surface: string;
  surfaceAlt: string;
  surfaceElevated: string;
  overlay: string;
  border: string;
  borderStrong: string;

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
  xp: string;
  coins: string;
  streak: string;
  success: string;
  error: string;

  // misc
  skeleton: string;
  shadow: string;
};

export const lightColors: ColorPalette = {
  background: palette.gray50,
  surface: palette.white,
  surfaceAlt: palette.gray100,
  surfaceElevated: palette.white,
  overlay: 'rgba(11,12,15,0.45)',
  border: palette.gray200,
  borderStrong: palette.gray300,

  text: palette.gray900,
  textSecondary: palette.gray600,
  textTertiary: palette.gray400,
  textInverse: palette.white,

  primary: palette.indigo500,
  primaryMuted: palette.indigo50,
  onPrimary: palette.white,
  accent: palette.teal500,
  xp: palette.teal500,
  coins: palette.amber500,
  streak: palette.amber500,
  success: palette.green500,
  error: palette.rose500,

  skeleton: palette.gray200,
  shadow: palette.black,
};

export const darkColors: ColorPalette = {
  background: palette.gray950,
  surface: palette.gray900,
  surfaceAlt: palette.gray850,
  surfaceElevated: palette.gray800,
  overlay: 'rgba(0,0,0,0.6)',
  border: palette.gray800,
  borderStrong: palette.gray700,

  text: palette.gray50,
  textSecondary: palette.gray400,
  textTertiary: palette.gray500,
  textInverse: palette.gray900,

  primary: palette.indigo400,
  primaryMuted: 'rgba(76,88,240,0.16)',
  onPrimary: palette.white,
  accent: palette.teal400,
  xp: palette.teal400,
  coins: palette.amber500,
  streak: palette.amber500,
  success: palette.green500,
  error: palette.rose500,

  skeleton: palette.gray800,
  shadow: palette.black,
};

export { palette };
