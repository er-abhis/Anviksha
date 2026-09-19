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
          <View style={styles.titleCol}>
            <Text variant="bodyStrong" numberOfLines={1}>{data.title}</Text>
            <Text variant="caption" color="textSecondary" numberOfLines={1}>
              {data.completed ? 'Daily Hook Complete' : 'Quick Revision Challenge'}
            </Text>
          </View>
        </View>
        <View style={styles.badgeWrap}>
          <XPBadge value={data.xpReward} kind="xp" />
        </View>
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
          style={{ marginTop: spacing.md, alignSelf: 'stretch' }}
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
    gap: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  titleCol: { flex: 1, minWidth: 0 },
  badgeWrap: { flexShrink: 0 },
  spark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
  },
});
