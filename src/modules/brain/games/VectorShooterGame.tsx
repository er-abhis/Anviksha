import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface VectorDoc {
  name: string;
  coords: [number, number];
  cosSim: number;
  explanation: string;
}

interface VectorTarget {
  id: number;
  query: string;
  queryCoords: [number, number];
  candidates: VectorDoc[];
  correctIdx: number;
}

const TARGETS: VectorTarget[] = [
  {
    id: 1,
    query: 'Query: "artificial intelligence neural networks"',
    queryCoords: [0.8, 0.6],
    correctIdx: 0,
    candidates: [
      {
        name: 'Doc A: "Deep learning transformer models"',
        coords: [0.81, 0.59],
        cosSim: 0.999,
        explanation: 'Correct! Doc A vector aligns almost perfectly in the same directional angle (CosSim = 0.999).',
      },
      {
        name: 'Doc B: "Baking chocolate chip cookies"',
        coords: [-0.7, 0.7],
        cosSim: -0.14,
        explanation: 'Incorrect: Doc B points in an orthogonal/negative direction, representing completely unrelated semantics.',
      },
      {
        name: 'Doc C: "Vintage motorcycle repair guide"',
        coords: [0.1, -0.95],
        cosSim: -0.49,
        explanation: 'Incorrect: Doc C points in the opposite vector direction.',
      },
    ],
  },
  {
    id: 2,
    query: 'Query: "RAG vector database search"',
    queryCoords: [0.5, 0.86],
    correctIdx: 1,
    candidates: [
      {
        name: 'Doc A: "Gardening soil compression tips"',
        coords: [-0.5, 0.86],
        cosSim: 0.49,
        explanation: 'Incorrect: Low cosine similarity score.',
      },
      {
        name: 'Doc B: "HNSW approximate nearest neighbor search"',
        coords: [0.52, 0.85],
        cosSim: 0.998,
        explanation: 'Correct! Doc B matches vector space semantics with 0.998 cosine similarity.',
      },
      {
        name: 'Doc C: "Standard SQL relational database joints"',
        coords: [0.9, -0.43],
        cosSim: 0.08,
        explanation: 'Incorrect: Relational databases do not share embedding space alignment with vector RAG.',
      },
    ],
  },
];

export const VectorShooterGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);
  const target = TARGETS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === target.correctIdx) {
      setScore(s => s + 100);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < TARGETS.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
    } else {
      setCompleted(true);
      addXp(130);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>🎯</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>Vector Alignment Sniper!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Successfully matched all high-dimensional vector embeddings! Final Score: {score} pts. Earned +130 XP.
          </Text>
          <Button label="Shoot Vectors Again 🎯" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  const isAnswered = selectedOpt !== null;
  const isCorrect = selectedOpt === target.correctIdx;

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="navigate-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 10: Vector Space CosSim Target 🎯</Text>
          <Text variant="caption" color="textSecondary">
            Tap the document vector with highest Cosine Similarity to Query! {currentIdx + 1}/{TARGETS.length}
          </Text>
        </View>
      </View>

      {/* Target Query Card */}
      <View style={[styles.queryBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <Text variant="label" color="primary">{target.query}</Text>
        <Text variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
          Query Vector Coordinates: [{target.queryCoords[0]}, {target.queryCoords[1]}]
        </Text>
      </View>

      {/* Candidates */}
      <View style={styles.candidatesCol}>
        <Text variant="label" color="text">Candidate Vector Embeddings:</Text>
        {target.candidates.map((cand, idx) => {
          const isSelected = selectedOpt === idx;
          const isRight = idx === target.correctIdx;
          let bgColor = colors.surfaceAlt;
          let borderCol = colors.glassBorder;

          if (isAnswered) {
            if (isRight) {
              bgColor = colors.success + '33';
              borderCol = colors.success;
            } else if (isSelected) {
              bgColor = colors.error + '33';
              borderCol = colors.error;
            }
          }

          return (
            <Pressable
              key={cand.name}
              disabled={isAnswered}
              onPress={() => handleSelect(idx)}
              style={[
                styles.candBtn,
                { backgroundColor: bgColor, borderColor: borderCol, borderRadius: radius.md },
              ]}
            >
              <View style={styles.flex}>
                <Text variant="bodyStrong" color="text">
                  {cand.name}
                </Text>
                <Text variant="caption" color="textSecondary">
                  CosSim Score: {cand.cosSim > 0 ? `+${cand.cosSim}` : cand.cosSim}
                </Text>
              </View>
              {isAnswered && isRight && (
                <Icon name="checkmark-circle" size={20} color={colors.success} />
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Explanations */}
      {isAnswered && (
        <View style={[styles.explainBox, { backgroundColor: isCorrect ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={isCorrect ? 'success' : 'warning'}>
            {isCorrect ? '🎯 Bullseye! Cosine Similarity Match!' : '❌ Missed Vector Target!'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {target.candidates[selectedOpt].explanation}
          </Text>
          <Button label="Next Vector Challenge ➔" size="sm" onPress={handleNext} style={{ marginTop: 8 }} />
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
  queryBox: { padding: 12 },
  candidatesCol: { gap: 8 },
  candBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: StyleSheet.hairlineWidth },
  explainBox: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});
