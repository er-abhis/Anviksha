import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { ColorPalette } from '../theme/colors';

export interface IconButtonProps {
  name: string;
  onPress?: () => void;
  size?: number;
  color?: keyof ColorPalette;
  background?: keyof ColorPalette | 'transparent';
  accessibilityLabel: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  onPress,
  size = 22,
  color = 'text',
  background = 'surfaceAlt',
  accessibilityLabel,
  style,
  disabled,
}) => {
  const { colors, radius } = useTheme();
  const bg = background === 'transparent' ? 'transparent' : colors[background];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: radius.md,
          backgroundColor: bg,
          opacity: disabled ? 0.4 : pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Icon name={name} size={size} color={colors[color]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
