import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  Card,
  EmptyState,
  Header,
  Screen,
  Text,
  XPBadge,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAchievementsStore, useProgressStore } from '../../../store';
import { DAILY_CHALLENGE, todayISO } from '../../../content/curriculum';

const LETTERS = ['A', 'B', 'C', 'D'];

export const DailyChallengeScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();

  const q = DAILY_CHALLENGE;
  const today = todayISO();
  const completedDate = useProgressStore(s => s.dailyCompletedDate);
  const completeDailyChallenge = useProgressStore(
    s => s.completeDailyChallenge,
  );
  const logActivity = useProgressStore(s => s.logActivity);
  const unlock = useAchievementsStore(s => s.unlock);

  const alreadyDone = completedDate === today;
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;

  const onSelect = (i: number) => {
    if (answered || alreadyDone) return;
    setSelected(i);
    const correct = i === q.correctIndex;
    const at = Date.now();
    completeDailyChallenge(
      today,
      correct ? q.xpReward : 0,
      correct ? q.coinReward : 0,
    );
    unlock('first-challenge', at);
    logActivity({
      label: correct
        ? 'Daily challenge solved'
        : 'Daily challenge attempted',
      detail: correct ? `+${q.xpReward} XP` : 'Better luck tomorrow',
      icon: correct ? 'checkmark-circle' : 'close-circle',
      at,
    });
  };

  if (alreadyDone && !answered) {
    return (
      <Screen>
        <Header
          title="Daily Challenge"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="checkmark-done-circle-outline"
          title="Challenge complete"
          message="You’ve finished today’s challenge. Come back tomorrow for a new one."
          actionLabel="Back to Home"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const correct = selected === q.correctIndex;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="Daily Challenge" onBack={() => navigation.goBack()} />

      <View style={styles.rewardRow}>
        <View style={styles.flex}>
          <Text variant="label" color="textSecondary">
            Today’s question
          </Text>
          <Text variant="h2">{q.question}</Text>
        </View>
        <XPBadge value={q.xpReward} kind="xp" />
      </View>

      <View style={{ gap: spacing.sm }}>
        {q.options.map((opt, i) => {
          const isChosen = selected === i;
          const isRight = i === q.correctIndex;
          let borderColor = colors.border;
          let bg = colors.surface;
          if (answered && isRight) {
            borderColor = colors.success;
            bg = colors.surfaceAlt;
          } else if (answered && isChosen && !isRight) {
            borderColor = colors.error;
            bg = colors.surfaceAlt;
          }
          return (
            <Pressable
              key={i}
              onPress={() => onSelect(i)}
              disabled={answered}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.lg,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor,
                backgroundColor: bg,
                opacity: answered && !isChosen && !isRight ? 0.6 : 1,
              }}
            >
              <View
                style={[
                  styles.letter,
                  { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm },
                ]}
              >
                <Text variant="label" color="textSecondary">
                  {LETTERS[i]}
                </Text>
              </View>
              <Text variant="body" style={styles.flex}>
                {opt}
              </Text>
              {answered && isRight && (
                <Icon name="checkmark-circle" size={20} color={colors.success} />
              )}
              {answered && isChosen && !isRight && (
                <Icon name="close-circle" size={20} color={colors.error} />
              )}
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <Card elevation="md">
          <View style={styles.resultRow}>
            <Icon
              name={correct ? 'trophy' : 'information-circle'}
              size={22}
              color={correct ? colors.success : colors.primary}
            />
            <Text variant="bodyStrong" color={correct ? 'success' : 'text'}>
              {correct
                ? `Correct! +${q.xpReward} XP · +${q.coinReward} coins`
                : 'Not quite — the right answer is highlighted.'}
            </Text>
          </View>
          <Button
            label="Back to Home"
            size="sm"
            onPress={() => navigation.goBack()}
            style={{ marginTop: spacing.lg }}
          />
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  rewardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  letter: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
