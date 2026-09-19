import {
  ColorPalette,
  darkColors,
  lightColors,
  midnightColors,
  cyberpunkColors,
  emeraldColors,
  sunsetColors,
  darkGradients,
  lightGradients,
  midnightGradients,
  cyberpunkGradients,
  emeraldGradients,
  sunsetGradients,
  Gradients,
} from './colors';
import { createElevation, Elevation } from './elevation';
import { radius, Radius } from './radius';
import { spacing, Spacing } from './spacing';
import { typography } from './typography';
import { duration, easing } from './animations';

export type ThemeMode = 'dark' | 'midnight' | 'cyberpunk' | 'emerald' | 'sunset' | 'light';

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

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  gradients: darkGradients,
  elevation: createElevation(darkColors.shadow, darkColors.glow),
  ...base,
};

export const midnightTheme: Theme = {
  mode: 'midnight',
  colors: midnightColors,
  gradients: midnightGradients,
  elevation: createElevation(midnightColors.shadow, midnightColors.glow),
  ...base,
};

export const cyberpunkTheme: Theme = {
  mode: 'cyberpunk',
  colors: cyberpunkColors,
  gradients: cyberpunkGradients,
  elevation: createElevation(cyberpunkColors.shadow, cyberpunkColors.glow),
  ...base,
};

export const emeraldTheme: Theme = {
  mode: 'emerald',
  colors: emeraldColors,
  gradients: emeraldGradients,
  elevation: createElevation(emeraldColors.shadow, emeraldColors.glow),
  ...base,
};

export const sunsetTheme: Theme = {
  mode: 'sunset',
  colors: sunsetColors,
  gradients: sunsetGradients,
  elevation: createElevation(sunsetColors.shadow, sunsetColors.glow),
  ...base,
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  gradients: lightGradients,
  elevation: createElevation(lightColors.shadow, lightColors.glow),
  ...base,
};

export const themes: Record<ThemeMode, Theme> = {
  dark: darkTheme,
  midnight: midnightTheme,
  cyberpunk: cyberpunkTheme,
  emerald: emeraldTheme,
  sunset: sunsetTheme,
  light: lightTheme,
};

export * from './colors';
export * from './spacing';
export * from './radius';
export * from './typography';
export * from './elevation';
export * from './animations';
