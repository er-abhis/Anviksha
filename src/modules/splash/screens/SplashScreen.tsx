import React, { useEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { initDatabase } from '../../../database/db';
import { usePreferencesStore } from '../../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/** Full-bleed splash artwork (a complete designed screen, not just a logo). */
const SPLASH = require('../../../assets/splash.png');

// Matches the artwork's own near-black backdrop, so any letterbox margin is
// seamless (never a light bar).
const SPLASH_BG = '#010123';

const HOLD_MS = 1600;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const onboardingComplete = usePreferencesStore(s => s.onboardingComplete);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initDatabase().catch(() => {
        // DB failure shouldn't block the splash; screens degrade gracefully.
      });
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        navigation.dispatch(
          StackActions.replace(onboardingComplete ? 'Main' : 'Onboarding'),
        );
      }, HOLD_MS);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Explicit screen-sized box (not absoluteFill — under Fabric an Image with no
  // measured width/height collapsed, rendering the art tiny/low). `contain`
  // then fits the WHOLE artwork centered; the navy backdrop covers any thin
  // top/bottom margin seamlessly.
  return (
    <View style={[styles.center, { backgroundColor: SPLASH_BG }]}>
      <Image source={SPLASH} resizeMode="contain" style={{ width, height }} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
