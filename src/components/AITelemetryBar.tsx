import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export const AITelemetryBar: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const pulse = useSharedValue(0.4);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, [pulse]);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.8 + pulse.value * 0.4 }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt, borderColor: colors.accent + '33', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs }]}>
      <View style={styles.statusRow}>
        <Animated.View style={[styles.dot, { backgroundColor: colors.accent }, dotStyle]} />
        <Text style={{ fontSize: 10, fontWeight: '800', color: colors.accent, letterSpacing: 0.5 }}>
          NEURAL TELEMETRY
        </Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Icon name="flash" size={10} color="#FACC15" />
          <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: '600' }}>0.8ms</Text>
        </View>
        <View style={styles.metricItem}>
          <Icon name="shield-checkmark" size={10} color="#06D6C4" />
          <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: '600' }}>100% Offline</Text>
        </View>
        <View style={styles.metricItem}>
          <Icon name="hardware-chip-outline" size={10} color="#FF2E93" />
          <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: '600' }}>INT8 Engine</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    gap: 10,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
