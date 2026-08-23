import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme/ThemeProvider';
import { ColorPalette } from '../theme/colors';
import { PressableScale } from './PressableScale';

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
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      hitSlop={8}
      activeScale={0.9}
      style={[
        styles.base,
        {
          borderRadius: radius.md,
          backgroundColor: bg,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
    >
      <Icon name={name} size={size} color={colors[color]} />
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  base: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
