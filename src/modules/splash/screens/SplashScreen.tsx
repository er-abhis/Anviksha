import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { Gradient, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { APP } from '../../../constants/app';
import { initDatabase } from '../../../database/db';
import { usePreferencesStore } from '../../../store';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const HOLD_MS = 1100;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const onboardingComplete = usePreferencesStore(s => s.onboardingComplete);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: theme.duration.slow });
    scale.value = withTiming(1, { duration: theme.duration.slow });

    let cancelled = false;
    (async () => {
      await initDatabase().catch(() => {
        // DB failure shouldn't block the splash; screens degrade gracefully.
      });
      if (cancelled) return;
      // Small hold so the intro motion is felt, then route.
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

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.fill}>
      <Gradient
        colors={[theme.colors.primary, theme.colors.accent]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Animated.View style={[styles.logo, logoStyle]}>
          <Text variant="display" color="textInverse" center>
            {APP.name}
          </Text>
          <Text variant="label" color="textInverse" center style={styles.tag}>
            {APP.tagline}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { alignItems: 'center' },
  tag: { marginTop: 8, opacity: 0.9 },
});
