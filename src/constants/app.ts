/** Non-visual app configuration. Visual tokens live in `src/theme`. */
export const APP = {
  name: 'Anviksha',
  tagline: 'Learn AI by playing with it',
  version: '0.0.1',
} as const;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULTS = {
  language: 'en' as LanguageCode,
  sound: true,
  haptics: true,
  notifications: true,
} as const;
