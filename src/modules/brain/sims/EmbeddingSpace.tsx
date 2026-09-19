import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import { GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { EMBEDDING_WORDS, EmbeddingWord, cosineSimilarity, solveAnalogy } from '../logic';
import { LabCanvas } from '../components/LabCanvas';

const W = 320;
const H = 220;
const PAD = 30;

export const EmbeddingSpace: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [selected1, setSelected1] = useState<EmbeddingWord>(EMBEDDING_WORDS[0]); // King
  const [selected2, setSelected2] = useState<EmbeddingWord>(EMBEDDING_WORDS[1]); // Queen
  const [mode, setMode] = useState<'similarity' | 'analogy'>('similarity');

  const similarity = cosineSimilarity(selected1, selected2);
  const analogy = solveAnalogy('king', 'man', 'woman');

  const px = (x: number) => PAD + (x / 10) * (W - PAD * 2);
  const py = (y: number) => H - PAD - (y / 10) * (H - PAD * 2);

  return (
    <View style={{ gap: spacing.lg }}>
      <LabCanvas height={240}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
          {/* Grid lines */}
          {[2, 4, 6, 8].map(g => (
            <React.Fragment key={g}>
              <Line x1={px(g)} y1={PAD} x2={px(g)} y2={H - PAD} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
              <Line x1={PAD} y1={py(g)} x2={W - PAD} y2={py(g)} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
            </React.Fragment>
          ))}

          {/* Similarity line */}
          {mode === 'similarity' && (
            <Line
              x1={px(selected1.x)}
              y1={py(selected1.y)}
              x2={px(selected2.x)}
              y2={py(selected2.y)}
              stroke={colors.accent}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {/* Analogy vectors */}
          {mode === 'analogy' && (
            <>
              <Line
                x1={px(3.5)}
                y1={py(8.5)}
                x2={px(8.0)}
                y2={py(8.5)}
                stroke={colors.primary}
                strokeWidth={2}
              />
              <Line
                x1={px(3.7)}
                y1={py(4.5)}
                x2={px(8.2)}
                y2={py(4.5)}
                stroke={colors.success}
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            </>
          )}

          {/* Points */}
          {EMBEDDING_WORDS.map(w => {
            const isSel1 = selected1.id === w.id;
            const isSel2 = selected2.id === w.id;
            const active = isSel1 || isSel2;
            return (
              <React.Fragment key={w.id}>
                <Circle
                  cx={px(w.x)}
                  cy={py(w.y)}
                  r={active ? 10 : 6}
                  fill={active ? colors.accent : colors.primary}
                  opacity={active ? 1 : 0.7}
                />
                <SvgText
                  x={px(w.x)}
                  y={py(w.y) - 12}
                  fontSize={10}
                  fontWeight={active ? '700' : '500'}
                  fill={active ? colors.accent : '#FFFFFF'}
                  textAnchor="middle"
                >
                  {w.word}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
      </LabCanvas>

      {/* Segment switcher */}
      <View style={styles.seg}>
        <Pressable
          onPress={() => setMode('similarity')}
          style={[
            styles.segBtn,
            {
              borderRadius: radius.pill,
              backgroundColor: mode === 'similarity' ? colors.primaryMuted : colors.glass,
              borderColor: mode === 'similarity' ? colors.primary : colors.glassBorder,
            },
          ]}
        >
          <Text variant="bodyStrong" color={mode === 'similarity' ? 'primary' : 'textSecondary'}>
            Cosine Similarity
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('analogy')}
          style={[
            styles.segBtn,
            {
              borderRadius: radius.pill,
              backgroundColor: mode === 'analogy' ? colors.primaryMuted : colors.glass,
              borderColor: mode === 'analogy' ? colors.primary : colors.glassBorder,
            },
          ]}
        >
          <Text variant="bodyStrong" color={mode === 'analogy' ? 'primary' : 'textSecondary'}>
            Vector Analogy
          </Text>
        </Pressable>
      </View>

      {mode === 'similarity' ? (
        <GlassCard elevation="md">
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
            COMPARE WORD PAIRS
          </Text>
          <View style={styles.wordList}>
            {EMBEDDING_WORDS.map(w => (
              <Pressable
                key={w.id}
                onPress={() => {
                  if (selected1.id === w.id) return;
                  setSelected2(w);
                }}
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      selected1.id === w.id
                        ? colors.primaryMuted
                        : selected2.id === w.id
                        ? colors.accent + '33'
                        : colors.glass,
                    borderColor:
                      selected1.id === w.id
                        ? colors.primary
                        : selected2.id === w.id
                        ? colors.accent
                        : colors.border,
                    borderRadius: radius.sm,
                  },
                ]}
              >
                <Text variant="caption">{w.word}</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.simResult, { marginTop: spacing.md }]}>
            <Text variant="bodyStrong">
              Similarity ({selected1.word} ↔ {selected2.word}):
            </Text>
            <Text variant="display" color="accent">
              {(similarity * 100).toFixed(0)}%
            </Text>
          </View>
        </GlassCard>
      ) : (
        <GlassCard elevation="md">
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
            VECTOR ALGEBRA ANALOGY
          </Text>
          <Text variant="h3" color="primary" style={{ marginVertical: spacing.xs }}>
            King 👑 - Man 👨 + Woman 👩 = ?
          </Text>
          <View style={[styles.simResult, { backgroundColor: colors.success + '22', borderRadius: radius.md, padding: 12 }]}>
            <Text variant="bodyStrong" color="success">
              Calculated Best Match: {analogy.bestMatch.word}
            </Text>
            <Text variant="caption" color="textSecondary">
              Distance error: {analogy.distance} units
            </Text>
          </View>
        </GlassCard>
      )}

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Word embeddings convert text concepts into multi-dimensional coordinates (vectors).
          Semantically related words end up close together in space. That’s why vector arithmetic
          like “King - Man + Woman = Queen” actually works in AI models!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
  wordList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  simResult: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
