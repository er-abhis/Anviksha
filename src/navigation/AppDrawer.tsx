import React, { useEffect } from 'react';
import {
  BackHandler,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Logo, Text } from '../components';
import { useTheme } from '../theme/ThemeProvider';
import { APP } from '../constants/app';
import { useDrawerStore } from '../store';
import { navigationRef } from './navigationRef';
import { openContactForm, rateApp, shareApp } from '../utils/appLinks';

const { width } = Dimensions.get('window');
const PANEL_W = Math.min(320, width * 0.84);

interface Item {
  key: string;
  icon: string;
  label: string;
  /** Root route this item maps to (for active highlighting), if any. */
  route?: string;
  run: () => void;
}

/**
 * Left navigation drawer — a self-contained overlay (no drawer-navigator
 * dependency). Always mounted above the app; slides in when `drawerStore.open`
 * is true. Navigates via the shared navigationRef so it works from anywhere.
 */
export const AppDrawer: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const open = useDrawerStore(s => s.open);
  const hide = useDrawerStore(s => s.hide);

  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(open ? 1 : 0, { duration: 260 });
  }, [open, p]);

  // Android back closes the drawer before the app can exit.
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      hide();
      return true;
    });
    return () => sub.remove();
  }, [open, hide]);

  const go = (route: 'Coffee' | 'About' | 'Developer') => {
    hide();
    if (navigationRef.isReady()) navigationRef.navigate(route);
  };

  const current = navigationRef.isReady()
    ? navigationRef.getCurrentRoute()?.name
    : undefined;

  const items: Item[] = [
    { key: 'Home', icon: 'home-outline', label: 'Home', route: 'Main', run: () => { hide(); navigationRef.isReady() && navigationRef.navigate('Main', { screen: 'Home' }); } },
    { key: 'Coffee', icon: 'cafe-outline', label: 'Buy Me a Coffee', route: 'Coffee', run: () => go('Coffee') },
    { key: 'About', icon: 'document-text-outline', label: 'About App', route: 'About', run: () => go('About') },
    { key: 'Developer', icon: 'code-slash-outline', label: 'About Developer', route: 'Developer', run: () => go('Developer') },
    { key: 'Contact', icon: 'mail-outline', label: 'Contact Us', run: () => { hide(); openContactForm(); } },
    { key: 'Rate', icon: 'star-outline', label: 'Rate App', run: () => { hide(); rateApp(); } },
    { key: 'Share', icon: 'share-social-outline', label: 'Share App', run: () => { hide(); shareApp(); } },
  ];

  // Home is "active" on the tab shell (route name 'Main') too.
  const isActive = (item: Item) =>
    !!item.route && (current === item.route || (item.route === 'Main' && current === 'Home'));

  const scrimStyle = useAnimatedStyle(() => ({ opacity: p.value * 0.55 }));
  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(p.value, [0, 1], [-PANEL_W, 0]) }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={hide} accessibilityLabel="Close menu" />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { width: PANEL_W, backgroundColor: colors.surface, borderRightColor: colors.border },
          panelStyle,
        ]}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.flex}>
          {/* Brand header */}
          <View style={[styles.brand, { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, borderBottomColor: colors.border }]}>
            <Logo size={44} />
            <View style={{ marginTop: spacing.sm }}>
              <Text variant="h3">{APP.name}</Text>
              <Text variant="label" color="textSecondary">Learn AI Visually</Text>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: spacing.md, gap: 4 }}>
            {items.map(item => {
              const active = isActive(item);
              return (
                <Pressable
                  key={item.key}
                  onPress={item.run}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.row,
                    { borderRadius: radius.md, paddingHorizontal: spacing.md, gap: spacing.md },
                    active && { backgroundColor: colors.primaryMuted },
                    pressed && !active && { backgroundColor: colors.surfaceAlt },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    color={active ? colors.primary : colors.textSecondary}
                  />
                  <Text variant="body" color={active ? 'primary' : 'text'} style={styles.flex}>
                    {item.label}
                  </Text>
                  {active && <Icon name="ellipse" size={8} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>

          <Text variant="caption" color="textTertiary" center style={{ paddingVertical: spacing.md }}>
            {`${APP.name} v${APP.version}`}
          </Text>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrim: { backgroundColor: '#000000' },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  brand: { borderBottomWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
});
