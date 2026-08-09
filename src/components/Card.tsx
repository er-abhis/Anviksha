import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { ElevationLevel } from '../theme/elevation';

export interface CardProps extends ViewProps {
  elevation?: ElevationLevel;
  padded?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

/** Surface container with themed background, radius and optional elevation. */
export const Card: React.FC<CardProps> = ({
  elevation = 'sm',
  padded = true,
  onPress,
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
    ...shadows[elevation],
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed, style]}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
