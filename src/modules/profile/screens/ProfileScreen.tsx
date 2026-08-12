import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  Header,
  IconButton,
  Screen,
  Text,
  XPBadge,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useAchievementsStore, useProgressStore } from '../../../store';
import { BADGES, LESSONS, WORLDS, isWorldUnlocked } from '../../../content';

export const ProfileScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { xp, coins, level, streakDays, completed } = useProgressStore();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const fresh = xp === 0 && coins === 0;

  const lessonsDone = Object.keys(completed).length;
  const worldsUnlocked = WORLDS.filter(w => isWorldUnlocked(w, completed)).length;
  const badgesEarned = BADGES.filter(b => unlocked[b.slug]).length;

  const stats = [
    { icon: 'book', label: 'Lessons', value: `${lessonsDone}/${LESSONS.length}` },
    { icon: 'planet', label: 'Worlds', value: `${worldsUnlocked}/${WORLDS.length}` },
    { icon: 'trophy', label: 'Badges', value: `${badgesEarned}/${BADGES.length}` },
  ];

  const menu: { icon: string; label: string; onPress: () => void }[] = [
    { icon: 'map-outline', label: 'My Worlds', onPress: () => navigation.navigate('Worlds') },
    { icon: 'book-outline', label: 'AI Glossary', onPress: () => navigation.navigate('Glossary') },
    { icon: 'cafe-outline', label: '☕ Buy Me a Coffee', onPress: () => navigation.navigate('Coffee') },
    { icon: 'settings-outline', label: 'Settings', onPress: () => navigation.navigate('Settings') },
  ];

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title="Profile"
        large
        right={
          <IconButton
            name="settings-outline"
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        }
      />

      <Card elevation="sm">
        <View style={[styles.identity, { gap: spacing.md }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
            <Icon name="person" size={30} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text variant="h3">Explorer</Text>
            <Text variant="label" color="textSecondary">
              {`Level ${level} · ${xp.toLocaleString()} XP`}
            </Text>
          </View>
        </View>
      </Card>

      <View style={[styles.badges, { gap: spacing.sm }]}>
        <XPBadge value={xp} kind="xp" />
        <XPBadge value={coins} kind="coins" />
        <XPBadge value={streakDays} kind="streak" />
      </View>

      {fresh && (
        <Text variant="body" color="textSecondary" center>
          Complete your first lesson or daily challenge to start earning XP and coins.
        </Text>
      )}

      <Card elevation="sm" padded={false}>
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View
              key={s.label}
              style={[
                styles.stat,
                i < stats.length - 1 && { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
              ]}
            >
              <Icon name={s.icon} size={18} color={colors.primary} />
              <Text variant="h3">{s.value}</Text>
              <Text variant="caption" color="textSecondary">{s.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <Card elevation="sm" padded={false} style={{ paddingHorizontal: spacing.lg }}>
        {menu.map((m, i) => (
          <Pressable
            key={m.label}
            onPress={m.onPress}
            style={[
              styles.menuRow,
              i < menu.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            ]}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
              <Icon name={m.icon} size={18} color={colors.text} />
            </View>
            <Text variant="body" style={styles.flex}>{m.label}</Text>
            <Icon name="chevron-forward" size={18} color={colors.textTertiary} />
          </Pressable>
        ))}
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  badges: { flexDirection: 'row' },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row' },
  stat: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 18 },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuIcon: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
});
