import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTheme } from '../../../theme/ThemeProvider';
import { OnboardingSlide } from '../data';

interface Props {
  variant: OnboardingSlide['art'];
  size: number;
}

const STROKE = 'rgba(255,255,255,0.9)';
const FAINT = 'rgba(255,255,255,0.4)';

/** Lively animated abstract neon composition — decorative, no stock art. */
export const AbstractArt: React.FC<Props> = ({ variant, size }) => {
  const { colors } = useTheme();

  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    spin.value = withRepeat(
      withTiming(1, { duration: 14000, easing: Easing.linear }),
      -1,
      false,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [spin, pulse]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  const counterSpinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-spin.value * 360}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.65 + pulse.value * 0.35,
    transform: [{ scale: 0.94 + pulse.value * 0.1 }],
  }));

  const box = { width: size, height: size } as const;

  // Neon glow halo behind every variant.
  const halo = (
    <Animated.View style={[StyleSheet.absoluteFill, styles.center, pulseStyle]}>
      <View
        style={{
          width: size * 0.55,
          height: size * 0.55,
          borderRadius: size,
          backgroundColor: colors.accent,
          opacity: 0.35,
        }}
      />
    </Animated.View>
  );

  if (variant === 'orbit') {
    return (
      <View style={[box, styles.center]}>
        {halo}
        <Animated.View style={[StyleSheet.absoluteFill, spinStyle]}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="24" stroke={FAINT} strokeWidth={1.5} fill="none" />
            <Circle cx="50" cy="50" r="38" stroke={colors.accent} strokeWidth={1.5} fill="none" opacity={0.7} />
            <Circle cx="74" cy="50" r="4" fill={STROKE} />
            <Circle cx="24" cy="62" r="3" fill={colors.accentAlt} />
            <Circle cx="50" cy="12" r="3.5" fill={STROKE} />
          </Svg>
        </Animated.View>
        <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
          <Circle cx="50" cy="50" r="8" fill={STROKE} />
        </Svg>
      </View>
    );
  }

  if (variant === 'waves') {
    return (
      <View style={[box, styles.center]}>
        {halo}
        <Animated.View style={[StyleSheet.absoluteFill, pulseStyle]}>
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Path d="M5 40 Q 27.5 20 50 40 T 95 40" stroke={STROKE} strokeWidth={2} fill="none" />
            <Path d="M5 55 Q 27.5 35 50 55 T 95 55" stroke={colors.accent} strokeWidth={2} fill="none" opacity={0.85} />
            <Path d="M5 70 Q 27.5 50 50 70 T 95 70" stroke={colors.accentAlt} strokeWidth={2} fill="none" opacity={0.7} />
          </Svg>
        </Animated.View>
      </View>
    );
  }

  // grid
  return (
    <View style={[box, styles.center]}>
      {halo}
      <Animated.View style={[StyleSheet.absoluteFill, counterSpinStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {[25, 50, 75].map(p => (
            <React.Fragment key={`h${p}`}>
              <Line x1="15" y1={p} x2="85" y2={p} stroke={FAINT} strokeWidth={1} />
              <Line x1={p} y1="15" x2={p} y2="85" stroke={FAINT} strokeWidth={1} />
            </React.Fragment>
          ))}
          <Circle cx="25" cy="50" r="4" fill={colors.accent} />
          <Circle cx="50" cy="25" r="4" fill={STROKE} />
          <Circle cx="75" cy="75" r="4" fill={colors.accentAlt} />
          <Line x1="25" y1="50" x2="50" y2="25" stroke={STROKE} strokeWidth={1.5} />
          <Line x1="50" y1="25" x2="75" y2="75" stroke={STROKE} strokeWidth={1.5} />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
});
