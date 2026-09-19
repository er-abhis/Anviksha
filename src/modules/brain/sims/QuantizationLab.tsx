import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcQuantizationMetrics } from '../logic';

export const QuantizationLab: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [bits, setBits] = useState<32 | 16 | 8 | 4>(4);

  const { vramGB, perplexityPenalty, speedupFactor, memorySavingsPercent } = calcQuantizationMetrics(bits);

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="speedometer-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Model Quantization</Text>
          <Text variant="caption" color="textSecondary">
            Compress 32-bit floating point weights into 4-bit integers to fit 7B models on mobile GPUs.
          </Text>
        </View>
      </View>

      {/* Bit selector */}
      <View style={styles.btnGrid}>
        {([32, 16, 8, 4] as const).map(b => (
          <Pressable
            key={b}
            onPress={() => setBits(b)}
            style={[
              styles.bitBtn,
              {
                backgroundColor: bits === b ? colors.primary : colors.surfaceAlt,
                borderColor: bits === b ? colors.primary : colors.glassBorder,
                borderRadius: radius.md,
              },
            ]}
          >
            <Text variant="bodyStrong" style={{ color: bits === b ? colors.onPrimary : colors.text }}>
              {b === 32 ? 'FP32' : b === 16 ? 'FP16' : `INT${b}`}
            </Text>
            <Text variant="caption" style={{ color: bits === b ? colors.onPrimary + 'CC' : colors.textSecondary }}>
              {b}-bit
            </Text>
          </Pressable>
        ))}
      </View>

      {/* VRAM Progress Meter */}
      <View style={[styles.meterCard, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">VRAM Requirement</Text>
          <Text variant="bodyStrong" color="primary">{vramGB} GB / 14 GB</Text>
        </View>
        <View style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill }]}>
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(100, Math.max(10, (vramGB / 14) * 100))}%`,
                backgroundColor: bits === 4 ? colors.success : bits === 8 ? colors.primary : colors.warning,
                borderRadius: radius.pill,
              },
            ]}
          />
        </View>
        <Text variant="caption" color="textSecondary">
          {memorySavingsPercent > 0 ? `Saved ${memorySavingsPercent}% VRAM footprint compared to FP32` : 'Full baseline floating-point precision'}
        </Text>
      </View>

      {/* Impact Stats */}
      <View style={styles.metricsRow}>
        <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Inference Speed</Text>
          <Text variant="h2" color="success">{speedupFactor}x</Text>
        </View>
        <View style={[styles.metric, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Perplexity Drop</Text>
          <Text variant="h2" color={perplexityPenalty > 0.5 ? 'warning' : 'accent'}>
            +{perplexityPenalty}
          </Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  btnGrid: { flexDirection: 'row', gap: 8 },
  bitBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: StyleSheet.hairlineWidth },
  meterCard: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 10, width: '100%', overflow: 'hidden' },
  fill: { height: '100%' },
  metricsRow: { flexDirection: 'row', gap: 8 },
  metric: { flex: 1, padding: 10, alignItems: 'center', gap: 2 },
});
