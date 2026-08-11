import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Header, Screen, Text, XPBadge } from '../../../components';
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
        <Header title="Daily Challenge" onBack={() => navigation.goBack()} />
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

      <Card elevation="md">
        <View style={[styles.head, { marginBottom: spacing.md }]}>
          <View style={[styles.icon, { backgroundColor: colors.primaryMuted }]}>
            <Icon name="sparkles" size={26} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text variant="h2">Today’s Challenge</Text>
            <Text variant="label" color="textSecondary">
              {`${questions.length} questions from your unlocked lessons`}
            </Text>
          </View>
        </View>

        {doneToday ? (
          <View style={[styles.doneBanner, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="checkmark-done-circle" size={20} color={colors.success} />
            <Text variant="body" color="textSecondary" style={styles.flex}>
              Completed today. Come back tomorrow for a fresh set — or practise now (no rewards).
            </Text>
          </View>
        ) : (
          <View style={[styles.rewardRow, { gap: spacing.sm }]}>
            <XPBadge value={daily.xpReward} kind="xp" />
            <XPBadge value={daily.coinReward} kind="coins" />
            <Text variant="caption" color="textTertiary" style={styles.flex}>
              Earn per correct answer
            </Text>
          </View>
        )}
      </Card>

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
