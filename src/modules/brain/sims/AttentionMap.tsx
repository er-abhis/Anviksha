import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { ATTENTION_PRESETS, AttentionSentence } from '../logic';
import { LabCanvas } from '../components/LabCanvas';

const W = 320;
const H = 200;

export const AttentionMap: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [preset, setPreset] = useState<AttentionSentence>(ATTENTION_PRESETS[0]);
  const [selectedIdx, setSelectedIdx] = useState<number>(7); // "it" token by default

  const tokens = preset.tokens;
  const weights = preset.weights[selectedIdx] ?? [];

  // Calculate token position coordinates along top and bottom rows for SVG connection beams
  const tokenCoords = tokens.map((_, i) => {
    const x = 20 + (i / (tokens.length - 1 || 1)) * (W - 40);
    return { topX: x, botX: x };
  });

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={220}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Attention weight beams */}
          {tokens.map((_, i) => {
            const w = weights[i] ?? 0;
            if (w < 0.05 && i !== selectedIdx) return null;
            const fromX = tokenCoords[selectedIdx]?.topX ?? 0;
            const toX = tokenCoords[i]?.botX ?? 0;
            return (
              <Line
                key={i}
                x1={fromX}
                y1={30}
                x2={toX}
                y2={H - 30}
                stroke={i === selectedIdx ? colors.primary : colors.accent}
                strokeWidth={1 + w * 5}
                strokeOpacity={i === selectedIdx ? 0.9 : 0.2 + w * 0.8}
              />
            );
          })}
        </Svg>
      </LabCanvas>

      {/* Preset sentence selector */}
      <View style={styles.seg}>
        {ATTENTION_PRESETS.map(p => {
          const active = p.id === preset.id;
          return (
            <Pressable
              key={p.id}
              onPress={() => {
                setPreset(p);
                setSelectedIdx(p.id === 'pronoun' ? 7 : 5);
              }}
              style={[
                styles.segBtn,
                {
                  borderRadius: radius.pill,
                  backgroundColor: active ? colors.primaryMuted : colors.glass,
                  borderColor: active ? colors.primary : colors.glassBorder,
                },
              ]}
            >
              <Text variant="caption" color={active ? 'primary' : 'textSecondary'}>
                {p.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Token interactive ribbon */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          TAP A TOKEN TO SEE ITS ATTENTION FOCUS
        </Text>
        <View style={styles.tokensRow}>
          {tokens.map((t, idx) => {
            const isSel = idx === selectedIdx;
            const w = weights[idx] ?? 0;
            return (
              <Pressable
                key={idx}
                onPress={() => setSelectedIdx(idx)}
                style={[
                  styles.tokenChip,
                  {
                    backgroundColor: isSel
                      ? colors.primary
                      : w > 0.4
                      ? colors.accent + '44'
                      : colors.glass,
                    borderColor: isSel
                      ? colors.primary
                      : w > 0.4
                      ? colors.accent
                      : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text
                  variant="bodyStrong"
                  style={{ color: isSel ? colors.onPrimary : w > 0.4 ? colors.accent : colors.text }}
                >
                  {t}
                </Text>
                {w > 0.1 && !isSel && (
                  <Text variant="caption" color="accent" style={{ fontSize: 9 }}>
                    {Math.round(w * 100)}%
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {/* Detail card */}
      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          Focusing on "{tokens[selectedIdx]}"
        </Text>
        <Text variant="body" color="textSecondary">
          The self-attention layer calculates Query × Key dot products to decide which other tokens
          in the sequence provide essential context. Here, "{tokens[selectedIdx]}" assigns its highest
          attention weight ({Math.round((weights.reduce((max, val, i) => (i !== selectedIdx && val > max ? val : max), 0)) * 100)}%)
          to related context words!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
  tokensRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tokenChip: { paddingHorizontal: 10, paddingVertical: 8, borderWidth: 1, alignItems: 'center' },
});
