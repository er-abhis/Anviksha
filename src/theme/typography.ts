import { Platform, TextStyle } from 'react-native';

/**
 * Type scale. Uses the platform system font (SF Pro on iOS, Roboto on Android)
 * for a native, premium feel. Swap `fontFamily` here to adopt a custom font later.
 */
const fontFamily = Platform.select({
  ios: undefined, // San Francisco
  default: undefined, // Roboto
});

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  display: 38,
} as const;

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyStrong'
  | 'label'
  | 'caption'
  | 'button';

export const typography: Record<Variant, TextStyle> = {
  display: {
    fontFamily,
    fontSize: fontSize.display,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  h1: {
    fontFamily,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  h2: {
    fontFamily,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h3: {
    fontFamily,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  body: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: 22,
  },
  bodyStrong: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: 22,
  },
  label: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: 18,
  },
  caption: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  button: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.1,
  },
};

export type TypographyVariant = Variant;
