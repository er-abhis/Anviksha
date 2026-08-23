import React from 'react';
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ElevationLevel } from '../theme/elevation';
import { PressableScale } from './PressableScale';

export interface CardProps extends ViewProps {
  elevation?: ElevationLevel;
  padded?: boolean;
  onPress?: () => void;
  /** Neon glow shadow for hero cards. */
  glow?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Surface container with themed background, radius and optional elevation. */
export const Card: React.FC<CardProps> = ({
  elevation = 'sm',
  padded = true,
  onPress,
  glow = false,
  style,
  children,
  ...rest
}) => {
  const { colors, radius, spacing, elevation: shadows } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: padded ? spacing.lg : 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows[glow ? 'glow' : elevation],
  };

  if (onPress) {
    return (
      <PressableScale onPress={onPress} style={[cardStyle, style]} {...rest}>
        {children}
      </PressableScale>
    );
  }

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
};
