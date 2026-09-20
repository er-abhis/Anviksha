import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeProvider';
import { easing } from '../theme/animations';
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { PlaygroundScreen } from '../modules/playground/screens/PlaygroundScreen';
import { AIGamesScreen } from '../modules/brain/screens/AIGamesScreen';
import { AILabScreen } from '../modules/ailab/screens/AILabScreen';
import { AchievementsScreen } from '../modules/achievements/screens/AchievementsScreen';
import { ProfileScreen } from '../modules/profile/screens/ProfileScreen';

import { useTranslation } from '../i18n/useTranslation';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { on: string; off: string }> = {
  Home: { on: 'home', off: 'home-outline' },
  Playground: { on: 'flask', off: 'flask-outline' },
  Games: { on: 'game-controller', off: 'game-controller-outline' },
  AILab: { on: 'hardware-chip', off: 'hardware-chip-outline' },
  Achievements: { on: 'trophy', off: 'trophy-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

/** Animated tab icon: springs up + shows a glowing pill when focused. */
const TabIcon: React.FC<{
  route: keyof MainTabParamList;
  focused: boolean;
  color: string;
}> = ({ route, focused, color }) => {
  const { colors } = useTheme();
  const f = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    f.value = focused
      ? withSpring(1, easing.springBouncy)
      : withTiming(0, { duration: 160 });
  }, [focused, f]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -f.value * 3 }, { scale: 1 + f.value * 0.12 }],
  }));
  const pillStyle = useAnimatedStyle(() => ({
    opacity: f.value,
    transform: [{ scale: 0.7 + f.value * 0.3 }],
  }));

  const set = ICONS[route];
  return (
    <View style={styles.iconWrap}>
      <Animated.View
        style={[styles.pill, { backgroundColor: colors.primaryMuted }, pillStyle]}
      />
      <Animated.View style={iconStyle}>
        <Icon name={focused ? set.on : set.off} size={22} color={color} />
      </Animated.View>
    </View>
  );
};

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => (
          <TabIcon route={route.name} focused={focused} color={color} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="Playground"
        component={PlaygroundScreen}
        options={{ tabBarLabel: t('playground') }}
      />
      <Tab.Screen
        name="Games"
        component={AIGamesScreen}
        options={{ tabBarLabel: t('games') }}
      />
      <Tab.Screen
        name="AILab"
        component={AILabScreen}
        options={{ tabBarLabel: t('ai_lab') }}
      />
      <Tab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ tabBarLabel: t('achievements') }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: t('profile') }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: { position: 'absolute', width: 48, height: 32, borderRadius: 16 },
});
