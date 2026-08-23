import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { initDatabase } from '../../../database/db';
import { usePreferencesStore } from '../../../store';
import { AnimatedBlobs } from '../../../components';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/** Dedicated full-bleed splash artwork (NOT the logo — logo is for in-app branding). */
const SPLASH = require('../../../assets/splash.png');

const HOLD_MS = 1600;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const onboardingComplete = usePreferencesStore(s => s.onboardingComplete);

  const opacity = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: theme.duration.slow });
    // Signature pulsing glow — purely decorative, never blocks navigation.
    pulse.value = withRepeat(
      withTiming(1, {
        duration: theme.duration.ambient,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );

    let cancelled = false;
    (async () => {
      await initDatabase().catch(() => {
        // DB failure shouldn't block the splash; screens degrade gracefully.
      });
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        navigation.reset({
          index: 0,
          routes: [{ name: onboardingComplete ? 'Main' : 'Onboarding' }],
        });
      }, HOLD_MS);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const artStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: 0.92 + opacity.value * 0.08 + pulse.value * 0.02 },
    ],
  }));

  const blobStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + pulse.value * 0.5,
  }));

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]}>
      {/* Animated neon backdrop fills the (letterboxed) margins with the brand look. */}
      <Animated.View style={[StyleSheet.absoluteFill, blobStyle]} pointerEvents="none">
        <AnimatedBlobs intensity={1} />
      </Animated.View>
      {/* contain = whole artwork visible & centered on every device/aspect
          ratio; the themed backdrop + blobs fill the margins. */}
      <Animated.Image
        source={SPLASH}
        resizeMode="contain"
        style={[StyleSheet.absoluteFill, artStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
