import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useProgressStore } from '../../../store';

interface GameQuestion {
  id: number;
  targetOutput: string;
  systemPrompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: GameQuestion[] = [
  {
    id: 1,
    targetOutput: '{\n  "sentiment": "positive",\n  "confidence": 0.98\n}',
    systemPrompt: 'System: You are an API backend. Output ONLY valid JSON without markdown.',
    options: ['"Tell me how you feel about this movie!"', '"Respond with JSON format strictly"', '"Write a poem about positivity"', '"Explain sentiment analysis"'],
    correctIndex: 1,
    explanation: 'Strict structural constraints in the system prompt force deterministic JSON output.',
  },
  {
    id: 2,
    targetOutput: 'Step 1: Calculate 15 * 4 = 60.\nStep 2: Add 8 to 60 = 68.\nFinal Answer: 68',
    systemPrompt: 'System: Solve the mathematical word problem.',
    options: ['"Give me just the final number directly."', '"Let\'s think step by step."', '"Do not show any intermediate work."', '"Write in Spanish."'],
    correctIndex: 1,
    explanation: 'The trigger phrase "Let\'s think step by step" enables Chain-of-Thought (CoT) reasoning.',
  },
  {
    id: 3,
    targetOutput: 'The patient presents with acute hypertension. Recommended dosage: 10mg Lisinopril.',
    systemPrompt: 'System: You are a board-certified medical specialist practitioner.',
    options: ['"Explain high blood pressure like I am 5 years old."', '"Adopt a casual gamer tone."', '"Act as a clinical medical expert."', '"Write a fantasy story."'],
    correctIndex: 2,
    explanation: 'Role prompting ("Act as a clinical medical expert") sets vocabulary, domain depth, and persona.',
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
          const isCorrect = idx === q.correctIndex;
          let bgColor = colors.surfaceAlt;
          let textColor = colors.text;

          if (selectedOpt !== null) {
            if (isCorrect) {
              bgColor = colors.success + '33';
              textColor = colors.success;
            } else if (isSelected) {
              bgColor = colors.warning + '33';
              textColor = colors.warning;
            }
          }

          return (
            <Pressable
              key={opt}
              onPress={() => handleSelect(idx)}
              style={[
                styles.optBtn,
                { backgroundColor: bgColor, borderRadius: radius.md, borderColor: colors.glassBorder },
              ]}
            >
              <Text variant="body" style={{ color: textColor, fontWeight: isSelected ? '700' : '400' }}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {selectedOpt !== null && (
        <View style={[styles.explainBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Text variant="caption" color="primary">{q.explanation}</Text>
          <Button label="Next Round ➔" size="sm" onPress={handleNext} style={{ marginTop: 8 }} />
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
  centerCol: { alignItems: 'center', padding: 16 },
});
