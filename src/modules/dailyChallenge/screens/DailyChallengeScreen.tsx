import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Header, Screen, Text, XPBadge } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore, useProgressStore } from '../../../store';
import {
  buildDailyChallenge,
  questionsByIds,
  todayISO,
} from '../../../content';
import { QuizResult, QuizSession } from '../../learn/components/QuizSession';

export const DailyChallengeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();

  const store = useProgressStore();
  const unlock = useAchievementsStore(s => s.unlock);
  const today = todayISO();

  // Freeze the day's session on mount so it doesn't reshuffle after completion.
  const [daily] = useState(() => buildDailyChallenge(today, store.completed));
  const questions = questionsByIds(daily.questionIds);

  const doneToday = store.dailyCompletedDate === today;
  const [running, setRunning] = useState(false);
  const [practice, setPractice] = useState(false);

  const eligible = !doneToday && !practice;

  const onComplete = (r: QuizResult) => {
    if (!eligible) return;
    const at = Date.now();
    store.completeDailyChallenge(today, r.xp, r.coins);
    unlock('first-challenge', at);
    store.logActivity({
      label: 'Completed the daily challenge',
      detail: `${r.correct}/${r.total} correct · +${r.xp} XP`,
      icon: 'sparkles',
      at,
    });
  };

  if (running) {
    return (
      <Screen padded={false} edges={['top']}>
        <Header title="Daily Challenge" onBack={() => navigation.goBack()} gutter />
        <View style={{ flex: 1 }}>
          <QuizSession
            questions={questions}
            passThreshold={0}
            computeReward={(correct) =>
              eligible
                ? { xp: r(daily, correct, 'xp'), coins: r(daily, correct, 'coins') }
                : { xp: 0, coins: 0 }
            }
            onComplete={onComplete}
            onExit={() => navigation.goBack()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="Daily Challenge" onBack={() => navigation.goBack()} />

      <Animated.View>
        <GlassCard elevation="glow" padded={false} style={{ borderRadius: radius.xl, overflow: 'hidden', borderColor: colors.accentAlt + '55', borderWidth: 1 }}>
          <Gradient colors={gradients.warm} style={StyleSheet.absoluteFill} />
          <View style={{ padding: spacing.xl, gap: spacing.md }}>
            <View style={styles.head}>
              <View style={[styles.icon, { backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: radius.md }]}>
                <Icon name="sparkles" size={26} color="#FFFFFF" />
              </View>
              <View style={styles.flex}>
                <Text variant="h2" color="textInverse">Today’s Challenge</Text>
                <Text variant="label" color="textInverse" style={{ opacity: 0.9 }}>
                  {`${questions.length} questions from your unlocked lessons`}
                </Text>
              </View>
            </View>

            {doneToday ? (
              <View style={[styles.doneBanner, { backgroundColor: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md }]}>
                <Icon name="checkmark-done-circle" size={22} color={colors.success} />
                <Text variant="body" color="textInverse" style={styles.flex}>
                  Completed today! Come back tomorrow for fresh XP & coins — or practise now.
                </Text>
              </View>
            ) : (
              <View style={[styles.rewardRow, { gap: spacing.sm, backgroundColor: 'rgba(0,0,0,0.2)', padding: spacing.sm, borderRadius: radius.md }]}>
                <XPBadge value={daily.xpReward} kind="xp" />
                <XPBadge value={daily.coinReward} kind="coins" />
                <Text variant="caption" color="textInverse" style={[styles.flex, { opacity: 0.9, fontWeight: '600' }]}>
                  Earn rewards per correct answer
                </Text>
              </View>
            )}
          </View>
        </GlassCard>
      </Animated.View>

      <View style={{ gap: spacing.sm }}>
        {!doneToday && (
          <Button
            label="Start challenge"
            onPress={() => setRunning(true)}
            right={<Icon name="arrow-forward" size={18} color={colors.onPrimary} />}
          />
        )}
        {doneToday && (
          <Button
            label="Practise again"
            variant="secondary"
            onPress={() => {
              setPractice(true);
              setRunning(true);
            }}
          />
        )}
        <Text variant="caption" color="textTertiary" center>
          Question types include multiple choice, true/false, matching, ordering and scenarios.
        </Text>
      </View>
    </Screen>
  );
};

// Per-correct reward from the session's max reward (xpReward/coinReward are per-question totals).
const r = (
  daily: { xpReward: number; coinReward: number; questionIds: string[] },
  correct: number,
  kind: 'xp' | 'coins',
): number => {
  const perQ = kind === 'xp'
    ? daily.xpReward / daily.questionIds.length
    : daily.coinReward / daily.questionIds.length;
  return Math.round(perQ * correct);
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  doneBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12 },
  rewardRow: { flexDirection: 'row', alignItems: 'center' },
});
