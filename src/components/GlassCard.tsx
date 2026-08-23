import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ElevationLevel } from '../theme/elevation';
import { Gradient } from './Gradient';
import { PressableScale } from './PressableScale';

export interface GlassCardProps extends ViewProps {
  elevation?: ElevationLevel;
  padded?: boolean;
  onPress?: () => void;
  /** Add a soft top sheen for the frosted-glass highlight. Default true. */
  sheen?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted glass surface — translucent fill, luminous hairline border and a top
 * sheen. No blur dependency; the translucency reads as glass over the animated
 * blob backdrop. Springy press feedback when `onPress` is set.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  elevation = 'md',
  padded = true,
  onPress,
  sheen = true,
  style,
  children,
  ...rest
}) => {
  const { colors, radius, spacing, gradients, elevation: shadows } = useTheme();

  const surface: ViewStyle = {
    backgroundColor: colors.glass,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    ...shadows[elevation],
  };

  const inner = (
    <>
      {sheen && (
        <Gradient
          colors={gradients.sheen}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />
      )}
      <View style={padded ? { padding: spacing.lg } : undefined}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={[surface, style]} {...rest}>
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
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
});
