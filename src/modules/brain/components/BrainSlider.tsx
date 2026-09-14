import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Text } from '../../../components';

export interface BrainSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  /** Formats the value shown on the right (defaults to the raw number). */
  format?: (v: number) => string;
}

/**
 * A dependency-free draggable slider. Tapping or dragging the track sets the
 * value; snaps to `step`. Used across the Brain sims for live experimentation.
 */
export const BrainSlider: React.FC<BrainSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}) => {
  const { colors, radius, spacing } = useTheme();
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);

  const setFromX = (x: number) => {
    const w = widthRef.current;
    if (w <= 0) return;
    const frac = Math.max(0, Math.min(1, x / w));
    const raw = min + frac * (max - min);
    const snapped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, snapped));
    // Avoid float drift in the displayed value.
    onChange(+clamped.toFixed(5));
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e => setFromX(e.nativeEvent.locationX),
      onPanResponderMove: e => setFromX(e.nativeEvent.locationX),
    }),
  ).current;

  const frac = max === min ? 0 : (value - min) / (max - min);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  return (
    <View style={{ gap: spacing.xs }}>
      <View style={styles.head}>
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
        <Text variant="bodyStrong" color="primary">
          {format ? format(value) : String(value)}
        </Text>
      </View>
      <View
        {...pan.panHandlers}
        onLayout={onLayout}
        style={styles.touch}
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
      >
        <View style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
          <View
            style={[
              styles.fill,
              { width: `${frac * 100}%`, backgroundColor: colors.primary, borderRadius: radius.pill },
            ]}
          />
        </View>
        <View
          style={[
            styles.thumb,
            {
              left: Math.max(0, Math.min(width - 22, frac * width - 11)),
              backgroundColor: colors.primary,
              borderColor: colors.onPrimary,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  touch: { height: 36, justifyContent: 'center' },
  track: { height: 8, width: '100%', overflow: 'hidden' },
  fill: { height: 8 },
  thumb: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3,
  },
});
