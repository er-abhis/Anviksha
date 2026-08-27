import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Animated from 'react-native-reanimated';
import { EmptyState, Gradient, GlassCard, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore } from '../../../store';
import { BADGES } from '../../../content';

export const AchievementsScreen: React.FC = () => {
  const { colors, radius, spacing, gradients, elevation } = useTheme();
  const tabBarHeight = useBottomTabBarHeight();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const unlockedCount = BADGES.filter(a => unlocked[a.slug]).length;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md, paddingBottom: tabBarHeight + spacing.lg }}>
      <Header title="Achievements" large />

      {unlockedCount === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="Your achievements will appear here"
          message="Earn badges by completing challenges, finishing lessons, and keeping streaks. Complete your first challenge to unlock one."
        />
      ) : (
        <Animated.View>
          <Text variant="label" color="textSecondary">
            {`${unlockedCount} of ${BADGES.length} unlocked`}
          </Text>
        </Animated.View>
      )}

      {BADGES.map((a, i) => {
        const isUnlocked = Boolean(unlocked[a.slug]);
        return (
          <Animated.View
            key={a.slug}
          >
            <GlassCard
              padded={false}
              style={[
                { borderRadius: radius.lg, overflow: 'hidden' },
                isUnlocked
                  ? { borderColor: colors.accent, ...elevation.glow }
                  : { opacity: 0.6 },
              ]}
            >
              <View style={[styles.row, { gap: spacing.md, padding: spacing.lg }]}>
                {isUnlocked ? (
                  <Animated.View>
                    <Gradient
                      colors={gradients.brand}
                      borderRadius={radius.md}
                      style={[styles.icon, { ...elevation.glow }]}
                    >
                      <Icon name={a.icon} size={24} color={colors.onPrimary} />
                    </Gradient>
                  </Animated.View>
                ) : (
                  <View
                    style={[
                      styles.icon,
                      { backgroundColor: colors.surfaceAlt, borderRadius: radius.md },
                    ]}
                  >
                    <Icon name="lock-closed" size={22} color={colors.textTertiary} />
                  </View>
                )}
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{a.title}</Text>
                  <Text variant="caption" color="textSecondary">
                    {a.description}
                  </Text>
                </View>
                {isUnlocked && (
                  <Icon name="checkmark-circle" size={22} color={colors.success} />
                )}
              </View>
            </GlassCard>
          </Animated.View>
        );
      })}
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
  },
});
