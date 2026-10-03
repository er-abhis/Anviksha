import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard } from '../../../components/GlassCard';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';

interface TokenMeta {
  token: string;
  id: number;
  color: string;
  vector: number[];
  attentionScores: Record<number, number>; // index -> weight %
}

const SAMPLE_SENTENCES = [
  'Anviksha makes learning AI intuitive and fun.',
  'DeepSeek R1 uses reinforcement learning for math reasoning.',
  'Transformers calculate attention across tokens.',
];

const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#06B6D4'];

export const NeuralVisualizerScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();

  const [inputSentence, setInputSentence] = useState('Anviksha makes learning AI intuitive.');
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);

  // Helper tokenizer logic for demonstration
  const tokens: TokenMeta[] = React.useMemo(() => {
    const rawWords = inputSentence.trim().split(/\s+/).filter(Boolean);
    const result: TokenMeta[] = [];
    let idCounter = 1042;

    rawWords.forEach((word, wIdx) => {
      // Split long words into sub-tokens
      let subTokens = [word];
      if (word.length > 7) {
        subTokens = [word.slice(0, 4), word.slice(4)];
      }

      subTokens.forEach((sub, sIdx) => {
        const color = COLORS[(wIdx + sIdx) % COLORS.length];
        const seed = idCounter + (wIdx + 1) * 37;
        const v1 = Number((Math.sin(seed) * 0.9).toFixed(2));
        const v2 = Number((Math.cos(seed) * 0.9).toFixed(2));
        const v3 = Number((Math.sin(seed * 2) * 0.9).toFixed(2));
        const v4 = Number((Math.cos(seed * 2) * 0.9).toFixed(2));

        result.push({
          token: sub,
          id: idCounter,
          color,
          vector: [v1, v2, v3, v4],
          attentionScores: {},
        });
        idCounter += 14;
      });
    });

    // Compute synthetic attention weights
    const total = result.length;
    result.forEach((t, i) => {
      const scores: Record<number, number> = {};
      let sum = 0;
      result.forEach((_, j) => {
        const dist = Math.abs(i - j);
        const weight = Math.max(10, 100 - dist * 25 + ((i * j) % 15));
        scores[j] = weight;
        sum += weight;
      });
      result.forEach((_, j) => {
        scores[j] = Math.round((scores[j] / sum) * 100);
      });
      t.attentionScores = scores;
    });

    return result;
  }, [inputSentence]);

  // Synthetic Next-Token Probability Distribution based on Temperature & TopP
  const tokenPredictions = React.useMemo(() => {
    const baseCandidates = [
      { text: 'models', rawScore: 4.8 },
      { text: 'systems', rawScore: 3.9 },
      { text: 'concepts', rawScore: 3.1 },
      { text: 'algorithms', rawScore: 2.2 },
      { text: 'agents', rawScore: 1.4 },
    ];

    // Apply temperature softmax scaling
    const expScores = baseCandidates.map((c) => Math.exp(c.rawScore / Math.max(0.1, temperature)));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probs = baseCandidates.map((c, idx) => ({
      text: c.text,
      prob: expScores[idx] / sumExp,
    }));

    // Filter by Top-P cumulative threshold
    let cumProb = 0;
    const filtered = probs.filter((item) => {
      if (cumProb >= topP) return false;
      cumProb += item.prob;
      return true;
    });

    return filtered;
  }, [temperature, topP]);

  const activeToken = tokens[selectedTokenIdx] || tokens[0];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderColor: colors.border }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}
          hitSlop={8}
        >
          <Icon name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text variant="h3" style={{ fontSize: 16, fontWeight: '800' }}>
            Neural Tokenizer & Attention Lab
          </Text>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
            See how LLMs parse text into tokens, embeddings & attention
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}>
        {/* Input Text Card */}
        <GlassCard elevation="sm" style={{ padding: 14, borderRadius: radius.lg, gap: 10 }}>
          <Text variant="bodyStrong" style={{ fontWeight: '800', fontSize: 14 }}>
            1. Sentence Tokenizer Input
          </Text>

          <TextInput
            value={inputSentence}
            onChangeText={setInputSentence}
            placeholder="Type anything to tokenize..."
            placeholderTextColor={colors.textTertiary}
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surfaceAlt,
                color: colors.text,
                borderColor: colors.border,
                borderRadius: radius.md,
              },
            ]}
          />

          {/* Sample Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {SAMPLE_SENTENCES.map((sentence, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  setInputSentence(sentence);
                  setSelectedTokenIdx(0);
                }}
                style={[styles.sampleChip, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}
              >
                <Text variant="caption" style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>
                  Sample {idx + 1}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Tokenized Output */}
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            Sub-Word Tokens ({tokens.length}):
          </Text>

          <View style={styles.tokenWrap}>
            {tokens.map((t, idx) => {
              const isSelected = selectedTokenIdx === idx;
              return (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedTokenIdx(idx)}
                  style={[
                    styles.tokenChip,
                    {
                      backgroundColor: t.color + '22',
                      borderColor: isSelected ? t.color : t.color + '66',
                      borderRadius: radius.sm,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <Text variant="bodyStrong" style={{ color: t.color, fontSize: 12, fontWeight: '800' }}>
                    "{t.token}"
                  </Text>
                  <Text variant="caption" style={{ color: colors.textTertiary, fontSize: 9 }}>
                    ID: {t.id}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        {/* Attention Head & Vector Embeddings */}
        {activeToken && (
          <Animated.View entering={FadeInDown.duration(250)}>
            <GlassCard elevation="glow" style={{ padding: 14, borderRadius: radius.lg, gap: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="bodyStrong" style={{ fontWeight: '800', fontSize: 14 }}>
                  2. Attention Heatmap for "{activeToken.token}"
                </Text>
                <View style={[styles.badge, { backgroundColor: activeToken.color + '33' }]}>
                  <Text variant="caption" style={{ color: activeToken.color, fontWeight: '800', fontSize: 10 }}>
                    Vector: [{activeToken.vector.join(', ')}]
                  </Text>
                </View>
              </View>

              <Text variant="caption" color="textSecondary" style={{ fontSize: 11, lineHeight: 16 }}>
                Showing self-attention score weights (Q · Kᵀ / √dₖ) when predicting next context:
              </Text>

              <View style={{ gap: 6, marginTop: 4 }}>
                {tokens.map((t, targetIdx) => {
                  const score = activeToken.attentionScores[targetIdx] || 0;
                  return (
                    <View key={targetIdx} style={styles.attnRow}>
                      <Text
                        variant="caption"
                        style={{
                          width: 80,
                          fontSize: 11,
                          fontWeight: selectedTokenIdx === targetIdx ? '800' : '600',
                          color: t.color,
                        }}
                        numberOfLines={1}
                      >
                        {t.token}
                      </Text>
                      <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                        <View
                          style={[
                            styles.barFill,
                            {
                              width: `${score}%`,
                              backgroundColor: targetIdx === selectedTokenIdx ? activeToken.color : colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text variant="caption" style={{ width: 34, fontSize: 11, fontWeight: '700', textAlign: 'right' }}>
                        {score}%
                      </Text>
                    </View>
                  );
                })}
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* LLM Sampling Playground */}
        <GlassCard elevation="sm" style={{ padding: 14, borderRadius: radius.lg, gap: 12 }}>
          <Text variant="bodyStrong" style={{ fontWeight: '800', fontSize: 14 }}>
            3. LLM Sampling Controls & Next-Token Softmax
          </Text>

          {/* Temperature Controls */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ fontWeight: '700', fontSize: 12 }}>
                Temperature ($T$): {temperature.toFixed(1)}
              </Text>
              <Text variant="caption" color="primary" style={{ fontWeight: '700', fontSize: 11 }}>
                {temperature < 0.3 ? 'Deterministic / Greedy' : temperature > 1.0 ? 'High Entropy / Creative' : 'Balanced'}
              </Text>
            </View>

            <View style={styles.sliderBtnRow}>
              {[0.1, 0.5, 0.7, 1.0, 1.4].map((tVal) => (
                <Pressable
                  key={tVal}
                  onPress={() => setTemperature(tVal)}
                  style={[
                    styles.stepBtn,
                    {
                      backgroundColor: temperature === tVal ? colors.primary : colors.surfaceAlt,
                      borderRadius: radius.sm,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: temperature === tVal ? colors.onPrimary : colors.textSecondary,
                      fontWeight: '700',
                      fontSize: 10,
                    }}
                  >
                    {tVal}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Top-P Controls */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ fontWeight: '700', fontSize: 12 }}>
                Top-P (Nucleus Sampling): {topP.toFixed(1)}
              </Text>
              <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
                Cumulative Prob Cutoff
              </Text>
            </View>

            <View style={styles.sliderBtnRow}>
              {[0.3, 0.5, 0.7, 0.9, 1.0].map((pVal) => (
                <Pressable
                  key={pVal}
                  onPress={() => setTopP(pVal)}
                  style={[
                    styles.stepBtn,
                    {
                      backgroundColor: topP === pVal ? colors.accent : colors.surfaceAlt,
                      borderRadius: radius.sm,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={{
                      color: topP === pVal ? '#000' : colors.textSecondary,
                      fontWeight: '700',
                      fontSize: 10,
                    }}
                  >
                    {pVal}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Probability Output Chart */}
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            Predicted Next Tokens Probability Distribution:
          </Text>

          <View style={{ gap: 6 }}>
            {tokenPredictions.map((pred, idx) => {
              const pct = Math.round(pred.prob * 100);
              return (
                <View key={idx} style={styles.attnRow}>
                  <Text variant="caption" style={{ width: 85, fontSize: 11, fontWeight: '700' }}>
                    "{pred.text}"
                  </Text>
                  <View style={[styles.barTrack, { backgroundColor: colors.surfaceAlt }]}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: colors.primary }] } />
                  </View>
                  <Text variant="caption" style={{ width: 36, fontSize: 11, fontWeight: '700', textAlign: 'right' }}>
                    {pct}%
                  </Text>
                </View>
              );
            })}
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  backBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  headerTitleWrap: { flex: 1 },
  textInput: { height: 44, paddingHorizontal: 12, borderWidth: 1, fontSize: 13 },
  sampleChip: { paddingHorizontal: 10, paddingVertical: 5 },
  tokenWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  tokenChip: { paddingHorizontal: 10, paddingVertical: 6, alignItems: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  attnRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  sliderBtnRow: { flexDirection: 'row', gap: 6 },
  stepBtn: { flex: 1, height: 30, alignItems: 'center', justifyContent: 'center' },
});
