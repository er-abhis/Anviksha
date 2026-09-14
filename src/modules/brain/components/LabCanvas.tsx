import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gradient } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { usePreferencesStore } from '../../../store';

/**
 * A dark, neon "lab" panel that all Brain sims sit on. Deep gradient backdrop,
 * a faint grid, and a light bar that sweeps across on a loop so the canvas feels
 * alive/processing. Purely decorative + offline — no data, no network.
 */
export const LabCanvas: React.FC<{
  height?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}> = ({ height = 220, style, children }) => {
  const { radius } = useTheme();
  const reduced = usePreferencesStore(s => s.reducedMotion);
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    sweep.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [sweep, reduced]);

  const sweepStyle = useAnimatedStyle(() => ({
    left: `${-20 + sweep.value * 120}%`,
    opacity: 0.35 * Math.sin(sweep.value * Math.PI),
  }));

  return (
    <View style={[styles.wrap, { height, borderRadius: radius.lg }, style]}>
      <Gradient
        colors={['#0E0A24', '#1B1147', '#0E0A24']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        borderRadius={radius.lg}
        pointerEvents="none"
      />
      {/* neon top glow */}
      <Gradient
        colors={['rgba(124,92,255,0.45)', 'rgba(124,92,255,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.topGlow}
        pointerEvents="none"
      />
      {/* sweeping light bar */}
      <Animated.View style={[styles.sweep, sweepStyle]} pointerEvents="none">
        <Gradient
          colors={['rgba(34,224,214,0)', 'rgba(34,224,214,0.5)', 'rgba(34,224,214,0)']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(124,92,255,0.35)' },
  topGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  sweep: { position: 'absolute', top: 0, bottom: 0, width: '35%' },
  content: { flex: 1, padding: 14, justifyContent: 'center' },
});
