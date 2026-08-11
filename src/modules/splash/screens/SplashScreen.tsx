import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { useTheme } from '../../../theme/ThemeProvider';
import { initDatabase } from '../../../database/db';
import { usePreferencesStore } from '../../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/** Dedicated full-bleed splash artwork (NOT the logo — logo is for in-app branding). */
const SPLASH = require('../../../assets/splash.png');

const HOLD_MS = 1600;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const onboardingComplete = usePreferencesStore(s => s.onboardingComplete);

  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: theme.duration.slow });

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

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.fill}>
      {/* contain = whole artwork visible & centered on every device/aspect
          ratio; the black backdrop hides the (black) letterbox margins. */}
      <Animated.Image
        source={SPLASH}
        resizeMode="contain"
        style={[StyleSheet.absoluteFill, style]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#000000' },
});
