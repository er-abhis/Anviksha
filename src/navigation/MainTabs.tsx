import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { MainTabParamList } from './types';
import { useTheme } from '../theme/ThemeProvider';
import { HomeScreen } from '../modules/home/screens/HomeScreen';
import { PlaygroundScreen } from '../modules/playground/screens/PlaygroundScreen';
import { AchievementsScreen } from '../modules/achievements/screens/AchievementsScreen';
import { ProfileScreen } from '../modules/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { on: string; off: string }> = {
  Home: { on: 'home', off: 'home-outline' },
  Playground: { on: 'flask', off: 'flask-outline' },
  Achievements: { on: 'trophy', off: 'trophy-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

export const MainTabs: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
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
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
