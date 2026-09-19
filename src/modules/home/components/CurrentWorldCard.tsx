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
  const { radius, spacing, elevation } = useTheme();
  const pct = Math.round(data.progress * 100);

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
        <View style={{ padding: spacing.xl, minHeight: 165, justifyContent: 'space-between' }}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowBadge}>
              <Text variant="label" color="textInverse" style={styles.eyebrow}>
                {eyebrow}
              </Text>
            </View>
            <View style={styles.arrowCircle}>
              <Icon name="chevron-forward" size={16} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ marginVertical: spacing.xs }}>
            <Text variant="h2" color="textInverse">
              {data.title}
            </Text>
            <Text
              variant="body"
              color="textInverse"
              numberOfLines={2}
              style={[styles.sub, { marginTop: spacing.xxs }]}
            >
              {data.subtitle}
            </Text>
          </View>

          <View style={{ gap: spacing.xs }}>
            <View style={styles.progressHeader}>
              <Text variant="caption" color="textInverse" style={{ opacity: 0.9 }}>
                World Progress
              </Text>
              <Text variant="caption" color="textInverse" style={{ fontWeight: 'bold' }}>
                {pct}%
              </Text>
            </View>
            <ProgressBar
              progress={data.progress}
              trackColor="overlay"
              fillColor="textInverse"
              height={8}
            />
          </View>
        </View>
      </Gradient>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrowBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  eyebrow: { letterSpacing: 1.1, opacity: 0.95 },
  sub: { opacity: 0.92, lineHeight: 20 },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justify: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
