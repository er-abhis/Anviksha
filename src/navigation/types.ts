import { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tab shell — 3 clear, purposeful tabs that eliminate decision fatigue. */
export type MainTabParamList = {
  /** The guided learning trail — where users progress through their AI journey. */
  Learn: undefined;
  /** Freeform experimentation hub — sims, games, builds, detective cases. */
  Sandbox: undefined;
  /** User stats, achievements, settings, and progress. */
  Profile: undefined;
};

/**
 * Root stack. Splash + Onboarding sit above the tab shell so they can present
 * full-screen without a tab bar. Future "worlds" / detail flows push here.
 */
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Settings: undefined;
  Simulations: { lessonId: string };
  Quiz: { lessonId: string };
  LessonIntro: { lessonId: string };
  Lesson: { lessonId: string };
  DailyChallenge: undefined;
  AILabMission: { missionId: string; projectId?: string };
  AILabChallenge: { missionId: string; seed?: number };
  AILabFreeBuild: { category?: string; projectId?: string } | undefined;
  AILabShowcase: {
    title: string;
    emoji: string;
    components: string[];
    score: number;
    xpEarned: number;
    challengesDone: number;
    challengesTotal: number;
    concept: string;
  };
  Brain: undefined;
  BrainSim: { simId: string };
  AIGames: undefined;
  Detective: { caseId: string };
  BuildAI: undefined;
  WhatToBuild: undefined;
  LearnMore: undefined;
  Worlds: undefined;
  WorldDetail: { worldId: string };
  Glossary: undefined;
  Search: undefined;
  Coffee: undefined;
  About: undefined;
  Developer: undefined;
  Privacy: undefined;
};

declare global {
  // Makes navigation.navigate / useNavigation fully typed app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
