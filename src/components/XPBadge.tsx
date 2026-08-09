import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type Kind = 'xp' | 'coins' | 'streak';

export interface XPBadgeProps {
  value: number;
  kind?: Kind;
  style?: ViewStyle;
}

const CONFIG: Record<Kind, { icon: string; color: 'xp' | 'coins' | 'streak' }> =
  {
    xp: { icon: 'flash', color: 'xp' },
    coins: { icon: 'server', color: 'coins' },
    streak: { icon: 'flame', color: 'streak' },
  };

/** Compact stat pill for XP / coins / streak. */
export const XPBadge: React.FC<XPBadgeProps> = ({
  value,
  kind = 'xp',
  style,
}) => {
  const { colors, radius, spacing } = useTheme();
  const { icon, color } = CONFIG[kind];

  return (
    <View
      style={[
        styles.pill,
        {
          borderRadius: radius.pill,
          backgroundColor: colors.surfaceAlt,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          gap: spacing.xs,
        },
        style,
      ]}
    >
      <Icon name={icon} size={15} color={colors[color]} />
      <Text variant="label" color="text">
        {value.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center' },
});
