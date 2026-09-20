import { Platform, ViewStyle } from 'react-native';

/**
 * Cross-platform elevation. Returns shadow props for iOS and elevation for Android.
 * Shadow color is passed in so it can adapt per theme.
 *
 * `glow` is a colored, diffuse neon shadow used for hero/primary surfaces — pass
 * the theme's `glow` color to `createElevation` as the second argument.
 */
type ElevationLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';

export const createElevation = (
  shadowColor: string,
  glowColor: string = shadowColor,
): Record<ElevationLevel, ViewStyle> => {
  const isDarkColor = !glowColor || glowColor === 'transparent' || glowColor.includes('0,0,0') || glowColor === '#000000';
  const accentGlow = isDarkColor ? '#7C5CFF' : glowColor;

  return {
    none: {},
    sm: {},
    md: {},
    lg: {},
    xl: {},
    // Diffuse neon glow — colored bloom only (NO black drop shadow)
    glow: Platform.select({
      ios: {
        shadowColor: accentGlow,
        shadowOpacity: 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 2 },
      },
      default: {
        elevation: 0,
      },
    }) as ViewStyle,
  };
};

export type Elevation = ReturnType<typeof createElevation>;
export type { ElevationLevel };
