import { APP_VERSION } from '../generated/appVersion';

/** Non-visual app configuration. Visual tokens live in `src/theme`. */
export const APP = {
  name: 'Anviksha',
  tagline: 'Learn AI by playing with it',
  // Sourced from the native build (versionName) via the generateAppVersion
  // Gradle task, so it always matches the shipped build automatically.
  version: APP_VERSION,
  // TODO: set to the real Play Store package id once the app is published.
  androidPackageId: 'com.abhishek.anviksha',
  // Filled in once the store listing goes live; until then Share/Rate fall back gracefully.
  playStoreUrl: '',
} as const;

/** Message used by the Share sheet. Play Store URL appended when available. */
export const SHARE_MESSAGE =
  "I've been learning Artificial Intelligence in a fun way using Anviksha.\n\n" +
  'Learn AI through simulations, quizzes and interactive lessons.\n\n' +
  'Download Anviksha:';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULTS = {
  language: 'en' as LanguageCode,
  sound: true,
  haptics: true,
  notifications: true,
} as const;
