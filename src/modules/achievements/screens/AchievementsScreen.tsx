import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';
import { EmptyState, Gradient, GlassCard, Header, IconButton, Screen, ShareAchievementModal, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore } from '../../../store';
import { Badge, BADGES } from '../../../content';
import { useTranslation } from '../../../i18n/useTranslation';

const BADGE_PALETTE: { grad: readonly [string, string]; color: string; bg: string; border: string }[] = [
  { grad: ['#7C5CFF', '#9B85FF'], color: '#9B85FF', bg: 'rgba(124, 92, 255, 0.16)', border: 'rgba(124, 92, 255, 0.55)' },
  { grad: ['#06D6C4', '#38BDF8'], color: '#06D6C4', bg: 'rgba(6, 214, 196, 0.16)', border: 'rgba(6, 214, 196, 0.55)' },
  { grad: ['#FF2E93', '#FF5FA2'], color: '#FF2E93', bg: 'rgba(255, 46, 147, 0.16)', border: 'rgba(255, 46, 147, 0.55)' },
  { grad: ['#F59E0B', '#FACC15'], color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.16)', border: 'rgba(245, 158, 11, 0.55)' },
  { grad: ['#12D18E', '#34D399'], color: '#12D18E', bg: 'rgba(18, 209, 142, 0.16)', border: 'rgba(18, 209, 142, 0.55)' },
  { grad: ['#FF5FA2', '#F59E0B'], color: '#FF5FA2', bg: 'rgba(255, 95, 162, 0.16)', border: 'rgba(255, 95, 162, 0.55)' },
  { grad: ['#3B82F6', '#60A5FA'], color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.16)', border: 'rgba(59, 130, 246, 0.55)' },
  { grad: ['#A855F7', '#C084FC'], color: '#A855F7', bg: 'rgba(168, 85, 247, 0.16)', border: 'rgba(168, 85, 247, 0.55)' },
];

export const AchievementsScreen: React.FC = () => {
  const { colors, radius, spacing, gradients, elevation } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const { t } = useTranslation();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const unlockedCount = BADGES.filter(a => unlocked[a.slug]).length;

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const pct = Math.round((unlockedCount / BADGES.length) * 100);

  const handleShareOverall = () => {
    setSelectedBadge(null);
    setShareModalVisible(true);
  };

  const handleShareBadge = (badge: Badge) => {
    setSelectedBadge(badge);
    setShareModalVisible(true);
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md, paddingBottom: tabBarHeight + spacing.lg }}>
      <Header
        title={t('achievements')}
        large
        right={
          <IconButton
            name="share-social-outline"
            accessibilityLabel="Share Achievements"
            onPress={handleShareOverall}
          />
        }
      />

      {/* Hero Header */}
      <Animated.View>
        <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Gradient colors={gradients.warm} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.lg, gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="trophy" size={18} color="#FFFFFF" />
                <Text variant="label" color="textInverse" style={{ opacity: 0.9, letterSpacing: 1 }}>
                  REWARDS & BADGES
                </Text>
              </View>
              <Pressable
                onPress={handleShareOverall}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}
              >
                <Icon name="share-social" size={12} color="#FFFFFF" />
                <Text variant="caption" color="textInverse" style={{ fontWeight: '700', fontSize: 11 }}>Share 🚀</Text>
              </Pressable>
            </View>
            <Text variant="h2" color="textInverse">
              {`${unlockedCount} of ${BADGES.length} Unlocked (${pct}%)`}
            </Text>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${pct}%`, backgroundColor: '#FFFFFF', borderRadius: 3 }} />
            </View>
          </View>
        </GlassCard>
      </Animated.View>

      {BADGES.map((a, i) => {
        const isUnlocked = Boolean(unlocked[a.slug]);
        const theme = BADGE_PALETTE[i % BADGE_PALETTE.length];

        return (
          <Animated.View key={a.slug}>
            <GlassCard
              padded={false}
              elevation={isUnlocked ? 'glow' : 'sm'}
              onPress={isUnlocked ? () => handleShareBadge(a) : undefined}
              style={[
                {
                  borderRadius: radius.lg,
                  overflow: 'hidden',
                  borderWidth: 1.5,
                  backgroundColor: isUnlocked ? theme.bg : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isUnlocked ? theme.border : theme.color + '33',
                },
              ]}
            >
              <View style={[styles.row, { gap: spacing.md, padding: spacing.lg }]}>
                {isUnlocked ? (
                  <Animated.View>
                    <Gradient
                      colors={theme.grad}
                      borderRadius={radius.md}
                      style={[styles.icon, { ...elevation.glow }]}
                    >
                      <Icon name={a.icon} size={24} color="#FFFFFF" />
                    </Gradient>
                  </Animated.View>
                ) : (
                  <View
                    style={[
                      styles.icon,
                      { backgroundColor: theme.bg, borderRadius: radius.md, borderColor: theme.color + '44', borderWidth: 1 },
                    ]}
                  >
                    <Icon name={a.icon} size={20} color={theme.color + '88'} />
                    <View style={styles.lockBadge}>
                      <Icon name="lock-closed" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                )}
                <View style={styles.flex}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text variant="bodyStrong" style={{ fontSize: 15, color: isUnlocked ? colors.text : colors.textSecondary }}>{a.title}</Text>
                    {isUnlocked && (
                      <View style={{ backgroundColor: theme.color + '25', paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.pill }}>
                        <Text variant="caption" style={{ color: theme.color, fontSize: 9, fontWeight: '700' }}>UNLOCKED</Text>
                      </View>
                    )}
                  </View>
                  <Text variant="caption" color={isUnlocked ? 'textSecondary' : 'textTertiary'} style={{ marginTop: 2 }}>
                    {a.description}
                  </Text>
                </View>
                {isUnlocked ? (
                  <Pressable
                    onPress={() => handleShareBadge(a)}
                    style={{ backgroundColor: theme.color + '22', borderRadius: radius.pill, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  >
                    <Icon name="share-social" size={14} color={theme.color} />
                  </Pressable>
                ) : (
                  <View style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4 }}>
                    <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>Locked</Text>
                  </View>
                )}
              </View>
            </GlassCard>
          </Animated.View>
        );
      })}

      <ShareAchievementModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        badge={selectedBadge}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  icon: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF2E93',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
