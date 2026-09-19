import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcLoRAMetrics } from '../logic';

export const FineTuning: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [rank, setRank] = useState(8);
  const [alpha] = useState(16);

  const { loraParams, baseMatrixParams, paramReduction, scalingFactor } = calcLoRAMetrics(rank, alpha);

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="layers-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">LoRA Fine-Tuning</Text>
          <Text variant="caption" color="textSecondary">
            Decompose weight updates into low-rank matrices A and B (rank r).
          </Text>
        </View>
      </View>

      {/* Rank Selector */}
      <View style={[styles.controlBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">LoRA Rank Dimension ($r$): {rank}</Text>
          <Text variant="caption" color="primary">Scaling factor $\alpha/r = {scalingFactor}$</Text>
        </View>
        <View style={styles.rankRow}>
          {[2, 4, 8, 16, 32].map(r => (
            <Pressable
              key={r}
              onPress={() => setRank(r)}
              style={[
                styles.rankBtn,
                {
                  backgroundColor: rank === r ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" style={{ color: rank === r ? colors.onPrimary : colors.text }}>
                r={r}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Parameter Comparison Grid */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">Base Matrix ($4096 \times 4096$)</Text>
          <Text variant="h2" color="text">{(baseMatrixParams / 1e6).toFixed(1)}M params</Text>
          <Text variant="caption" color="textTertiary">Frozen baseline weights</Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="label" color="textSecondary">LoRA Adapter ($A + B$)</Text>
          <Text variant="h2" color="accent">{(loraParams / 1e3).toFixed(0)}k params</Text>
          <Text variant="caption" color="success">{paramReduction}% trainable reduction!</Text>
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
  controlBox: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rankRow: { flexDirection: 'row', gap: 6 },
  rankBtn: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  metricsGrid: { flexDirection: 'row', gap: 8 },
  metricCard: { flex: 1, padding: 10, gap: 2 },
});
