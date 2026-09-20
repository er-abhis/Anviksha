import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { triggerHaptic } from '../../../utils/haptics';

const TOKENS = ["The", "animal", "didn't", "cross", "street", "because", "it", "was", "tired"];

interface HeadConfig {
  id: number;
  name: string;
  focus: string;
  matrix: number[][]; // 9x9 attention weights
}

// Generate realistic simulated 8-head attention score matrices
const HEADS: HeadConfig[] = [
  {
    id: 1,
    name: "Head 1: Coreference",
    focus: "Links pronouns ('it') back to antecedent nouns ('animal')",
    matrix: [
      [0.6, 0.1, 0.1, 0.0, 0.1, 0.0, 0.0, 0.0, 0.1],
      [0.1, 0.7, 0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.1, 0.6, 0.1, 0.1, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.2, 0.1, 0.5, 0.1, 0.0, 0.0, 0.0, 0.1],
      [0.1, 0.1, 0.0, 0.1, 0.6, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.1, 0.1, 0.0, 0.1, 0.6, 0.0, 0.0, 0.1],
      [0.0, 0.85, 0.0, 0.0, 0.0, 0.05, 0.05, 0.0, 0.05], // "it" -> "animal" (85%)
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.1, 0.1, 0.6, 0.1],
      [0.0, 0.7, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1],
    ],
  },
  {
    id: 2,
    name: "Head 2: Verb Action",
    focus: "Connects subjects ('animal') with action verbs ('cross')",
    matrix: [
      [0.5, 0.2, 0.1, 0.1, 0.1, 0.0, 0.0, 0.0, 0.0],
      [0.1, 0.3, 0.1, 0.45, 0.05, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.7, 0.1, 0.0, 0.0, 0.0, 0.0, 0.1],
      [0.1, 0.4, 0.1, 0.3, 0.1, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.0, 0.5, 0.3, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.0, 0.1, 0.2, 0.1, 0.5, 0.0, 0.0, 0.1],
      [0.0, 0.2, 0.0, 0.1, 0.0, 0.1, 0.5, 0.0, 0.1],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.1],
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.0, 0.2, 0.1, 0.6],
    ],
  },
  {
    id: 3,
    name: "Head 3: Modifier/Adjective",
    focus: "Attends predicate adjectives ('tired') to state verbs ('was')",
    matrix: [
      [0.8, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
      [0.1, 0.7, 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.1, 0.8, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.1, 0.1, 0.7, 0.1, 0.0, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.1, 0.8, 0.0, 0.0, 0.0, 0.1],
      [0.0, 0.0, 0.0, 0.0, 0.1, 0.8, 0.0, 0.0, 0.1],
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.1, 0.7, 0.0, 0.1],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.7, 0.2],
      [0.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.1, 0.6, 0.1], // "tired" -> "was" (60%)
    ],
  },
  {
    id: 4,
    name: "Head 4: Causal Connector",
    focus: "Links reason clause ('because') across boundary",
    matrix: [
      [0.7, 0.1, 0.1, 0.0, 0.0, 0.1, 0.0, 0.0, 0.0],
      [0.1, 0.6, 0.1, 0.1, 0.0, 0.1, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.7, 0.1, 0.0, 0.1, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.1, 0.6, 0.1, 0.1, 0.0, 0.0, 0.0],
      [0.0, 0.0, 0.0, 0.1, 0.7, 0.2, 0.0, 0.0, 0.0],
      [0.1, 0.2, 0.1, 0.2, 0.1, 0.3, 0.0, 0.0, 0.0],
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.7, 0.1, 0.0, 0.1],
      [0.0, 0.0, 0.0, 0.0, 0.0, 0.4, 0.2, 0.3, 0.1],
      [0.0, 0.1, 0.0, 0.0, 0.0, 0.3, 0.1, 0.1, 0.4],
    ],
  },
];

export const MultiHeadAttentionSim: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [activeHeadIdx, setActiveHeadIdx] = useState(0);
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(6); // Default: "it"

  const head = HEADS[activeHeadIdx];
  const scores = head.matrix[selectedTokenIdx];

  const handleHeadSelect = (idx: number) => {
    triggerHaptic('selection');
    setActiveHeadIdx(idx);
  };

  const handleTokenSelect = (idx: number) => {
    triggerHaptic('selection');
    setSelectedTokenIdx(idx);
  };

  return (
    <GlassCard elevation="md" padding={12} style={{ gap: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="grid-outline" size={20} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Multi-Head Self-Attention Lab 🕸️</Text>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
            See how 8 parallel attention heads process token dependencies simultaneously.
          </Text>
        </View>
      </View>

      {/* Head Selector Pills */}
      <View style={{ gap: 4 }}>
        <Text variant="label" color="textSecondary" style={{ fontSize: 10 }}>
          SELECT ATTENTION HEAD (PARALLEL HEADS 1–4):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {HEADS.map((h, idx) => {
            const active = activeHeadIdx === idx;
            return (
              <Pressable
                key={h.id}
                onPress={() => handleHeadSelect(idx)}
                style={[
                  styles.headPill,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderRadius: radius.pill,
                    borderColor: active ? colors.accent : colors.glassBorder,
                    borderWidth: active ? 1.5 : 1,
                  },
                ]}
              >
                <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500', fontSize: 10 }}>
                  {h.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Head Focus Banner */}
      <View style={[styles.focusBanner, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <Icon name="sparkles" size={14} color={colors.primary} />
        <Text variant="caption" color="primary" style={{ flex: 1, fontSize: 11, fontWeight: '600' }}>
          {head.focus}
        </Text>
      </View>

      {/* Token Sentence Selector */}
      <View style={{ gap: 4 }}>
        <Text variant="label" color="textSecondary" style={{ fontSize: 10 }}>
          QUERY TOKEN (TAP TO INSPECT ATTENTION WEIGHTS):
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {TOKENS.map((token, idx) => {
            const selected = selectedTokenIdx === idx;
            const weight = scores[idx];
            return (
              <Pressable
                key={idx}
                onPress={() => handleTokenSelect(idx)}
                style={[
                  styles.tokenBtn,
                  {
                    backgroundColor: selected ? colors.primary : colors.surfaceAlt,
                    borderRadius: radius.md,
                    borderColor: selected ? colors.accent : colors.glassBorder,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <Text variant="bodyStrong" style={{ color: selected ? colors.onPrimary : colors.text, fontSize: 12 }}>
                  {token}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Attention Breakdown for Selected Query Token */}
      <View style={[styles.breakdownBox, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        <Text variant="label" color="accent" style={{ fontSize: 10 }}>
          ATTENTION BEAMS FOR QUERY TOKEN "{TOKENS[selectedTokenIdx]}":
        </Text>
        <View style={{ gap: 4, marginTop: 4 }}>
          {TOKENS.map((keyToken, kIdx) => {
            const pct = Math.round(scores[kIdx] * 100);
            if (pct < 5) return null; // Only display non-negligible attention weights
            return (
              <View key={kIdx} style={styles.beamRow}>
                <Text variant="caption" style={{ width: 65, fontSize: 11, fontWeight: kIdx === selectedTokenIdx ? '700' : '400' }}>
                  ➜ {keyToken}
                </Text>
                <View style={[styles.barTrack, { backgroundColor: colors.surface }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: pct > 50 ? colors.accent : pct > 20 ? colors.primary : colors.textTertiary,
                        borderRadius: radius.pill,
                      },
                    ]}
                  />
                </View>
                <Text variant="caption" color="textSecondary" style={{ width: 35, textAlign: 'right', fontSize: 10, fontWeight: '700' }}>
                  {pct}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headPill: { paddingHorizontal: 10, paddingVertical: 4 },
  focusBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  tokenBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  breakdownBox: { padding: 10 },
  beamRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%' },
});
