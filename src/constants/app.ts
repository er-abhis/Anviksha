/** Non-visual app configuration. Visual tokens live in `src/theme`. */
export const APP = {
  name: 'Anviksha',
  tagline: 'Learn AI by playing with it',
  version: '0.0.1',
  // TODO: set to the real Play Store package id once the app is published.
  androidPackageId: 'com.anviksha',
  // Filled in once the store listing goes live; until then Share/Rate fall back gracefully.
  playStoreUrl: '',
} as const;

/** Message used by the Share sheet. Play Store URL appended when available. */
export const SHARE_MESSAGE =
  "I've been learning Artificial Intelligence in a fun way using Anviksha.\n\n" +
  'Learn AI through simulations, quizzes and interactive lessons.\n\n' +
  'Download Anviksha:';

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
