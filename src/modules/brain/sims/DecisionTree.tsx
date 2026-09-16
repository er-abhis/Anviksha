import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { GlassCard, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  TREE_CLASSES,
  TREE_DATASET,
  TREE_FEATURES,
  splitResult,
} from '../logic';
import { BrainSlider } from '../components/BrainSlider';

export const DecisionTree: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [feature, setFeature] = useState<0 | 1>(0);
  const [threshold, setThreshold] = useState(5);
  const { predictions, accuracy, leftClass, rightClass } = splitResult(feature, threshold);
  const pct = Math.round(accuracy * 100);
  const good = accuracy >= 0.85;

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Tree diagram */}
      <GlassCard elevation="lg">
        <View style={styles.rootBox}>
          <View style={[styles.node, { backgroundColor: colors.primaryMuted, borderColor: colors.primary, borderRadius: radius.md }]}>
            <Text variant="bodyStrong" color="primary" center>
              {TREE_FEATURES[feature]} ≤ {threshold}?
            </Text>
          </View>
        </View>
        <View style={styles.branches}>
          <Leaf label="Yes →" cls={leftClass} />
          <Leaf label="No →" cls={rightClass} />
        </View>
      </GlassCard>

      {/* Accuracy */}
      <GlassCard elevation="md">
        <View style={styles.accHead}>
          <Text variant="bodyStrong">Accuracy on 8 fruit</Text>
          <Text variant="h2" style={{ color: good ? colors.success : colors.warning }}>{pct}%</Text>
        </View>
        <ProgressBar progress={accuracy} height={10} />
        <View style={styles.dots}>
          {predictions.map((p, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: p.correct ? colors.success : colors.error,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" style={{ color: colors.onPrimary }}>{TREE_DATASET[i].f[feature]}</Text>
            </View>
          ))}
        </View>
        <Text variant="caption" color="textTertiary" style={{ marginTop: spacing.xs }}>
          Each square is one fruit ({TREE_FEATURES[feature].toLowerCase()} value shown). Green = classified correctly.
        </Text>
      </GlassCard>

      {/* Controls */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>SPLIT ON</Text>
        <View style={styles.seg}>
          {TREE_FEATURES.map((f, i) => {
            const active = i === feature;
            return (
              <Pressable
                key={f}
                onPress={() => setFeature(i as 0 | 1)}
                accessibilityRole="button"
                accessibilityLabel={`Split on ${f}`}
                accessibilityState={{ selected: active }}
                style={[
                  styles.segBtn,
                  {
                    borderRadius: radius.pill,
                    backgroundColor: active ? colors.primaryMuted : colors.glass,
                    borderColor: active ? colors.primary : colors.glassBorder,
                  },
                ]}
              >
                <Text variant="bodyStrong" color={active ? 'primary' : 'textSecondary'}>{f}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: spacing.md }}>
          <BrainSlider label="Threshold" value={threshold} min={1} max={9} step={1} onChange={setThreshold} />
        </View>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>What just happened?</Text>
        <Text variant="body" color="textSecondary">
          A decision tree learns questions that split the data cleanly. Try to
          find the split that separates 🍎 from 🍋 best — that’s exactly what the
          training algorithm searches for automatically. Perfect splits aren’t
          always possible when classes overlap.
        </Text>
      </GlassCard>
    </View>
  );
};

const Leaf: React.FC<{ label: string; cls: 0 | 1 }> = ({ label, cls }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={styles.leafCol}>
      <Text variant="caption" color="textTertiary">{label}</Text>
      <View style={[styles.node, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderRadius: radius.md, marginTop: spacing.xs }]}>
        <Text variant="bodyStrong" center>{TREE_CLASSES[cls]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootBox: { alignItems: 'center' },
  node: { paddingVertical: 12, paddingHorizontal: 14, borderWidth: 1.5, minWidth: 120 },
  branches: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16 },
  leafCol: { alignItems: 'center', flex: 1 },
  accHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  dot: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
});
