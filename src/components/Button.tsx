import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  left,
  right,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const { colors, radius, spacing } = theme;

  const heights: Record<Size, number> = { sm: 40, md: 48, lg: 56 };
  const paddings: Record<Size, number> = {
    sm: spacing.lg,
    md: spacing.xl,
    lg: spacing.xxl,
  };

  const bg: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.surfaceAlt,
    ghost: 'transparent',
    destructive: colors.error,
  };
  const fg: Record<Variant, keyof typeof colors> = {
    primary: 'onPrimary',
    secondary: 'text',
    ghost: 'primary',
    destructive: 'onPrimary',
  };

  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          borderRadius: radius.md,
          backgroundColor: bg[variant],
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        variant === 'ghost' && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors[fg[variant]]} />
      ) : (
        <View style={styles.content}>
          {left}
          <Text variant="button" color={fg[variant]}>
            {label}
          </Text>
          {right}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
