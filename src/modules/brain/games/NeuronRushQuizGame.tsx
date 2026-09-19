import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface QuizQ {
  id: number;
  question: string;
  options: { label: string; explanation: string }[];
  correct: number;
}

const BLITZ_QUESTIONS: QuizQ[] = [
  {
    id: 1,
    question: 'Which component computes word vector alignment using Query, Key, and Value matrices?',
    correct: 1,
    options: [
      { label: 'Convolution Filter', explanation: 'Incorrect: Convolutions operate on local spatial grid windows, not long-range sequence attention matrices.' },
      { label: 'Self-Attention', explanation: 'Correct! Self-Attention computes Q × K^T softmax weights to aggregate V vectors across tokens.' },
      { label: 'Gradient Descent', explanation: 'Incorrect: Gradient descent is an optimization algorithm for backpropagation, not a model layer.' },
      { label: 'Max Pooling', explanation: 'Incorrect: Max pooling reduces spatial resolution by selecting maximum feature values.' },
    ],
  },
  {
    id: 2,
    question: 'What happens when an LLM sampling temperature is set to 0.0?',
    correct: 1,
    options: [
      { label: 'Maximum randomness', explanation: 'Incorrect: High temperatures (1.0+) maximize randomness, whereas 0.0 eliminates randomness.' },
      { label: 'Pure greedy (deterministic) output', explanation: 'Correct! Temperature 0.0 selects the argMax highest probability token deterministically every single step.' },
      { label: 'Model crashes', explanation: 'Incorrect: Temperature 0 is a standard decoding hyperparameter supported by all LLM engines.' },
      { label: 'Increases VRAM usage', explanation: 'Incorrect: Sampling temperature alters probability scaling without changing GPU VRAM allocation.' },
    ],
  },
  {
    id: 3,
    question: 'What technique grounds LLM answers with real-time vector database search?',
    correct: 0,
    options: [
      { label: 'RAG (Retrieval-Augmented Generation)', explanation: 'Correct! RAG searches vector embeddings for relevant document chunks to inject into the LLM context before generation.' },
      { label: 'LoRA (Low-Rank Adaptation)', explanation: 'Incorrect: LoRA is a parameter-efficient fine-tuning technique, not a real-time retrieval system.' },
      { label: 'SGD (Stochastic Gradient Descent)', explanation: 'Incorrect: SGD is an optimization algorithm used during model training.' },
      { label: 'Dropout', explanation: 'Incorrect: Dropout is a regularization technique that randomly zeroes activations during training.' },
    ],
  },
  {
    id: 4,
    question: 'Which loss function is specifically designed to penalise probability divergence in classification?',
    correct: 1,
    options: [
      { label: 'MSE (Mean Squared Error)', explanation: 'Incorrect: MSE measures Euclidean distance for continuous regression targets.' },
      { label: 'Cross-Entropy Loss', explanation: 'Correct! Cross-Entropy calculates negative log-likelihood over predicted class probability distributions.' },
      { label: 'Huber Loss', explanation: 'Incorrect: Huber loss combines MSE and MAE for robust regression.' },
      { label: 'L1 Loss', explanation: 'Incorrect: L1 loss measures absolute error differences for sparse regression.' },
    ],
  },
];

export const NeuronRushQuizGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);

  const q = BLITZ_QUESTIONS[currentIdx];

  useEffect(() => {
    if (completed || selectedOpt !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSelect(-1); // Timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIdx, selectedOpt, completed]);

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === q.correct) {
      setScore(s => s + 100 + timeLeft * 10);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < BLITZ_QUESTIONS.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
      setTimeLeft(15);
    } else {
      setCompleted(true);
      addXp(80);
    }
  };

  const resetGame = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setTimeLeft(15);
    setCompleted(false);
  };

  if (completed) {
    return (
      <GlassCard elevation="glow" style={styles.card}>
        <View style={styles.centerCol}>
          <Icon name="hardware-chip" size={48} color={colors.accent} />
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>Neuron Rush Victory!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            Final Blitz Score: {score} pts! Earned +80 XP.
          </Text>
          <Button label="Play Blitz Again ⚡" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  const isAnswered = selectedOpt !== null;
  const isCorrect = selectedOpt === q.correct;

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="flash-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 5: Neuron Rush Quiz Blitz ⚡</Text>
          <Text variant="caption" color="textSecondary">
            Rapid-fire quiz! Answer fast for speed multiplier bonuses. Q{currentIdx + 1}/{BLITZ_QUESTIONS.length}
          </Text>
        </View>
        <View style={[styles.timerBadge, { backgroundColor: timeLeft <= 5 ? colors.warning + '33' : colors.primaryMuted }]}>
          <Icon name="timer-outline" size={16} color={timeLeft <= 5 ? colors.warning : colors.primary} />
          <Text variant="label" color={timeLeft <= 5 ? 'warning' : 'primary'}>{timeLeft}s</Text>
        </View>
      </View>

      {/* Question Card */}
      <View style={[styles.questionBox, { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg }]}>
        <Text variant="h3" color="text" style={{ lineHeight: 24 }}>
          {q.question}
        </Text>
      </View>

      {/* Options */}
      <View style={styles.optsCol}>
        {q.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isRight = idx === q.correct;
          let bgColor = colors.surfaceAlt;
          let textColor = colors.text;

          if (isAnswered) {
            if (isRight) {
              bgColor = colors.success + '33';
              textColor = colors.success;
            } else if (isSelected) {
              bgColor = colors.error + '33';
              textColor = colors.error;
            }
          }

          return (
            <Pressable
              key={opt.label}
              disabled={isAnswered}
              onPress={() => handleSelect(idx)}
              style={[
                styles.optBtn,
                { backgroundColor: bgColor, borderRadius: radius.md, borderColor: isAnswered && (isRight || isSelected) ? textColor : colors.glassBorder },
              ]}
            >
              <Text variant="bodyStrong" style={{ color: textColor }}>
                {String.fromCharCode(65 + idx)}. {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Explicit Explanations */}
      {isAnswered && (
        <View style={[styles.explainCard, { backgroundColor: isCorrect ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <View style={styles.rowCenter}>
            <Icon
              name={isCorrect ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={18}
              color={isCorrect ? colors.success : colors.warning}
            />
            <Text variant="bodyStrong" color={isCorrect ? 'success' : 'warning'}>
              {isCorrect ? '🎯 Correct Answer!' : selectedOpt === -1 ? '⏰ Time Out!' : '❌ Incorrect Choice!'}
            </Text>
          </View>

          {selectedOpt >= 0 && (
            <Text variant="caption" color="text" style={{ marginTop: 4 }}>
              {q.options[selectedOpt].explanation}
            </Text>
          )}

          {!isCorrect && (
            <Text variant="caption" color="success" style={{ marginTop: 6, fontWeight: '600' }}>
              💡 Correct Answer ({String.fromCharCode(65 + q.correct)}): {q.options[q.correct].explanation}
            </Text>
          )}

          <Button label="Next Question ➔" size="sm" onPress={handleNext} style={{ marginTop: 10 }} />
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
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  questionBox: { gap: 6 },
  optsCol: { gap: 8 },
  optBtn: { padding: 12, borderWidth: StyleSheet.hairlineWidth },
  explainCard: { padding: 12 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  centerCol: { alignItems: 'center', padding: 16 },
});
