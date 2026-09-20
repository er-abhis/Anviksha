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
        <View style={{ padding: spacing.md, minHeight: 125, justifyContent: 'space-between' }}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowBadge}>
              <Text variant="label" color="textInverse" style={styles.eyebrow}>
                {eyebrow}
              </Text>
            </View>
            <View style={styles.arrowCircle}>
              <Icon name="chevron-forward" size={14} color="#FFFFFF" />
            </View>
          </View>

          <View style={{ marginVertical: 2 }}>
            <Text variant="bodyStrong" color="textInverse" style={{ fontSize: 17, fontWeight: 'bold' }}>
              {data.title}
            </Text>
            <Text
              variant="caption"
              color="textInverse"
              numberOfLines={1}
              style={[styles.sub, { marginTop: 1 }]}
            >
              {data.subtitle}
            </Text>
          </View>

          <View style={{ gap: 2 }}>
            <View style={styles.progressHeader}>
              <Text variant="caption" color="textInverse" style={{ opacity: 0.9, fontSize: 11 }}>
                World Progress
              </Text>
              <Text variant="caption" color="textInverse" style={{ fontWeight: 'bold', fontSize: 11 }}>
                {pct}%
              </Text>
            </View>
            <ProgressBar
              progress={data.progress}
              trackColor="overlay"
              fillColor="textInverse"
              height={5}
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
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  eyebrow: { letterSpacing: 1.1, opacity: 0.95, fontSize: 10 },
  sub: { opacity: 0.92, lineHeight: 16 },
  arrowCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
