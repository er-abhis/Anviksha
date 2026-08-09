import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { ColorPalette } from '../theme/colors';

export interface ProgressBarProps {
  /** 0..1 */
  progress: number;
  height?: number;
  trackColor?: keyof ColorPalette;
  fillColor?: keyof ColorPalette;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  trackColor = 'surfaceAlt',
  fillColor = 'primary',
  style,
}) => {
  const { colors, radius, duration } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  const value = useSharedValue(clamped);

  useEffect(() => {
    value.value = withTiming(clamped, { duration: duration.base });
  }, [clamped, duration.base, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${value.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(clamped * 100), min: 0, max: 100 }}
      style={[
        {
          height,
          borderRadius: radius.pill,
          backgroundColor: colors[trackColor],
        },
        styles.track,
        style,
      ]}
    >
      <Animated.View
        style={[
          fillStyle,
          {
            height,
            borderRadius: radius.pill,
            backgroundColor: colors[fillColor],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
});
