import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from 'react-native-reanimated';
import ViewShot from 'react-native-view-shot';
import Icon from 'react-native-vector-icons/Ionicons';
import { AchievementCard, Button, Confetti, DraggableList, GlassCard, ProgressBar, QuestionMedia, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { usePreferencesStore } from '../../../store';
import { shareAchievement } from '../../../utils/appLinks';
import { hapticSuccess, hapticError } from '../../../utils/haptics';
import { ChoiceQuestion, MatchQuestion, OrderQuestion, Question } from '../../../content';

export interface QuizResult {
  correct: number;
  total: number;
  accuracy: number; // 0..1
  passed: boolean;
  xp: number;
  coins: number;
}

export interface CompletionAction {
  label: string;
  onPress: () => void;
}

/**
 * Context-aware "what's next" for a passed lesson quiz. The parent computes it
 * from the real lesson/world structure (never hardcoded) and passes it in.
 * When absent (e.g. daily challenge) Results falls back to Try again + Continue.
 */
export interface CompletionInfo {
  /** Title of the chapter/lesson just completed. */
  title: string;
  /** A short list of what the learner just covered (key takeaways). */
  learned?: string[];
  /** Dominant CTA — the recommended next step (Next chapter / world / explore). */
  primary: CompletionAction;
  /** Softer alternative (view chapters / all worlds / review progress). */
  secondary?: CompletionAction;
  /** Caption for the share sheet. Presence enables the Share button. */
  shareMessage?: string;
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
  /** Shown on a passed result. Absent → generic Continue behaviour. */
  completion?: CompletionInfo;
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
  completion,
}) => {
  const { colors, radius, spacing } = useTheme();
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
        completion={completion}
      />
    );
  }

  const q = questions[idx];
  // Defensive: an empty/exhausted set must never crash the renderer.
  if (!q) {
    return (
      <View style={[styles.fill, styles.emptyCenter]}>
        <Text variant="body" color="textSecondary" center>
          No questions available right now.
        </Text>
        <Button label="Go back" variant="secondary" onPress={onExit} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }
  return (
    <View style={styles.fill}>
      <Animated.View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <View style={styles.progressRow}>
          <Text variant="label" color="textSecondary">{`Question ${idx + 1} of ${total}`}</Text>
          <View style={[styles.typeTag, { backgroundColor: colors.glass, borderColor: colors.glassBorder, borderRadius: radius.pill }]}>
            <Text variant="caption" color="accent">{TYPE_LABEL[q.type]}</Text>
          </View>
        </View>
        <ProgressBar progress={total === 0 ? 0 : idx / total} />
      </Animated.View>
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
      <Animated.View style={{ gap: spacing.lg }}>
        {question.media && <QuestionMedia media={question.media} />}
        <GlassCard elevation="lg">
          <Text variant="h3">{question.prompt}</Text>
        </GlassCard>
      </Animated.View>
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
  const { colors, spacing, radius } = useTheme();
  return (
    <Animated.View>
    <GlassCard
      elevation="md"
      style={{
        marginTop: spacing.md,
        borderRadius: radius.lg,
        borderColor: correct ? colors.success : colors.glassBorder,
      }}
    >
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
    </GlassCard>
    </Animated.View>
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
        const tint = show ? (isRight ? colors.success : colors.error) : colors.glassBorder;
        return (
          <Animated.View key={i}>
            <Pressable
              disabled={answered}
              onPress={() => {
                setPicked(i);
                (i === question.correctIndex ? hapticSuccess : hapticError)();
              }}
              style={[
                styles.option,
                {
                  borderRadius: radius.lg,
                  borderColor: tint,
                  borderWidth: show ? 1.5 : 1,
                  backgroundColor: colors.glass,
                },
                show && { shadowColor: tint, shadowOpacity: 0.5, shadowRadius: 14, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
              ]}
            >
              <Text variant="body" style={styles.flex}>{opt}</Text>
              {show && (
                <Animated.View>
                  <Icon
                    name={isRight ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={isRight ? colors.success : colors.error}
                  />
                </Animated.View>
              )}
            </Pressable>
          </Animated.View>
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
          <Animated.View key={i} style={{ gap: spacing.xs }}>
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
                        borderColor: active ? colors.accent : colors.glassBorder,
                        backgroundColor: active ? colors.primaryMuted : colors.glass,
                      },
                    ]}
                  >
                    <Text variant="caption" color={active ? 'primary' : 'textSecondary'}>{r}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
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
  const { spacing } = useTheme();
  const n = question.items.length;
  const [order, setOrder] = useState<string[]>(question.items.map((_, i) => question.items[(i + 1) % n]));
  const [checked, setChecked] = useState(false);
  const correct = order.every((s, i) => s === question.items[i]);

  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="caption" color="textTertiary">Long-press a card, then drag to reorder.</Text>
      <DraggableList
        items={order}
        disabled={checked}
        onChange={next => {
          setOrder(next);
          setChecked(false);
        }}
        rowStatus={
          checked
            ? (item, i) => (question.items[i] === item ? 'correct' : 'wrong')
            : undefined
        }
      />
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
  completion?: CompletionInfo;
}> = ({ correct, total, accuracy, passed, gated, xp, coins, onExit, onRetry, completion }) => {
  const { colors, spacing } = useTheme();
  const reducedMotion = usePreferencesStore(s => s.reducedMotion);
  const pct = Math.round(accuracy * 100);
  const good = !gated || passed;
  // Context-aware completion only makes sense on a genuine pass.
  const showNext = good && !!completion;

  // Short, meaningful entrance: the score ring springs in as results appear.
  const enter = useSharedValue(reducedMotion ? 1 : 0);
  useEffect(() => {
    if (reducedMotion) return;
    enter.value = withDelay(60, withSpring(1, { damping: 12, stiffness: 140 }));
  }, [enter, reducedMotion]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: withTiming(enter.value, { duration: 220 }),
    transform: [{ scale: 0.85 + enter.value * 0.15 }],
  }));

  // Capture the branded card off-screen and share it as an image (reaches
  // image-first apps too); fall back to text-only if capture fails.
  const shotRef = useRef<React.ComponentRef<typeof ViewShot>>(null);
  const onSharePress = async () => {
    let uri: string | undefined;
    try {
      uri = await shotRef.current?.capture?.();
    } catch {
      uri = undefined;
    }
    await shareAchievement(completion!.shareMessage!, uri);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
      {good && <Confetti />}
      <Animated.View style={styles.resultHead}>
        <Animated.View
          style={[styles.resultRing, { borderColor: good ? colors.success : colors.error }, ringStyle]}
        >
          <Text variant="display" color={good ? 'success' : 'error'}>{`${pct}%`}</Text>
          <Text variant="label" color="textSecondary">accuracy</Text>
        </Animated.View>
        <Text variant="h2" center style={{ marginTop: spacing.md }}>
          {gated ? (passed ? 'Chapter complete!' : 'Almost there') : 'Challenge complete!'}
        </Text>
        {showNext && (
          <Text variant="body" color="textSecondary" center style={{ marginTop: spacing.xs }}>
            {`You completed “${completion!.title}”`}
          </Text>
        )}
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
      </Animated.View>

      <GlassCard elevation="md">
        <Row label="Correct answers" value={`${correct}`} color={colors.success} />
        <Row label="Incorrect answers" value={`${total - correct}`} color={colors.error} />
        <Row label="Accuracy" value={`${pct}%`} />
        <Row label="XP earned" value={good ? `+${xp}` : '0'} color={colors.xp} />
        <Row label="Coins earned" value={good ? `+${coins}` : '0'} color={colors.coins} />
      </GlassCard>

      {showNext && !!completion!.learned?.length && (
        <GlassCard elevation="md">
          <View style={styles.explRow}>
            <Icon name="sparkles" size={18} color={colors.primary} />
            <Text variant="bodyStrong">What you learned</Text>
          </View>
          <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
            {completion!.learned!.map(k => (
              <View key={k} style={styles.itemRow}>
                <Icon name="checkmark" size={15} color={colors.success} style={{ marginTop: 3 }} />
                <Text variant="body" color="textSecondary" style={styles.flex}>{k}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      )}

      {showNext ? (
        <View style={{ gap: spacing.sm }}>
          <Button
            label={completion!.primary.label}
            onPress={completion!.primary.onPress}
            right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
          />
          {completion!.secondary && (
            <Button label={completion!.secondary.label} variant="secondary" onPress={completion!.secondary.onPress} />
          )}
          {!!completion!.shareMessage && (
            <Button
              label="Share achievement"
              variant="ghost"
              onPress={onSharePress}
              left={<Icon name="share-social-outline" size={18} color={colors.primary} />}
            />
          )}
          {onRetry && <Button label="Retake quiz" variant="ghost" onPress={onRetry} />}
        </View>
      ) : (
        <View style={{ gap: spacing.sm }}>
          {onRetry && (!gated || !passed) && (
            <Button label="Try again" variant="secondary" onPress={onRetry} />
          )}
          <Button label={good ? 'Continue' : 'Back'} onPress={onExit} />
        </View>
      )}

      {showNext && !!completion!.shareMessage && (
        <View style={styles.offscreen} pointerEvents="none">
          <ViewShot ref={shotRef} options={{ format: 'png', quality: 1 }}>
            <AchievementCard title={completion!.title} learned={completion!.learned} pct={pct} />
          </ViewShot>
        </View>
      )}
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
  offscreen: { position: 'absolute', left: -9999, top: 0 },
  fill: { flex: 1 },
  flex: { flex: 1 },
  emptyCenter: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  progressRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14, borderWidth: 1 },
  explRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  matchChip: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  resultHead: { alignItems: 'center' },
  resultRing: { width: 140, height: 140, borderRadius: 70, borderWidth: 6, alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
