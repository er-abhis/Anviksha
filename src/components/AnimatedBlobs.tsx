import React, { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { Gradient } from './Gradient';

interface BlobSpec {
  size: number; // fraction of screen width
  x: number; // 0..1 anchor
  y: number; // 0..1 anchor
  colors: readonly string[];
  drift: number; // px of ambient travel
  delay: number;
}

export interface AnimatedBlobsProps {
  /** Dim the blobs; 0..1. Lower for content-heavy screens. */
  intensity?: number;
  style?: ViewStyle;
}

/**
 * Ambient neon blobs that slowly drift and pulse behind content — the signature
 * backdrop of the redesign. Soft radial gradients (no blur dependency). Purely
 * decorative: non-interactive and cheap (3 looping shared values).
 */
export const AnimatedBlobs: React.FC<AnimatedBlobsProps> = ({
  intensity = 1,
  style,
}) => {
  const { gradients, mode } = useTheme();
  const { width, height } = useWindowDimensions();

  const specs: BlobSpec[] = [
    { size: 0.95, x: -0.15, y: -0.05, colors: gradients.brand, drift: 34, delay: 0 },
    { size: 0.8, x: 0.7, y: 0.18, colors: gradients.cool, drift: 28, delay: 1200 },
    { size: 0.85, x: 0.15, y: 0.72, colors: gradients.warm, drift: 40, delay: 600 },
  ];

  const baseOpacity = (mode === 'dark' ? 0.55 : 0.35) * intensity;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip, style]}>
      {specs.map((s, i) => (
        <Blob
          key={i}
          spec={s}
          screenW={width}
          screenH={height}
          opacity={baseOpacity}
        />
      ))}
    </View>
  );
};

const Blob: React.FC<{
  spec: BlobSpec;
  screenW: number;
  screenH: number;
  opacity: number;
}> = ({ spec, screenW, screenH, opacity }) => {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [t]);

  const dim = screenW * spec.size;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: (t.value - 0.5) * spec.drift },
      { translateY: (0.5 - t.value) * spec.drift },
      { scale: 1 + t.value * 0.08 },
    ],
    opacity: opacity * (0.75 + t.value * 0.25),
  }));

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: dim,
          height: dim,
          left: spec.x * screenW,
          top: spec.y * screenH,
        },
        animatedStyle,
      ]}
    >
      <Gradient
        radial
        colors={[...spec.colors, 'rgba(0,0,0,0)']}
        opacities={[0.9, 0.5, 0]}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 9999 },
});
