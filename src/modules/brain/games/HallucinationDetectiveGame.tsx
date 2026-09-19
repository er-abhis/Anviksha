import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface CaseFile {
  id: number;
  title: string;
  sourceDocument: string;
  claims: { text: string; isHallucination: boolean; reason: string }[];
}

const CASE_FILES: CaseFile[] = [
  {
    id: 1,
    title: 'Case #101: Transformer Architecture Paper',
    sourceDocument: 'The Transformer model introduced multi-head self-attention in 2017. It replaced recurrent neural networks (RNNs) by allowing parallel processing of sequence tokens. The positional encoding vectors use sinusoidal functions of different frequencies to inject word order.',
    claims: [
      { text: 'Introduced multi-head self-attention in 2017.', isHallucination: false, reason: 'Explicitly stated in source text.' },
      { text: 'Uses sinusoidal functions for positional encodings.', isHallucination: false, reason: 'Stated in source text.' },
      { text: 'Invented by OpenAI for ChatGPT in 2020.', isHallucination: true, reason: 'HALLUCINATION DETECTED! The original Transformer paper was published by Google Researchers in 2017.' },
      { text: 'Replaced recurrent neural networks (RNNs).', isHallucination: false, reason: 'Stated in source text.' },
    ],
  },
  {
    id: 2,
    title: 'Case #102: LoRA Fine-Tuning Spec Sheet',
    sourceDocument: 'Low-Rank Adaptation (LoRA) freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture. This reduces the number of trainable parameters by up to 10,000 times and GPU memory requirement by 3 times.',
    claims: [
      { text: 'LoRA freezes pre-trained model weights.', isHallucination: false, reason: 'Stated in source text.' },
      { text: 'Reduces GPU memory requirement by 3x.', isHallucination: false, reason: 'Stated in source text.' },
      { text: 'LoRA completely deletes original weight matrices from disk.', isHallucination: true, reason: 'HALLUCINATION DETECTED! LoRA freezes original weights, it never deletes them.' },
      { text: 'Injects trainable rank decomposition matrices.', isHallucination: false, reason: 'Stated in source text.' },
    ],
  },
  {
    id: 3,
    title: 'Case #103: Vector Database & RAG Benchmark',
    sourceDocument: 'HNSW (Hierarchical Navigable Small World) is a graph-based indexing algorithm used for fast approximate nearest neighbor search in vector embeddings. Distance metrics like Cosine Similarity and Dot Product are commonly computed on 1536-dimensional embedding vectors.',
    claims: [
      { text: 'HNSW is a graph-based vector search algorithm.', isHallucination: false, reason: 'Stated in source text.' },
      { text: 'Cosine Similarity is used for vector distance.', isHallucination: false, reason: 'Stated in source text.' },
      { text: 'HNSW guarantees 100% exact linear scan results on all queries.', isHallucination: true, reason: 'HALLUCINATION DETECTED! HNSW is an APPROXIMATE nearest neighbor search (ANN) algorithm, not an exact scan.' },
      { text: 'Embeddings can have 1536 dimensions.', isHallucination: false, reason: 'Stated in source text.' },
    ],
  },
];

export const HallucinationDetectiveGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedClaim, setSelectedClaim] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);
  const currentCase = CASE_FILES[caseIdx];

  const handleClaimPress = (claimIdx: number) => {
    if (selectedClaim !== null) return;
    setSelectedClaim(claimIdx);
    const chosen = currentCase.claims[claimIdx];
    if (chosen.isHallucination) {
      setScore(s => s + 100);
    }
  };

  const handleNextCase = () => {
    if (caseIdx + 1 < CASE_FILES.length) {
      setCaseIdx(c => c + 1);
      setSelectedClaim(null);
    } else {
      setCompleted(true);
      addXp(90);
    }
  };

  const resetGame = () => {
    setCaseIdx(0);
    setSelectedClaim(null);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>🕵️‍♂️</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>Master Detective!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Successfully caught all LLM hallucinations! Final Score: {score} pts. Earned +90 XP.
          </Text>
          <Button label="Solve More Cases 🔍" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  const isAnswered = selectedClaim !== null;

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="search-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 6: Hallucination Detective 🕵️‍♂️</Text>
          <Text variant="caption" color="textSecondary">
            Read the source document and tap the 1 UNGROUNDED claim (Hallucination)! {caseIdx + 1}/{CASE_FILES.length}
          </Text>
        </View>
      </View>

      {/* Case Header */}
      <Text variant="label" color="primary">{currentCase.title}</Text>

      {/* Source Document Box */}
      <View style={[styles.docBox, { backgroundColor: colors.surface, borderRadius: radius.md, borderColor: colors.glassBorder }]}>
        <View style={styles.docHeader}>
          <Icon name="document-text-outline" size={16} color={colors.textSecondary} />
          <Text variant="caption" color="textSecondary">AUTHENTIC SOURCE DOCUMENT</Text>
        </View>
        <Text variant="body" color="text" style={styles.docText}>
          {currentCase.sourceDocument}
        </Text>
      </View>

      {/* Claims */}
      <Text variant="label" color="text">AI Generated Output Claims (Spot the Fake!):</Text>
      <View style={styles.claimsCol}>
        {currentCase.claims.map((claim, idx) => {
          const isSelected = selectedClaim === idx;
          let bgColor = colors.surfaceAlt;
          let borderCol = colors.glassBorder;

          if (isAnswered) {
            if (claim.isHallucination) {
              bgColor = colors.warning + '33';
              borderCol = colors.warning;
            } else if (isSelected) {
              bgColor = colors.error + '33';
              borderCol = colors.error;
            }
          }

          return (
            <Pressable
              key={claim.text}
              disabled={isAnswered}
              onPress={() => handleClaimPress(idx)}
              style={[styles.claimBtn, { backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius.md }]}
            >
              <Text variant="bodyStrong" color="text" style={{ flex: 1 }}>
                {idx + 1}. "{claim.text}"
              </Text>
              {isAnswered && claim.isHallucination && (
                <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                  <Text variant="caption" color="textInverse">HALLUCINATION</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Explanation Box */}
      {isAnswered && (
        <View style={[styles.explainBox, { backgroundColor: currentCase.claims[selectedClaim].isHallucination ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={currentCase.claims[selectedClaim].isHallucination ? 'success' : 'warning'}>
            {currentCase.claims[selectedClaim].isHallucination ? '🎯 Excellent Detective Work!' : '❌ Incorrect choice!'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {currentCase.claims[selectedClaim].reason}
          </Text>
          <Button label="Next Case ➔" size="sm" onPress={handleNextCase} style={{ marginTop: 8 }} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 12, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  docBox: { padding: 12, borderWidth: StyleSheet.hairlineWidth, gap: 6 },
  docHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  docText: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  claimsCol: { gap: 8 },
  claimBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: StyleSheet.hairlineWidth, gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  explainBox: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});
