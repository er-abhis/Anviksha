import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard } from './GlassCard';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';

export const AIPerformanceRadarCard: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [activeMetric, setActiveMetric] = useState<'speed' | 'accuracy' | 'scaling'>('speed');

  // Pulse animation style for live radar indicator
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 }),
      ),
      -1,
      true,
    ),
    transform: [
      {
        scale: withRepeat(
          withSequence(
            withTiming(1.1, { duration: 600 }),
            withTiming(1.0, { duration: 600 }),
          ),
          -1,
          true,
        ),
      },
    ],
  }));

  const metrics = {
    speed: [
      { label: 'INT8 On-Device Inference', value: '0.8 ms', pct: 94, color: '#7C5CFF' },
      { label: 'Token Generation Throughput', value: '142 tok/s', pct: 88, color: '#06D6C4' },
      { label: 'KV-Cache Memory Efficiency', value: '3.2 GB', pct: 90, color: '#3B82F6' },
    ],
    accuracy: [
      { label: 'MMLU Benchmark Score', value: '88.4%', pct: 88, color: '#10B981' },
      { label: 'GSM8K Math Reasoning', value: '92.1%', pct: 92, color: '#F59E0B' },
      { label: 'HumanEval Python Code', value: '85.6%', pct: 85, color: '#EC4899' },
    ],
    scaling: [
      { label: 'Context Length Capacity', value: '128K Tokens', pct: 95, color: '#A855F7' },
      { label: 'RAG Retrieval Precision', value: '96.2%', pct: 96, color: '#06D6C4' },
      { label: 'Hallucination Mitigation', value: '99.1%', pct: 99, color: '#38BDF8' },
    ],
  };

  const currentList = metrics[activeMetric];

  return (
    <GlassCard elevation="glow" style={{ borderRadius: radius.xl, gap: spacing.sm }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Animated.View style={[styles.pulseDot, pulseStyle, { backgroundColor: colors.success }]} />
          <Icon name="pulse" size={18} color={colors.primary} />
          <Text variant="h3" style={styles.titleText}>
            AI Performance Radar
          </Text>
        </View>

        <View style={[styles.liveBadge, { backgroundColor: colors.primaryMuted, borderColor: colors.primary + '44' }]}>
          <Text variant="caption" style={{ color: colors.primary, fontWeight: '800', fontSize: 10 }}>
            LIVE BENCHMARKS
          </Text>
        </View>
      </View>

      <Text variant="caption" color="textSecondary" style={{ fontSize: 12 }}>
        Real-time neural network performance metrics, edge latency & benchmark accuracy.
      </Text>

      {/* Interactive Tabs */}
      <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        {[
          { key: 'speed', label: 'Speed & Latency', icon: 'flash' },
          { key: 'accuracy', label: 'Accuracy', icon: 'checkmark-done' },
          { key: 'scaling', label: 'Context Scaling', icon: 'git-network' },
        ].map(tab => {
          const active = activeMetric === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveMetric(tab.key as any)}
              style={[
                styles.tabBtn,
                active && { backgroundColor: colors.primary, borderRadius: radius.sm },
              ]}
            >
              <Icon name={tab.icon} size={12} color={active ? colors.onPrimary : colors.textSecondary} />
              <Text
                variant="caption"
                style={{
                  color: active ? colors.onPrimary : colors.textSecondary,
                  fontWeight: '700',
                  fontSize: 10,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Metrics List */}
      <View style={{ gap: spacing.xs, marginTop: 4 }}>
        {currentList.map(item => (
          <View key={item.label} style={{ gap: 3 }}>
            <View style={styles.metricRow}>
              <Text variant="caption" style={{ fontWeight: '600', fontSize: 11 }}>
                {item.label}
              </Text>
              <Text variant="caption" style={{ color: item.color, fontWeight: '800', fontSize: 11 }}>
                {item.value}
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View style={[styles.fill, { width: `${item.pct}%`, backgroundColor: item.color }]} />
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  titleText: { fontSize: 15, fontWeight: '800' },
  liveBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, borderWidth: 1 },
  tabRow: { flexDirection: 'row', padding: 3, gap: 2 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
});
