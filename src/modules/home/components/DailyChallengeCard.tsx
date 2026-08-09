import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Text, XPBadge } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { DailyChallengeMock } from '../types';

export const DailyChallengeCard: React.FC<{
  data: DailyChallengeMock;
  onStart?: () => void;
}> = ({ data, onStart }) => {
  const { colors, spacing } = useTheme();
  return (
    <Card elevation="md">
      <View style={[styles.header, { marginBottom: spacing.sm }]}>
        <View style={[styles.row, { gap: spacing.sm }]}>
          <Icon name="sparkles" size={18} color={colors.accent} />
          <Text variant="bodyStrong">{data.title}</Text>
        </View>
        <XPBadge value={data.xpReward} kind="xp" />
      </View>
      <Text variant="body" color="textSecondary">
        {data.description}
      </Text>
      {data.completed ? (
        <View style={[styles.row, { gap: spacing.xs, marginTop: spacing.lg }]}>
          <Icon name="checkmark-circle" size={18} color={colors.success} />
          <Text variant="label" color="success">
            Completed today · come back tomorrow
          </Text>
        </View>
      ) : (
        <Button
          label="Start challenge"
          size="sm"
          onPress={onStart}
          style={{ marginTop: spacing.lg }}
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
