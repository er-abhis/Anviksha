import React, { useMemo } from 'react';
import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  NavigationContainer,
  Theme as NavTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useTheme, useThemeMode } from '../theme/ThemeProvider';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../modules/splash/screens/SplashScreen';
import { OnboardingScreen } from '../modules/onboarding/screens/OnboardingScreen';
import { SettingsScreen } from '../modules/settings/screens/SettingsScreen';
import { SimulationsScreen } from '../modules/simulations/screens/SimulationsScreen';
import { QuizScreen } from '../modules/quiz/screens/QuizScreen';
import { DailyChallengeScreen } from '../modules/dailyChallenge/screens/DailyChallengeScreen';
import { WorldsScreen } from '../modules/worlds/screens/WorldsScreen';
import { WorldDetailScreen } from '../modules/worlds/screens/WorldDetailScreen';
import { LessonScreen } from '../modules/learn/screens/LessonScreen';
import { GlossaryScreen } from '../modules/glossary/screens/GlossaryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const theme = useTheme();
  const mode = useThemeMode();

  const navTheme: NavTheme = useMemo(() => {
    const base = mode === 'dark' ? NavDark : NavLight;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
        notification: theme.colors.error,
      },
    };
  }, [mode, theme]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen name="Simulations" component={SimulationsScreen} />
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Quiz"
          component={QuizScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Glossary"
          component={GlossaryScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="DailyChallenge"
          component={DailyChallengeScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Worlds"
          component={WorldsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="WorldDetail"
          component={WorldDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
