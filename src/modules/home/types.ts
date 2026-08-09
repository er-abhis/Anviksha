/** View-model shapes for Home cards. Real values come from the stores. */

export interface ContinueItem {
  id: string;
  title: string;
  worldTitle: string;
  progress: number; // 0..1
}

export interface DailyChallengeMock {
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
}

export interface CurrentWorldMock {
  title: string;
  subtitle: string;
  progress: number;
  gradient: [string, string];
  locked: boolean;
}

export interface AchievementMock {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

export interface ActivityMock {
  id: string;
  label: string;
  detail: string;
  icon: string;
}
