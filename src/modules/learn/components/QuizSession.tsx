import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Confetti, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { ChoiceQuestion, MatchQuestion, OrderQuestion, Question } from '../../../content';

export interface QuizResult {
  correct: number;
  total: number;
  accuracy: number; // 0..1
  passed: boolean;
  xp: number;
  coins: number;
}

interface Props {
  questions: Question[];
  /** 0..1. Use 0 for no pass gate (daily challenge). */
  passThreshold?: number;
  computeReward: (correct: number, total: number) => { xp: number; coins: number };
  /** Fired once when the results screen appears. Parent persists rewards. */
  onComplete: (r: QuizResult) => void;
  onExit: () => void;
  onRetry?: () => void;
}

const TYPE_LABEL: Record<Question['type'], string> = {
  'multiple-choice': 'Multiple choice',
  'true-false': 'True or false',
  'identify-prompt': 'Identify the prompt',
  'predict-output': 'Predict the output',
  scenario: 'Scenario',
  match: 'Match the concept',
  order: 'Arrange in order',
};

export const QuizSession: React.FC<Props> = ({
  questions,
  passThreshold = 0,
  computeReward,
  onComplete,
  onExit,
  onRetry,
}) => {
  const { colors, spacing } = useTheme();
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [reported, setReported] = useState(false);

  const total = questions.length;

  const next = (wasCorrect: boolean) => {
    const nextCorrect = correctCount + (wasCorrect ? 1 : 0);
    setCorrectCount(nextCorrect);
    if (idx + 1 >= total) {
      setDone(true);
      const accuracy = total === 0 ? 0 : nextCorrect / total;
      const passed = accuracy >= passThreshold;
      const { xp, coins } = computeReward(nextCorrect, total);
      if (!reported) {
        setReported(true);
        onComplete({ correct: nextCorrect, total, accuracy, passed, xp, coins });
      }
    } else {
      setIdx(idx + 1);
    }
  };

  if (done) {
    const accuracy = total === 0 ? 0 : correctCount / total;
    const passed = accuracy >= passThreshold;
    const { xp, coins } = computeReward(correctCount, total);
    return (
      <Results
        correct={correctCount}
        total={total}
        accuracy={accuracy}
        passed={passed}
        gated={passThreshold > 0}
        xp={xp}
        coins={coins}
        onExit={onExit}
        onRetry={onRetry}
      />
    );
  }

  const q = questions[idx];
  return (
    <View style={styles.fill}>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <View style={styles.progressRow}>
          <Text variant="label" color="textSecondary">{`Question ${idx + 1} of ${total}`}</Text>
          <View style={[styles.typeTag, { backgroundColor: colors.surfaceAlt }]}>
            <Text variant="caption" color="textSecondary">{TYPE_LABEL[q.type]}</Text>
          </View>
        </View>
        <ProgressBar progress={total === 0 ? 0 : idx / total} />
      </View>
      <QuestionView key={q.id} question={q} onNext={next} />
    </View>
  );
};

/* ----------------------------- one question ----------------------------- */
const QuestionView: React.FC<{ question: Question; onNext: (correct: boolean) => void }> = ({
  question,
  onNext,
}) => {
  const { spacing } = useTheme();
  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.giant, gap: spacing.lg }}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="h3">{question.prompt}</Text>
      {question.type === 'match' ? (
        <MatchView question={question} onNext={onNext} />
      ) : question.type === 'order' ? (
        <OrderView question={question} onNext={onNext} />
      ) : (
        <ChoiceView question={question} onNext={onNext} />
      )}
    </ScrollView>
  );
};

const Explanation: React.FC<{ correct: boolean; text: string }> = ({ correct, text }) => {
  const { colors, spacing } = useTheme();
  return (
    <Card elevation="sm" style={{ marginTop: spacing.md }}>
      <View style={styles.explRow}>
        <Icon
          name={correct ? 'checkmark-circle' : 'information-circle'}
          size={20}
          color={correct ? colors.success : colors.primary}
        />
        <Text variant="bodyStrong" color={correct ? 'success' : 'text'}>
          {correct ? 'Correct' : 'Not quite'}
        </Text>
      </View>
      <Text variant="body" color="textSecondary" style={{ marginTop: spacing.xs }}>
        {text}
      </Text>
    </Card>
  );
};

const NextButton: React.FC<{ correct: boolean; onNext: (c: boolean) => void }> = ({ correct, onNext }) => (
  <Button label="Continue" onPress={() => onNext(correct)} style={{ marginTop: 4 }} />
);

/* choice family */
const ChoiceView: React.FC<{ question: ChoiceQuestion; onNext: (c: boolean) => void }> = ({
  question,
  onNext,
}) => {
  const { colors, radius, spacing } = useTheme();
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const correct = picked === question.correctIndex;

  return (
    <View style={{ gap: spacing.sm }}>
      {question.options.map((opt, i) => {
        const isRight = i === question.correctIndex;
        const show = answered && (i === picked || isRight);
        return (
          <Pressable
            key={i}
            disabled={answered}
            onPress={() => setPicked(i)}
            style={[
              styles.option,
              {
                borderRadius: radius.md,
                borderColor: show ? (isRight ? colors.success : colors.error) : colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          >
            <Text variant="body" style={styles.flex}>{opt}</Text>
            {show && (
              <Icon
                name={isRight ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={isRight ? colors.success : colors.error}
              />
            )}
          </Pressable>
        );
      })}
      {answered && <Explanation correct={correct} text={question.explanation} />}
      {answered && <NextButton correct={correct} onNext={onNext} />}
    </View>
  );
};

/* match */
const MatchView: React.FC<{ question: MatchQuestion; onNext: (c: boolean) => void }> = ({
  question,
  onNext,
}) => {
  const { colors, radius, spacing } = useTheme();
  // Right options, rotated so order differs from the left column.
  const rights = question.pairs.map((_, i) => question.pairs[(i + 1) % question.pairs.length].right);
  const [assign, setAssign] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const all = question.pairs.every((_, i) => assign[i] !== undefined);
  const correct = question.pairs.every((p, i) => rights[assign[i]] === p.right);

  return (
    <View style={{ gap: spacing.md }}>
      {question.pairs.map((pair, i) => {
        const isRight = checked && rights[assign[i]] === pair.right;
        return (
          <View key={i} style={{ gap: spacing.xs }}>
            <View style={styles.itemRow}>
              <Text variant="bodyStrong" style={styles.flex}>{pair.left}</Text>
              {checked && (
                <Icon
                  name={isRight ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={isRight ? colors.success : colors.error}
                />
              )}
            </View>
            <View style={styles.chipWrap}>
              {rights.map((r, ri) => {
                const active = assign[i] === ri;
                return (
                  <Pressable
                    key={ri}
                    disabled={checked}
                    onPress={() => setAssign(a => ({ ...a, [i]: ri }))}
                    style={[
                      styles.matchChip,
                      {
                        borderRadius: radius.pill,
                        borderColor: active ? colors.primary : colors.border,
                        backgroundColor: active ? colors.primaryMuted : colors.surface,
                      },
                    ]}
                  >
                    <Text variant="caption" color={active ? 'primary' : 'textSecondary'}>{r}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
      {!checked ? (
        <Button label="Check" disabled={!all} onPress={() => setChecked(true)} />
      ) : (
        <>
          <Explanation correct={correct} text={question.explanation} />
          <NextButton correct={correct} onNext={onNext} />
        </>
      )}
    </View>
  );
};

/* order */
const OrderView: React.FC<{ question: OrderQuestion; onNext: (c: boolean) => void }> = ({
  question,
  onNext,
}) => {
  const { colors, radius, spacing } = useTheme();
  const n = question.items.length;
  const [order, setOrder] = useState<string[]>(question.items.map((_, i) => question.items[(i + 1) % n]));
  const [checked, setChecked] = useState(false);
  const correct = order.every((s, i) => s === question.items[i]);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= n) return;
    const nx = [...order];
    [nx[i], nx[j]] = [nx[j], nx[i]];
    setOrder(nx);
    setChecked(false);
  };

  return (
    <View style={{ gap: spacing.sm }}>
      {order.map((item, i) => (
        <View key={item} style={[styles.orderRow, { borderRadius: radius.md, borderColor: colors.border, backgroundColor: colors.surface }]}>
          <View style={[styles.stepNum, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}>
            <Text variant="label" color="textSecondary">{i + 1}</Text>
          </View>
          <Text variant="body" style={styles.flex}>{item}</Text>
          <Pressable hitSlop={6} disabled={i === 0} onPress={() => move(i, -1)}>
            <Icon name="chevron-up" size={20} color={i === 0 ? colors.textTertiary : colors.text} />
          </Pressable>
          <Pressable hitSlop={6} disabled={i === n - 1} onPress={() => move(i, 1)}>
            <Icon name="chevron-down" size={20} color={i === n - 1 ? colors.textTertiary : colors.text} />
          </Pressable>
        </View>
      ))}
      {!checked ? (
        <Button label="Check order" onPress={() => setChecked(true)} />
      ) : (
        <>
          <Explanation correct={correct} text={question.explanation} />
          <NextButton correct={correct} onNext={onNext} />
        </>
      )}
    </View>
  );
};

/* ------------------------------- results ------------------------------- */
/** A short motivational line, scaled to how well the learner did. */
const praise = (accuracy: number): string => {
  if (accuracy >= 1) return 'Flawless! You’re becoming an AI Explorer 🚀';
  if (accuracy >= 0.9) return 'Excellent! You really get this.';
  if (accuracy >= 0.7) return 'Great work — that’s a solid pass!';
  return 'Nice effort — every round makes it click more.';
};

const Results: React.FC<{
  correct: number;
  total: number;
  accuracy: number;
  passed: boolean;
  gated: boolean;
  xp: number;
  coins: number;
  onExit: () => void;
  onRetry?: () => void;
}> = ({ correct, total, accuracy, passed, gated, xp, coins, onExit, onRetry }) => {
  const { colors, spacing } = useTheme();
  const pct = Math.round(accuracy * 100);
  const good = !gated || passed;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      {good && <Confetti />}
      <View style={styles.resultHead}>
        <View style={[styles.resultRing, { borderColor: good ? colors.success : colors.error }]}>
          <Text variant="display" color={good ? 'success' : 'error'}>{`${pct}%`}</Text>
          <Text variant="label" color="textSecondary">accuracy</Text>
        </View>
        <Text variant="h2" center style={{ marginTop: spacing.md }}>
          {gated ? (passed ? 'Lesson passed!' : 'Almost there') : 'Challenge complete!'}
        </Text>
        {good && (
          <Text variant="body" color="primary" center style={{ marginTop: spacing.xs }}>
            {praise(accuracy)}
          </Text>
        )}
        {gated && !passed && (
          <Text variant="body" color="textSecondary" center>
            You need 70% to pass. Review and try again — you’ve got this.
          </Text>
        )}
      </View>

      <Card elevation="sm">
        <Row label="Correct answers" value={`${correct}`} color={colors.success} />
        <Row label="Incorrect answers" value={`${total - correct}`} color={colors.error} />
        <Row label="Accuracy" value={`${pct}%`} />
        <Row label="XP earned" value={good ? `+${xp}` : '0'} color={colors.xp} />
        <Row label="Coins earned" value={good ? `+${coins}` : '0'} color={colors.coins} />
      </Card>

      {onRetry && (!gated || !passed) && (
        <Button label="Try again" variant="secondary" onPress={onRetry} />
      )}
      <Button label={good ? 'Continue' : 'Back'} onPress={onExit} />
    </ScrollView>
  );
};

const Row: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color }) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.statRow, { paddingVertical: spacing.sm }]}>
      <Text variant="body" color="textSecondary">{label}</Text>
      <Text variant="bodyStrong" style={{ color: color ?? colors.text }}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  flex: { flex: 1 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderWidth: 1 },
  explRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  matchChip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1 },
  stepNum: { width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  resultHead: { alignItems: 'center' },
  resultRing: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
