import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface Option {
  text: string;
  explanation: string;
}

interface GameQuestion {
  id: number;
  targetOutput: string;
  systemPrompt: string;
  options: Option[];
  correctIndex: number;
}

const QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    targetOutput: '{\n  "sentiment": "positive",\n  "confidence": 0.98\n}',
    systemPrompt: 'System: You are an API backend. Output ONLY valid JSON without markdown.',
    correctIndex: 1,
    options: [
      {
        text: '"Tell me how you feel about this movie!"',
        explanation: 'Incorrect: Open-ended conversational prompts lead to freeform prose text rather than structured JSON.',
      },
      {
        text: '"Respond with JSON format strictly"',
        explanation: 'Correct! Structural instructions like "Respond with JSON format strictly" force the LLM to format token logits into JSON syntax.',
      },
      {
        text: '"Write a poem about positivity"',
        explanation: 'Incorrect: Stanza and rhyme requests trigger creative generation instead of structured keys.',
      },
      {
        text: '"Explain sentiment analysis"',
        explanation: 'Incorrect: Explanatory prompts cause the LLM to write an essay on how sentiment classification works.',
      },
    ],
  },
  {
    id: 2,
    targetOutput: 'Step 1: Calculate 15 * 4 = 60.\nStep 2: Add 8 to 60 = 68.\nFinal Answer: 68',
    systemPrompt: 'System: Solve the mathematical word problem.',
    correctIndex: 1,
    options: [
      {
        text: '"Give me just the final number directly."',
        explanation: 'Incorrect: Suppressing intermediate reasoning increases mathematical hallucination rates on complex arithmetic.',
      },
      {
        text: '"Let\'s think step by step."',
        explanation: 'Correct! The classic "Let\'s think step by step" phrase activates Chain-of-Thought (CoT) reasoning, breaking complex tasks into sequential tokens.',
      },
      {
        text: '"Do not show any intermediate work."',
        explanation: 'Incorrect: Direct answers bypass the multi-step reasoning steps required for math precision.',
      },
      {
        text: '"Write in Spanish."',
        explanation: 'Incorrect: Translation commands change the output language, not the reasoning methodology.',
      },
    ],
  },
  {
    id: 3,
    targetOutput: 'The patient presents with acute hypertension. Recommended dosage: 10mg Lisinopril.',
    systemPrompt: 'System: You are a board-certified medical specialist practitioner.',
    correctIndex: 2,
    options: [
      {
        text: '"Explain high blood pressure like I am 5 years old."',
        explanation: 'Incorrect: Simplified ELI5 prompts produce elementary analogies rather than clinical medical terminology.',
      },
      {
        text: '"Adopt a casual gamer tone."',
        explanation: 'Incorrect: Informal persona prompts inject slang and casual conversational speech.',
      },
      {
        text: '"Act as a clinical medical expert."',
        explanation: 'Correct! Role-based persona prompting establishes domain expertise, academic vocabulary, and professional context.',
      },
      {
        text: '"Write a fantasy story."',
        explanation: 'Incorrect: Fiction prompts alter the domain completely away from medical diagnostics.',
      },
    ],
  },
];

export const PromptMasterGame: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const addXp = useProgressStore(s => s.addXp);
  const q = QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    if (idx === q.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(c => c + 1);
      setSelectedOpt(null);
    } else {
      setCompleted(true);
      addXp(50);
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
          <Icon name="trophy" size={48} color={colors.xp} />
          <Text variant="h2" color="primary" style={{ marginTop: 8 }}>Prompt Master Victory!</Text>
          <Text variant="body" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
            You scored {score} / {QUESTIONS.length} correctly and earned +50 XP!
          </Text>
          <Button label="Play Again 🔄" onPress={resetGame} style={{ marginTop: spacing.lg }} />
        </View>
      </GlassCard>
    );
  }

  const isAnswered = selectedOpt !== null;
  const isCorrect = selectedOpt === q.correctIndex;

  return (
    <GlassCard elevation="md" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.accentMuted, borderRadius: radius.md }]}>
          <Icon name="sparkles" size={24} color={colors.accent} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Game 1: Prompt Master 🎯</Text>
          <Text variant="caption" color="textSecondary">
            Guess the prompt technique that generated the target output. Question {currentIdx + 1}/{QUESTIONS.length}
          </Text>
        </View>
      </View>

      {/* Target Output Screen */}
      <View style={[styles.targetBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <Text variant="label" color="textSecondary">TARGET AI OUTPUT:</Text>
        <Text variant="body" color="text" style={styles.monoText}>{q.targetOutput}</Text>
      </View>

      {/* Options */}
      <View style={styles.optsCol}>
        <Text variant="label" color="textSecondary">WHICH PROMPT PRODUCED THIS RESULT?</Text>
        {q.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isRight = idx === q.correctIndex;
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
              key={opt.text}
              disabled={isAnswered}
              onPress={() => handleSelect(idx)}
              style={[
                styles.optBtn,
                { backgroundColor: bgColor, borderRadius: radius.md, borderColor: isAnswered && (isRight || isSelected) ? textColor : colors.glassBorder },
              ]}
            >
              <Text variant="body" style={{ color: textColor, fontWeight: isSelected || isRight ? '700' : '400' }}>
                {opt.text}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Clear Explanation Box for both correct and incorrect selections */}
      {isAnswered && (
        <View style={[styles.explainBox, { backgroundColor: isCorrect ? colors.success + '22' : colors.warning + '22', borderRadius: radius.md }]}>
          <View style={styles.explainHeader}>
            <Icon
              name={isCorrect ? 'checkmark-circle-outline' : 'close-circle-outline'}
              size={20}
              color={isCorrect ? colors.success : colors.warning}
            />
            <Text variant="bodyStrong" color={isCorrect ? 'success' : 'warning'}>
              {isCorrect ? '🎯 Bingo! That is Correct' : '❌ Incorrect Choice'}
            </Text>
          </View>

          <Text variant="caption" color="text" style={{ marginTop: 4 }}>
            {q.options[selectedOpt].explanation}
          </Text>

          {!isCorrect && (
            <Text variant="caption" color="success" style={{ marginTop: 6, fontWeight: '600' }}>
              💡 Correct Answer: {q.options[q.correctIndex].text} — {q.options[q.correctIndex].explanation}
            </Text>
          )}

          <Button label="Next Round ➔" size="sm" onPress={handleNext} style={{ marginTop: 10 }} />
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
  targetBox: { padding: 12, gap: 4 },
  monoText: { fontFamily: 'PlatformFont', fontSize: 13, lineHeight: 18 },
  optsCol: { gap: 8 },
  optBtn: { padding: 12, borderWidth: StyleSheet.hairlineWidth },
  explainBox: { padding: 12 },
  explainHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  centerCol: { alignItems: 'center', padding: 16 },
});
