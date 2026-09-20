import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ElevationLevel } from '../theme/elevation';
import { PressableScale } from './PressableScale';

export interface GlassCardProps extends ViewProps {
  elevation?: ElevationLevel;
  padded?: boolean;
  padding?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted glass surface — translucent fill and a luminous hairline border.
 * No blur dependency; the translucency reads as glass over the blob backdrop.
 * Springy press feedback when `onPress` is set.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  elevation = 'md',
  padded = true,
  padding,
  onPress,
  style,
  children,
  ...rest
}) => {
  const { colors, radius, spacing, elevation: shadows } = useTheme();

  const surface: ViewStyle = {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    ...shadows[elevation],
  };

  const padVal = padding !== undefined ? padding : padded ? spacing.md : 0;

  const inner = (
    <View
      style={[
        styles.innerContainer,
        padVal > 0 && { padding: padVal },
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        style={[surface, style]}
        {...rest}
      >
        {inner}
      </PressableScale>
    );
  }

  return (
    <View style={[surface, style]} {...rest}>
      {inner}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: { flex: 1, width: '100%', height: '100%' },
});
