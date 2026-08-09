import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../constants/layout';

export type Orientation = 'portrait' | 'landscape';

export interface Responsive {
  width: number;
  height: number;
  isTablet: boolean;
  isLargeTablet: boolean;
  orientation: Orientation;
  /** Column count hint for grids (1 phone, 2 tablet, 3 large tablet). */
  columns: number;
}

/** Reactive responsive info — re-renders on rotation / split-screen resize. */
export const useResponsive = (): Responsive => {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= BREAKPOINTS.tablet;
  const isLargeTablet = shortSide >= BREAKPOINTS.largeTablet;

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    orientation: width > height ? 'landscape' : 'portrait',
    columns: isLargeTablet ? 3 : isTablet ? 2 : 1,
  };
};
