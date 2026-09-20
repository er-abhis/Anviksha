import React from 'react';
import { StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
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
 * Static neon blobs behind content — the signature backdrop of the redesign.
 * Soft radial gradients (no blur dependency). Purely decorative and static:
 * no looping motion (was ambient drift/pulse; removed to cut animation overuse).
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
  const dim = screenW * spec.size;

  return (
    <View
      style={[
        styles.blob,
        {
          width: dim,
          height: dim,
          left: spec.x * screenW,
          top: spec.y * screenH,
          opacity: opacity * 0.9,
        },
      ]}
    >
      <Gradient
        radial
        colors={[...spec.colors, 'transparent']}
        opacities={[0.9, 0.5, 0]}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  blob: { position: 'absolute', borderRadius: 9999 },
});
