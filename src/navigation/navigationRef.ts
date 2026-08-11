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
      // Every chapter opens at its introduction, then the learner starts it.
      if (target.lessonId) {
        navigationRef.navigate('LessonIntro', { lessonId: target.lessonId });
      }
      break;
    case 'Home':
    default:
      navigationRef.navigate('Main', { screen: 'Home' });
      break;
  }
};
