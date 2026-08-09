import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card, EmptyState, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore } from '../../../store';
import { ACHIEVEMENTS } from '../../../content/curriculum';

export const AchievementsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const unlocked = useAchievementsStore(s => s.unlocked);
  const unlockedCount = ACHIEVEMENTS.filter(a => unlocked[a.slug]).length;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="Achievements" large />

      {unlockedCount === 0 ? (
        <EmptyState
          icon="trophy-outline"
          title="Your achievements will appear here"
          message="Earn badges by completing challenges, finishing lessons, and keeping streaks. Complete your first challenge to unlock one."
        />
      ) : (
        <Text variant="label" color="textSecondary">
          {`${unlockedCount} of ${ACHIEVEMENTS.length} unlocked`}
        </Text>
      )}

      {ACHIEVEMENTS.map(a => {
        const isUnlocked = Boolean(unlocked[a.slug]);
        return (
          <Card
            key={a.slug}
            elevation="sm"
            style={{ opacity: isUnlocked ? 1 : 0.65 }}
          >
            <View style={[styles.row, { gap: spacing.md }]}>
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: isUnlocked
                      ? colors.surfaceAlt
                      : colors.background,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Icon
                  name={isUnlocked ? a.icon : 'lock-closed'}
                  size={22}
                  color={isUnlocked ? colors.accent : colors.textTertiary}
                />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{a.title}</Text>
                <Text variant="caption" color="textSecondary">
                  {a.description}
                </Text>
              </View>
              {isUnlocked && (
                <Icon
                  name="checkmark-circle"
                  size={20}
                  color={colors.success}
                />
              )}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
