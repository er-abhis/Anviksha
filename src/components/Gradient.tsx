import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';

export interface GradientProps {
  colors: string[];
  /** 0..1 direction start/end points. Default: top-left to bottom-right. */
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * SVG-based linear gradient (no expo-linear-gradient dependency).
 * Fills its container; place absolute children over it.
 */
export const Gradient: React.FC<GradientProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}) => {
  // Strip '#' from hex colors — a '#' inside an SVG id / url(#…) reference is
  // invalid and can make the gradient fill fail to resolve on some renderers.
  const id = `grad-${colors.map(c => c.replace(/#/g, '')).join('-')}`;
  return (
    <View style={[styles.container, style]}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient
            id={id}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
          >
            {colors.map((c, i) => (
              <Stop
                key={i}
                offset={colors.length === 1 ? 0 : i / (colors.length - 1)}
                stopColor={c}
              />
            ))}
          </LinearGradient>
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
