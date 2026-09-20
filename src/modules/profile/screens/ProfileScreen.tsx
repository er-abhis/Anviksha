import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated from 'react-native-reanimated';
import {
  GlassCard,
  Gradient,
  Header,
  IconButton,
  Screen,
  ShareCardModal,
  Text,
  XPBadge,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useProgressStore } from '../../../store';
import { BADGES, LESSONS, WORLDS, isWorldUnlocked } from '../../../content';
import { useTranslation } from '../../../i18n/useTranslation';

export const ProfileScreen: React.FC = () => {
  const { colors, radius, spacing, gradients, elevation } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [shareOpen, setShareOpen] = React.useState(false);

  const { xp, coins, level, streakDays, completed } = useProgressStore();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const fresh = xp === 0 && coins === 0;

  const lessonsDone = Object.keys(completed).length;
  const worldsUnlocked = WORLDS.filter(w => isWorldUnlocked(w, completed)).length;
  const badgesEarned = BADGES.filter(b => unlocked[b.slug]).length;

  const stats = [
    { icon: 'book', label: t('learn'), value: `${lessonsDone}/${LESSONS.length}`, color: colors.primary },
    { icon: 'planet', label: 'Worlds', value: `${worldsUnlocked}/${WORLDS.length}`, color: colors.accent },
    { icon: 'trophy', label: t('achievements'), value: `${badgesEarned}/${BADGES.length}`, color: colors.coins },
  ];

  const menu: { icon: string; label: string; color: string; onPress: () => void }[] = [
    { icon: 'share-social-outline', label: `${t('share_app')} 🏆`, color: colors.success, onPress: () => setShareOpen(true) },
    { icon: 'map-outline', label: 'My Worlds', color: colors.accent, onPress: () => navigation.navigate('Worlds') },
    { icon: 'book-outline', label: 'AI Glossary', color: colors.coins, onPress: () => navigation.navigate('Glossary') },
    { icon: 'library-outline', label: t('learn_more'), color: colors.primary, onPress: () => navigation.navigate('LearnMore') },
    { icon: 'cafe-outline', label: `☕ ${t('support_dev')}`, color: colors.accentAlt, onPress: () => navigation.navigate('Coffee') },
    { icon: 'settings-outline', label: t('settings'), color: '#9B85FF', onPress: () => navigation.navigate('Settings') },
  ];

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl, paddingBottom: tabBarHeight + spacing.lg }}>
      <Header
        title={t('profile')}
        large
        right={
          <IconButton
            name="settings-outline"
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        }
      />

      {/* Gradient hero */}
      <Animated.View>
        <Gradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          borderRadius={radius.xl}
          style={[styles.hero, { padding: spacing.xl, ...elevation.glow }]}
        >
          <View style={[styles.identity, { gap: spacing.md }]}>
            <Animated.View
              style={[
                styles.avatar,
                { borderColor: 'rgba(255,255,255,0.35)' },
              ]}
            >
              <Icon name="person" size={34} color={colors.onPrimary} />
            </Animated.View>
            <View style={styles.flex}>
              <Text variant="h2" color="onPrimary">Explorer</Text>
              <View style={[styles.levelPill, { borderRadius: radius.pill, backgroundColor: 'rgba(0,0,0,0.22)' }]}>
                <Icon name="star" size={13} color={colors.onPrimary} />
                <Text variant="label" color="onPrimary">
                  {`Level ${level} · ${xp.toLocaleString()} XP`}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.badges, { gap: spacing.sm, marginTop: spacing.lg }]}>
            <XPBadge value={xp} kind="xp" />
            <XPBadge value={coins} kind="coins" />
            <XPBadge value={streakDays} kind="streak" />
          </View>
        </Gradient>
      </Animated.View>

      {fresh && (
        <Text variant="body" color="textSecondary" center>
          Complete your first lesson or daily challenge to start earning XP and coins.
        </Text>
      )}

      <Animated.View>
        <GlassCard padded={false} elevation="glow">
          <View style={styles.statsRow}>
            {stats.map((s, i) => (
              <Animated.View
                key={s.label}
                style={[
                  styles.stat,
                  i < stats.length - 1 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.glassBorder },
                ]}
              >
                <View style={[styles.statIcon, { backgroundColor: s.color + '22', borderRadius: radius.md }]}>
                  <Icon name={s.icon} size={18} color={s.color} />
                </View>
                <Text variant="h3">{s.value}</Text>
                <Text variant="caption" color="textSecondary">{s.label}</Text>
              </Animated.View>
            ))}
          </View>
        </GlassCard>
      </Animated.View>

      <Animated.View>
        <GlassCard padded={false} elevation="glow" style={{ paddingHorizontal: spacing.lg }}>
          {menu.map((m, i) => (
            <Pressable
              key={m.label}
              onPress={m.onPress}
              accessibilityRole="button"
              accessibilityLabel={m.label}
              style={({ pressed }) => [
                styles.menuRow,
                { opacity: pressed ? 0.6 : 1 },
                i < menu.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.glassBorder },
              ]}
            >
              <View style={[styles.menuIcon, { backgroundColor: m.color + '20', borderRadius: radius.md }]}>
                <Icon name={m.icon} size={18} color={m.color} />
              </View>
              <Text variant="body" style={styles.flex}>{m.label}</Text>
              <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
            </Pressable>
          ))}
        </GlassCard>
      </Animated.View>

      <ShareCardModal visible={shareOpen} onClose={() => setShareOpen(false)} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: { overflow: 'hidden' },
  identity: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  badges: { flexDirection: 'row' },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 20 },
  statIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuIcon: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
});
