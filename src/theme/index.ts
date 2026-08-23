import {
  ColorPalette,
  darkColors,
  lightColors,
  darkGradients,
  lightGradients,
  Gradients,
} from './colors';
import { createElevation, Elevation } from './elevation';
import { radius, Radius } from './radius';
import { spacing, Spacing } from './spacing';
import { typography } from './typography';
import { duration, easing } from './animations';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
  gradients: Gradients;
  spacing: Spacing;
  radius: Radius;
  typography: typeof typography;
  elevation: Elevation;
  duration: typeof duration;
  easing: typeof easing;
}

const base = {
  spacing,
  radius,
  typography,
  duration,
  easing,
} as const;

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  gradients: lightGradients,
  elevation: createElevation(lightColors.shadow, lightColors.glow),
  ...base,
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  gradients: darkGradients,
  elevation: createElevation(darkColors.shadow, darkColors.glow),
  ...base,
};

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export * from './colors';
export * from './spacing';
export * from './radius';
export * from './typography';
export * from './elevation';
export * from './animations';
