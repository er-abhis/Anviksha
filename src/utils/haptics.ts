/**
 * Tiny haptic feedback helper. Uses the built-in RN Vibration API (no native
 * dependency) and always respects the user's in-app Haptics setting. Every
 * call is a no-op when Haptics is off, so call sites don't need to check.
 */
import { Vibration } from 'react-native';
// Import the leaf store directly (not the store index) to avoid an import cycle
// when stores themselves fire haptics.
import { useSettingsStore } from '../store/settingsStore';

const on = (): boolean => useSettingsStore.getState().haptics;

/** Light tap — selections, button confirmations. */
export const hapticLight = (): void => {
  if (on()) Vibration.vibrate(10);
};

/** Positive result — correct answer, achievement unlocked, streak up. */
export const hapticSuccess = (): void => {
  if (on()) Vibration.vibrate([0, 20, 60, 30]);
};

/** Negative result — wrong answer. */
export const hapticError = (): void => {
  if (on()) Vibration.vibrate([0, 40, 40, 40]);
};
