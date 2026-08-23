import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeProvider';
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { PlaygroundScreen } from '../modules/playground/screens/PlaygroundScreen';
import { AILabScreen } from '../modules/ailab/screens/AILabScreen';
import { AchievementsScreen } from '../modules/achievements/screens/AchievementsScreen';
import { ProfileScreen } from '../modules/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { on: string; off: string }> = {
  Home: { on: 'home', off: 'home-outline' },
  Playground: { on: 'flask', off: 'flask-outline' },
  AILab: { on: 'hardware-chip', off: 'hardware-chip-outline' },
  Achievements: { on: 'trophy', off: 'trophy-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          // Grow the bar by the real bottom inset so labels never sit under the
          // Android gesture pill / iOS home indicator.
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ focused, color, size }) => {
          const set = ICONS[route.name];
          return (
            <Icon
              name={focused ? set.on : set.off}
              size={size ?? 22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Playground" component={PlaygroundScreen} />
      <Tab.Screen
        name="AILab"
        component={AILabScreen}
        options={{ tabBarLabel: 'AI Lab' }}
      />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
