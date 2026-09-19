import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { calcDecodingCandidates } from '../logic';

export const TokenGeneration: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [strategy, setStrategy] = useState<'greedy' | 'top_k' | 'nucleus'>('nucleus');
  const [temp, setTemp] = useState(0.7);

  const candidates = calcDecodingCandidates(strategy, temp);

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="git-commit-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Decoding Strategies</Text>
          <Text variant="caption" color="textSecondary">
            Compare how Greedy (argMax), Top-K, and Nucleus (Top-P) select candidate tokens step-by-step.
          </Text>
        </View>
      </View>

      {/* Strategy Selector */}
      <View style={[styles.btnRow, { gap: spacing.xs }]}>
        {(['greedy', 'top_k', 'nucleus'] as const).map(s => {
          const active = strategy === s;
          return (
            <Pressable
              key={s}
              onPress={() => setStrategy(s)}
              style={[
                styles.stratBtn,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500' }}>
                {s === 'greedy' ? 'Greedy (Top-1)' : s === 'top_k' ? 'Top-K (K=2)' : 'Nucleus (Top-P)'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Temperature Control */}
      <View style={[styles.ctrlBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md }]}>
        <View style={styles.rowBetween}>
          <Text variant="label">Temperature Scaling: {temp.toFixed(1)}</Text>
        </View>
        <View style={styles.valRow}>
          {[0.1, 0.7, 1.2, 2.0].map(t => (
            <Pressable
              key={t}
              onPress={() => setTemp(t)}
              style={[
                styles.tempBtn,
                {
                  backgroundColor: temp === t ? colors.accent + '33' : colors.surfaceAlt,
                  borderColor: temp === t ? colors.accent : colors.glassBorder,
                  borderRadius: radius.sm,
                },
              ]}
            >
              <Text variant="caption" color={temp === t ? 'accent' : 'text'}>
                T={t.toFixed(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Candidate List */}
      <View style={styles.candidateContainer}>
        <Text variant="label" color="textSecondary">FILTERED CANDIDATE TOKENS ({candidates.length}):</Text>
        {candidates.map((item, idx) => (
          <View key={item.token} style={[styles.candRow, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
            <Text variant="label" color="primary">#{idx + 1}</Text>
            <Text variant="bodyStrong" style={styles.flex}>"{item.token}"</Text>
            <View style={[styles.probBadge, { backgroundColor: colors.primaryMuted }]}>
              <Text variant="caption" color="primary">{(item.prob * 100).toFixed(1)}%</Text>
            </View>
          </View>
        ))}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap' },
  stratBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  ctrlBox: { gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
  valRow: { flexDirection: 'row', gap: 6 },
  tempBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderWidth: StyleSheet.hairlineWidth },
  candidateContainer: { gap: 8 },
  candRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10 },
  probBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
});
