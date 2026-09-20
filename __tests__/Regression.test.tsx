/**
 * Phase 14 regression: every key screen must render without throwing, including
 * param routes (Lesson/Quiz/WorldDetail) and the tab screens that read the tab
 * bar height. Catches runtime crashes across everything the upgrade touched.
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { LESSONS, WORLDS } from '../src/content';

import { LessonScreen } from '../src/modules/learn/screens/LessonScreen';
import { LessonIntroScreen } from '../src/modules/learn/screens/LessonIntroScreen';
import { QuizScreen } from '../src/modules/quiz/screens/QuizScreen';
import { SimulationsScreen } from '../src/modules/simulations/screens/SimulationsScreen';
import { WorldDetailScreen } from '../src/modules/worlds/screens/WorldDetailScreen';
import { WorldsScreen } from '../src/modules/worlds/screens/WorldsScreen';
import { DailyChallengeScreen } from '../src/modules/dailyChallenge/screens/DailyChallengeScreen';
import { GlossaryScreen } from '../src/modules/glossary/screens/GlossaryScreen';
import { LearnMoreScreen } from '../src/modules/resources/screens/LearnMoreScreen';
import { SettingsScreen } from '../src/modules/settings/screens/SettingsScreen';
import { PlaygroundScreen } from '../src/modules/playground/screens/PlaygroundScreen';
import { AchievementsScreen } from '../src/modules/achievements/screens/AchievementsScreen';
import { ProfileScreen } from '../src/modules/profile/screens/ProfileScreen';
import { AILabScreen } from '../src/modules/ailab/screens/AILabScreen';
import { AILabMissionScreen } from '../src/modules/ailab/screens/AILabMissionScreen';
import { AILabChallengeScreen } from '../src/modules/ailab/screens/AILabChallengeScreen';
import { AILabFreeBuildScreen } from '../src/modules/ailab/screens/AILabFreeBuildScreen';
import { AILabShowcaseScreen } from '../src/modules/ailab/screens/AILabShowcaseScreen';

const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 24 },
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const renderStack = async (name: string, Comp: React.ComponentType<any>, params?: object) => {
  await ReactTestRenderer.act(() => {
    const instance = ReactTestRenderer.create(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <ThemeProvider>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={name} component={Comp} initialParams={params} />
              </Stack.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>,
    );
    instance.unmount();
  });
};

const renderTab = async (name: string, Comp: React.ComponentType<any>) => {
  await ReactTestRenderer.act(() => {
    const instance = ReactTestRenderer.create(
      <GestureHandlerRootView>
        <SafeAreaProvider initialMetrics={METRICS}>
          <ThemeProvider>
            <NavigationContainer>
              <Tab.Navigator screenOptions={{ headerShown: false }}>
                <Tab.Screen name={name} component={Comp} />
              </Tab.Navigator>
            </NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>,
    );
    instance.unmount();
  });
};

const lessonId = LESSONS[0].id;
const worldId = WORLDS[0].id;

describe('screen regression', () => {
  it('renders Lesson', () => renderStack('Lesson', LessonScreen, { lessonId }));
  it('renders LessonIntro', () => renderStack('LessonIntro', LessonIntroScreen, { lessonId }));
  it('renders Quiz', () => renderStack('Quiz', QuizScreen, { lessonId }));
  it('renders Simulations', () => renderStack('Simulations', SimulationsScreen, { lessonId }));
  it('renders WorldDetail', () => renderStack('WorldDetail', WorldDetailScreen, { worldId }));
  it('renders Worlds', () => renderStack('Worlds', WorldsScreen));
  it('renders DailyChallenge', () => renderStack('DailyChallenge', DailyChallengeScreen));
  it('renders Glossary', () => renderStack('Glossary', GlossaryScreen));
  it('renders LearnMore', () => renderStack('LearnMore', LearnMoreScreen));
  it('renders Settings', () => renderStack('Settings', SettingsScreen));
  it('renders Playground (tab)', () => renderTab('Playground', PlaygroundScreen));
  it('renders Achievements (tab)', () => renderTab('Achievements', AchievementsScreen));
  it('renders Profile (tab)', () => renderTab('Profile', ProfileScreen));

  // AI Lab — full flow renders without throwing.
  it('renders AI Lab (tab)', () => renderTab('AILab', AILabScreen));
  it('renders AILabMission', () =>
    renderStack('AILabMission', AILabMissionScreen, { missionId: 'chatbot' }));
  it('renders AILabChallenge', () =>
    renderStack('AILabChallenge', AILabChallengeScreen, {
      missionId: 'chatbot',
      seed: 1,
    }));
  it('renders AILabFreeBuild (picker)', () =>
    renderStack('AILabFreeBuild', AILabFreeBuildScreen));
  it('renders AILabShowcase', () =>
    renderStack('AILabShowcase', AILabShowcaseScreen, {
      title: 'a Chatbot',
      emoji: '🤖',
      components: ['brain'],
      score: 100,
      xpEarned: 100,
      challengesDone: 0,
      challengesTotal: 2,
      concept: 'The AI Brain',
    }));
});
