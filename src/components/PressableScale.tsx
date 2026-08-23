import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { easing } from '../theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  /** Scale at full press. Default 0.96. */
  activeScale?: number;
  /** Dim opacity at full press. Default 0.9. */
  activeOpacity?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

/**
 * Pressable with a springy scale + fade on press — the standard tactile feel
 * across the app. Runs entirely on the UI thread (Reanimated), so it stays
 * smooth even while JS is busy.
 */
export const PressableScale: React.FC<PressableScaleProps> = ({
  activeScale = 0.96,
  activeOpacity = 0.9,
  disabled,
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(1 - pressed.value * (1 - activeScale), easing.springBouncy) },
    ],
    opacity: withTiming(1 - pressed.value * (1 - activeOpacity), { duration: 90 }),
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={e => {
        pressed.value = 1;
        onPressIn?.(e);
      }}
      onPressOut={e => {
        pressed.value = 0;
        onPressOut?.(e);
      }}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
};
