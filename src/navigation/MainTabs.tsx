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
import { LearnScreen } from '../modules/learn/screens/LearnScreen';
import { SandboxScreen } from '../modules/learn/screens/SandboxScreen';
import { ProfileScreen } from '../modules/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, { on: string; off: string }> = {
  Learn: { on: 'map', off: 'map-outline' },
  Sandbox: { on: 'flask', off: 'flask-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Learn: 'Learn',
  Sandbox: 'Sandbox',
  Profile: 'Profile',
};

/** Animated tab icon: springs up + shows a glowing pill indicator when focused. */
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
      })}>
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ tabBarLabel: TAB_LABELS.Learn }}
      />
      <Tab.Screen
        name="Sandbox"
        component={SandboxScreen}
        options={{ tabBarLabel: TAB_LABELS.Sandbox }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: TAB_LABELS.Profile }}
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
