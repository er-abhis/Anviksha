import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface MythCard {
  id: number;
  statement: string;
  isMyth: boolean; // True = Myth (False statement), False = Fact (True statement)
  explanation: string;
  badge: string;
}

const MYTHS: MythCard[] = [
  {
    id: 1,
    statement: 'Large Language Models (LLMs) think and understand concepts just like human brains.',
    isMyth: true,
    badge: '🧠 AI Cognition',
    explanation: 'MYTH BUSTED! LLMs are statistical pattern matchers. They predict the most probable next token based on training data, without conscious understanding.',
  },
  {
    id: 2,
    statement: 'Fine-tuning an LLM on new documents is better than RAG for precise factual retrieval.',
    isMyth: true,
    badge: '📚 RAG vs Fine-Tuning',
    explanation: 'MYTH BUSTED! Fine-tuning teaches style/format, but RAG (Retrieval-Augmented Generation) is far superior for factual accuracy and zero hallucination.',
  },
  {
    id: 3,
    statement: 'A model with 99% training accuracy can still fail completely on real-world unseen data.',
    isMyth: false,
    badge: '📊 Overfitting Fact',
    explanation: 'FACT CONFIRMED! This is classic overfitting — the model memorised the training dataset instead of learning generalizable patterns.',
  },
  {
    id: 4,
    statement: 'Quantizing an LLM from FP32 to INT4 cuts VRAM usage by over 75% with minimal quality loss.',
    isMyth: false,
    badge: '⚡ Quantization Fact',
    explanation: 'FACT CONFIRMED! INT4 quantization compresses 32-bit floats into 4-bit integers, drastically saving GPU memory while keeping perplexity low.',
  },
  {
    id: 5,
    statement: 'Adding more parameters to a neural network always guarantees better performance.',
    isMyth: true,
    badge: '📉 Scaling Myth',
    explanation: 'MYTH BUSTED! Without enough quality training data or proper regularisation, bigger models just overfit faster or suffer from scaling bottlenecks.',
  },
];

export const AIMythBustersGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userChoice, setUserChoice] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);

  const card = MYTHS[currentIdx];

  const handleAnswer = (choice: boolean) => {
    if (userChoice !== null) return;
    setUserChoice(choice);
    const correct = choice === card.isMyth;
    if (correct) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < MYTHS.length) {
      setCurrentIdx(c => c + 1);
      setUserChoice(null);
    } else {
      setCompleted(true);
      addXp(75);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setUserChoice(null);
    setScore(0);
    setStreak(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Text style={styles.bigEmoji}>🔥</Text>
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>MythBuster Champion!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Busted {score} / {MYTHS.length} AI myths correctly! Earned +75 XP.
          </Text>
          <Button label="Play Again 🔄" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  const isAnswered = userChoice !== null;
  const isCorrect = userChoice === card.isMyth;

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.warning + '22', borderRadius: radius.md }]}>
          <Icon name="flame-outline" size={24} color={colors.warning} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 4: AI MythBusters 🔥</Text>
          <Text variant="caption" color="textSecondary">
            Is the statement a MYTH or a FACT? Card {currentIdx + 1}/{MYTHS.length}
          </Text>
        </View>
        {streak > 1 && (
          <View style={[styles.streakBadge, { backgroundColor: colors.streak + '22' }]}>
            <Text variant="label" color="streak">🔥 {streak}x Streak!</Text>
          </View>
        )}
      </View>

      {/* Statement Card */}
      <View style={[styles.statementBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg }]}>
        <View style={[styles.badgePill, { backgroundColor: colors.primaryMuted }]}>
          <Text variant="caption" color="primary">{card.badge}</Text>
        </View>
        <Text variant="h3" color="text" style={{ marginTop: 8, lineHeight: 24 }}>
          "{card.statement}"
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <Pressable
          disabled={isAnswered}
          onPress={() => handleAnswer(true)}
          style={[
            styles.actionBtn,
            {
              backgroundColor: isAnswered
                ? card.isMyth
                  ? colors.success
                  : userChoice === true
                  ? colors.warning
                  : colors.surfaceAlt
                : colors.warning,
              borderRadius: radius.md,
              opacity: isAnswered && !card.isMyth && userChoice !== true ? 0.4 : 1,
            },
          ]}
        >
          <Icon name="close-circle-outline" size={20} color={colors.onPrimary} />
          <Text variant="button" color="textInverse">MYTH (FALSE)</Text>
        </Pressable>

        <Pressable
          disabled={isAnswered}
          onPress={() => handleAnswer(false)}
          style={[
            styles.actionBtn,
            {
              backgroundColor: isAnswered
                ? !card.isMyth
                  ? colors.success
                  : userChoice === false
                  ? colors.warning
                  : colors.surfaceAlt
                : colors.success,
              borderRadius: radius.md,
              opacity: isAnswered && card.isMyth && userChoice !== false ? 0.4 : 1,
            },
          ]}
        >
          <Icon name="checkmark-circle-outline" size={20} color={colors.onPrimary} />
          <Text variant="button" color="textInverse">FACT (TRUE)</Text>
        </Pressable>
      </View>

      {/* Explanation banner */}
      {isAnswered && (
        <View style={[styles.explainCard, { backgroundColor: isCorrect ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <Text variant="bodyStrong" color={isCorrect ? 'success' : 'warning'}>
            {isCorrect ? '🎯 Bingo! Correct' : '❌ Oops! Wrong guess'}
          </Text>
          <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
            {card.explanation}
          </Text>
          <Button label="Next Myth ➔" size="sm" onPress={handleNext} style={{ marginTop: 8 }} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { gap: 14, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  streakBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statementBox: { gap: 6 },
  badgePill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  btnRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 14 },
  explainCard: { padding: 12 },
  centerCol: { alignItems: 'center', padding: 16 },
  bigEmoji: { fontSize: 50 },
});
