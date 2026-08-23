import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  PressableProps,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Text } from './Text';
import { Gradient } from './Gradient';
import { PressableScale } from './PressableScale';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  /** Neon glow under the button. Defaults to true for the primary variant. */
  glow?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  glow,
  disabled,
  left,
  right,
  style,
  ...rest
}) => {
  const theme = useTheme();
  const { colors, radius, spacing, gradients, elevation } = theme;

  const heights: Record<Size, number> = { sm: 44, md: 52, lg: 58 };
  const paddings: Record<Size, number> = {
    sm: spacing.lg,
    md: spacing.xl,
    lg: spacing.xxl,
  };

  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const showGlow = (glow ?? isPrimary) && !disabled && !loading;

  const bg: Record<Variant, string> = {
    primary: 'transparent', // painted by gradient
    secondary: colors.surfaceAlt,
    ghost: 'transparent',
    destructive: 'transparent',
  };
  const fg: Record<Variant, keyof typeof colors> = {
    primary: 'onPrimary',
    secondary: 'text',
    ghost: 'primary',
    destructive: 'onPrimary',
  };

  const isDisabled = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          borderRadius: radius.pill,
          backgroundColor: bg[variant],
          opacity: isDisabled ? 0.5 : 1,
        },
        variant === 'ghost' && {
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.borderStrong,
        },
        showGlow && elevation.glow,
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...rest}
    >
      {(isPrimary || isDestructive) && (
        <Gradient
          colors={isDestructive ? gradients.warm : gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          borderRadius={radius.pill}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      )}
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
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  fullWidth: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
