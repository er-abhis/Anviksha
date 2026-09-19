import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '../constants/layout';

export type Orientation = 'portrait' | 'landscape';

export interface Responsive {
  width: number;
  height: number;
  isTablet: boolean;
  isLargeTablet: boolean;
  orientation: Orientation;
  /** Column count hint for grids (2 phone, 3 tablet, 4 large tablet). */
  columns: number;
  /** Calculate item flex width percentage for grid containers taking gap into account. */
  gridColumns: number;
  cellWidthPercent: string;
}

/** Reactive responsive info — re-renders on rotation / split-screen resize. */
export const useResponsive = (): Responsive => {
  const { width, height } = useWindowDimensions();
  const shortSide = Math.min(width, height);
  const isTablet = shortSide >= BREAKPOINTS.tablet;
  const isLargeTablet = shortSide >= BREAKPOINTS.largeTablet;
  const gridColumns = isLargeTablet ? 4 : isTablet ? 3 : 2;

  // Exact percentage string subtracting gaps so items fit cleanly without dropping
  const cellWidthPercent = gridColumns === 4 ? '23.5%' : gridColumns === 3 ? '31.5%' : '48%';

  return {
    width,
    height,
    isTablet,
    isLargeTablet,
    orientation: width > height ? 'landscape' : 'portrait',
    columns: isLargeTablet ? 3 : isTablet ? 2 : 1,
    gridColumns,
    cellWidthPercent,
  };
};

