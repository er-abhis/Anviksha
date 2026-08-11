import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

/** App-wide navigation ref so non-React code (notifications) can navigate. */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Where a tapped notification should land. Kept tiny + serialisable. */
export interface NotificationTarget {
  screen: 'DailyChallenge' | 'Lesson' | 'Home';
  lessonId?: string;
}

/** Navigate from a notification tap. Safe to call before nav is ready (drops). */
export const navigateFromNotification = (target?: NotificationTarget): void => {
  if (!target || !navigationRef.isReady()) return;
  switch (target.screen) {
    case 'DailyChallenge':
      navigationRef.navigate('DailyChallenge');
      break;
    case 'Lesson':
      if (target.lessonId) {
        navigationRef.navigate('Lesson', { lessonId: target.lessonId });
      }
      break;
    case 'Home':
    default:
      navigationRef.navigate('Main', { screen: 'Home' });
      break;
  }
};
