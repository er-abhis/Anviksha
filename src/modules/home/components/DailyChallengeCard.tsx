import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text, XPBadge } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { DailyChallengeMock } from '../types';

export const DailyChallengeCard: React.FC<{
  data: DailyChallengeMock;
  onStart?: () => void;
}> = ({ data, onStart }) => {
  const { colors, radius, spacing } = useTheme();

  return (
    <GlassCard elevation="glow" style={{ borderColor: colors.primary + '44' }}>
      <View style={styles.header}>
        <View style={styles.row}>
          <View
            style={[
              styles.spark,
              { backgroundColor: colors.primaryMuted, borderRadius: radius.md },
            ]}
          >
            <Icon name="sparkles" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">{data.title}</Text>
            <Text variant="caption" color="textSecondary">
              {data.completed ? 'Daily Hook Complete' : 'Quick Revision Challenge'}
            </Text>
          </View>
        </View>
        <XPBadge value={data.xpReward} kind="xp" />
      </View>

      <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm, lineHeight: 20 }}>
        {data.description}
      </Text>

      {data.completed ? (
        <View
          style={[
            styles.completedBadge,
            {
              backgroundColor: colors.success + '22',
              borderColor: colors.success + '66',
              borderRadius: radius.md,
              marginTop: spacing.md,
            },
          ]}
        >
          <Icon name="checkmark-circle" size={18} color={colors.success} />
          <Text variant="bodyStrong" color="success">
            Challenge completed for today!
          </Text>
        </View>
      ) : (
        <Button
          label="Start Challenge"
          size="md"
          onPress={onStart}
          right={<Icon name="arrow-forward" size={16} color={colors.onPrimary} />}
          style={{ marginTop: spacing.md }}
        />
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  spark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
});
