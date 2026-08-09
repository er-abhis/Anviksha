import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { AchievementMock } from '../types';

export const AchievementChip: React.FC<{ item: AchievementMock }> = ({
  item,
}) => {
  const { colors, radius, spacing } = useTheme();
  const tint = item.unlocked ? colors.accent : colors.textTertiary;
  return (
    <View style={[styles.wrap, { width: 92 }]}>
      <View
        style={[
          styles.badge,
          {
            borderRadius: radius.lg,
            backgroundColor: item.unlocked
              ? colors.surfaceAlt
              : colors.background,
            borderColor: colors.border,
            opacity: item.unlocked ? 1 : 0.6,
            marginBottom: spacing.xs,
          },
        ]}
      >
        <Icon name={item.icon} size={26} color={tint} />
      </View>
      <Text variant="caption" color="textSecondary" center numberOfLines={2}>
        {item.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  badge: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
