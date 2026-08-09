import { Dimensions, PixelRatio } from 'react-native';
import { BREAKPOINTS, GUIDELINE_BASE } from '../constants/layout';

/**
 * Pure, non-reactive responsive helpers. For layout that must react to
 * orientation/dimension changes, use the `useResponsive` hook instead.
 */
const { width, height } = Dimensions.get('window');
const shortSide = Math.min(width, height);

/** Linear scale against the guideline width. */
export const scale = (size: number) => (shortSide / GUIDELINE_BASE.width) * size;

/** Moderated scale — dampens the effect so text/spacing don't blow up on tablets. */
export const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

/** Font scaling, rounded to the nearest pixel for crisp rendering. */
export const scaleFont = (size: number) =>
  Math.round(PixelRatio.roundToNearestPixel(moderateScale(size)));

export const isTablet = shortSide >= BREAKPOINTS.tablet;
