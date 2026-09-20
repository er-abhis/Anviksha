import { Platform, Vibration } from 'react-native';

export type HapticType =
  | 'selection'
  | 'success'
  | 'error'
  | 'impactLight'
  | 'impactHeavy';

/**
 * Pure offline tactile haptic feedback trigger using standard React Native Vibration API.
 * Provides distinct vibration pulse patterns tailored for UI interactions.
 */
export const triggerHaptic = (type: HapticType = 'selection') => {
  if (Platform.OS === 'web') return;

  try {
    switch (type) {
      case 'selection':
        Vibration.vibrate(10);
        break;
      case 'impactLight':
        Vibration.vibrate(15);
        break;
      case 'impactHeavy':
        Vibration.vibrate([0, 20, 30, 25]);
        break;
      case 'success':
        Vibration.vibrate([0, 15, 50, 25]);
        break;
      case 'error':
        Vibration.vibrate([0, 30, 40, 30, 40, 30]);
        break;
    }
  } catch (_e) {
    // Ignore devices without vibration motor
  }
};
