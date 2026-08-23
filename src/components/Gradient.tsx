import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export interface GradientProps {
  colors: readonly string[];
  /** 0..1 direction start/end points. Default: top-left to bottom-right. */
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  /** Render a soft radial fill instead of linear (used for glow blobs). */
  radial?: boolean;
  /** Optional per-stop opacities, aligned to `colors`. */
  opacities?: readonly number[];
  /** Rounds the fill so it can sit behind rounded content. */
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  pointerEvents?: ViewStyle['pointerEvents'];
}

// Stable-ish id from inputs; avoids '#' which breaks url(#…) on some renderers.
let seq = 0;
const nextId = () => `grad-${(seq = (seq + 1) % 100000)}`;

/**
 * SVG-based gradient (no expo-linear-gradient dependency). Supports linear and
 * radial fills. Fills its container; place absolute children over it.
 */
export const Gradient: React.FC<GradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  radial = false,
  opacities,
  borderRadius,
  style,
  children,
  pointerEvents,
}) => {
  const id = useMemo(nextId, []);
  const stops = colors.map((c, i) => (
    <Stop
      key={i}
      offset={colors.length === 1 ? 0 : i / (colors.length - 1)}
      stopColor={c}
      stopOpacity={opacities?.[i] ?? 1}
    />
  ));

  return (
    <View
      pointerEvents={pointerEvents}
      style={[styles.container, borderRadius != null && { borderRadius }, style]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          {radial ? (
            <RadialGradient id={id} cx="50%" cy="50%" r="65%">
              {stops}
            </RadialGradient>
          ) : (
            <LinearGradient id={id} x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
              {stops}
            </LinearGradient>
          )}
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});
