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
  const make = (
    color: string,
    elevation: number,
    opacity: number,
    radius: number,
    offsetY: number,
  ): ViewStyle =>
    Platform.select({
      ios: {
        shadowColor: color,
        shadowOpacity: opacity,
        shadowRadius: radius,
        shadowOffset: { width: 0, height: offsetY },
      },
      default: { elevation, shadowColor: color },
    }) as ViewStyle;

  return {
    none: {},
    sm: make(shadowColor, 3, 0.1, 8, 3),
    md: make(shadowColor, 8, 0.16, 16, 6),
    lg: make(shadowColor, 16, 0.22, 26, 12),
    xl: make(shadowColor, 24, 0.28, 40, 18),
    // Neon glow — vivid colored bloom for primary CTAs and hero cards.
    glow: make(glowColor, 20, 0.5, 28, 10),
  };
};

export type Elevation = ReturnType<typeof createElevation>;
export type { ElevationLevel };
