import { Platform, ViewStyle } from 'react-native';

/**
 * Cross-platform elevation. Returns shadow props for iOS and elevation for Android.
 * Shadow color is passed in so it can adapt per theme.
 */
type ElevationLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export const createElevation = (
  shadowColor: string,
): Record<ElevationLevel, ViewStyle> => {
  const make = (
    elevation: number,
    opacity: number,
    radius: number,
    offsetY: number,
  ): ViewStyle =>
    Platform.select({
      ios: {
        shadowColor,
        shadowOpacity: opacity,
        shadowRadius: radius,
        shadowOffset: { width: 0, height: offsetY },
      },
      default: { elevation },
    }) as ViewStyle;

  return {
    none: {},
    sm: make(2, 0.08, 6, 2),
    md: make(6, 0.12, 12, 4),
    lg: make(12, 0.16, 20, 8),
    xl: make(20, 0.22, 32, 14),
  };
};

export type Elevation = ReturnType<typeof createElevation>;
export type { ElevationLevel };
