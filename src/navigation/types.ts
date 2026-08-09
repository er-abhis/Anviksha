import { NavigatorScreenParams } from '@react-navigation/native';

/** Bottom tab shell — the persistent home of the app. */
export type MainTabParamList = {
  Home: undefined;
  Playground: undefined;
  Achievements: undefined;
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
  Simulations: { worldId?: string } | undefined;
  Quiz: { simulationId?: string } | undefined;
  DailyChallenge: undefined;
  Worlds: undefined;
  WorldDetail: { worldId: string };
  ComingSoon: { title: string; message?: string } | undefined;
};

declare global {
  // Makes navigation.navigate / useNavigation fully typed app-wide.
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
