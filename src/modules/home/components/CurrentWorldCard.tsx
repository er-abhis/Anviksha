import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Gradient, PressableScale, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { CurrentWorldMock } from '../types';

export const CurrentWorldCard: React.FC<{
  data: CurrentWorldMock;
  onPress?: () => void;
  /** Overline label — defaults to "CURRENT WORLD"; reused for Explore/Recommended. */
  eyebrow?: string;
}> = ({ data, onPress, eyebrow = 'CURRENT WORLD' }) => {
  const { radius, spacing, gradients, elevation } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      style={[{ borderRadius: radius.xl }, elevation.glow]}
    >
      <Gradient
        colors={data.gradient}
        style={{ borderRadius: radius.xl, overflow: 'hidden' }}
      >
        <Gradient
          colors={gradients.sheen}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.sheen}
          pointerEvents="none"
        />
        <View style={{ padding: spacing.xl, minHeight: 158, justifyContent: 'center' }}>
          <View style={styles.eyebrowRow}>
            <Text variant="label" color="textInverse" style={styles.eyebrow}>
              {eyebrow}
            </Text>
            <Icon name="chevron-forward" size={18} color="#FFFFFF" />
          </View>
          <Text
            variant="h2"
            color="textInverse"
            style={{ marginTop: spacing.xs }}
          >
            {data.title}
          </Text>
          <Text
            variant="body"
            color="textInverse"
            style={[styles.sub, { marginTop: spacing.xxs }]}
          >
            {data.subtitle}
          </Text>
          <View style={{ marginTop: spacing.lg }}>
            <ProgressBar
              progress={data.progress}
              trackColor="overlay"
              fillColor="textInverse"
            />
          </View>
        </View>
      </Gradient>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  sheen: { position: 'absolute', top: 0, left: 0, right: 0, height: '60%' },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: { letterSpacing: 1.2, opacity: 0.9 },
  sub: { opacity: 0.9 },
});
