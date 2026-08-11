import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { usePreferencesStore } from '../store';

/** One-shot celebratory confetti burst. Purely decorative; renders nothing
 *  (and does no work) when the user has Reduce Motion enabled. */
export interface ConfettiProps {
  /** Number of pieces. */
  count?: number;
}

const Piece: React.FC<{ index: number; color: string; width: number; height: number }> = ({
  index,
  color,
  width,
  height,
}) => {
  const progress = useSharedValue(0);
  // Deterministic-ish spread from the index so pieces fan out.
  const startX = (index * 53) % width;
  const drift = ((index % 5) - 2) * 30;
  const size = 6 + (index % 4) * 2;
  const delay = (index % 6) * 90;

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 2200, easing: Easing.out(Easing.quad) }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX + drift * progress.value },
      { translateY: -20 + (height + 60) * progress.value },
      { rotate: `${progress.value * (index % 2 ? 360 : -360)}deg` },
    ],
    opacity: 1 - Math.max(0, progress.value - 0.8) * 5,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { width: size, height: size * 1.6, backgroundColor: color },
        style,
      ]}
    />
  );
};

export const Confetti: React.FC<ConfettiProps> = ({ count = 24 }) => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const reducedMotion = usePreferencesStore(s => s.reducedMotion);

  if (reducedMotion) return null;

  const palette = [
    colors.primary,
    colors.accent,
    colors.xp,
    colors.coins,
    colors.success,
  ];

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: count }).map((_, i) => (
        <Piece key={i} index={i} color={palette[i % palette.length]} width={width} height={height} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, left: 0, borderRadius: 2 },
});
