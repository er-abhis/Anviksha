import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { AchievementMock } from '../types';

export const AchievementChip: React.FC<{ item: AchievementMock }> = ({
  item,
}) => {
  const { colors, radius, spacing, elevation } = useTheme();
  const tint = item.unlocked ? colors.accent : colors.textTertiary;
  return (
    <Animated.View
      entering={ZoomIn.springify().damping(16)}
      style={[styles.wrap, { width: 92 }]}
    >
      <View
        style={[
          styles.badge,
          {
            borderRadius: radius.xl,
            backgroundColor: item.unlocked
              ? colors.glass
              : colors.background,
            borderColor: item.unlocked ? colors.accent : colors.border,
            opacity: item.unlocked ? 1 : 0.6,
            marginBottom: spacing.xs,
          },
          item.unlocked && elevation.glow,
        ]}
      >
        <Icon name={item.icon} size={28} color={tint} />
      </View>
      <Text variant="caption" color="textSecondary" center numberOfLines={2}>
        {item.title}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  badge: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
