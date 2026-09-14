import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Confetti, EmptyState, GlassCard, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useBrainStore, useProgressStore } from '../../../store';
import { getCase } from '../data';

const CASE_XP = 30;

/** AI Detective: read the scenario, weigh the clues, name the flaw. Wrong
 *  answers explain *why* and let you investigate again. */
export const DetectiveScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'Detective'>>();
  const theCase = getCase(route.params.caseId);

  const recordCase = useBrainStore(s => s.recordCase);
  const alreadySolved = useBrainStore(s => Boolean(theCase && s.cases[theCase.id]?.solved));
  const progress = useProgressStore();

  const [picked, setPicked] = useState<number | null>(null);
  const [awarded, setAwarded] = useState(false);

  if (!theCase) {
    return (
      <Screen>
        <Header title="AI Detective" onBack={() => navigation.goBack()} />
        <EmptyState icon="search-outline" title="Case not found" message="Pick another case." actionLabel="Back" onAction={() => navigation.goBack()} />
      </Screen>
    );
  }

  const answered = picked !== null;
  const correct = picked === theCase.answerIndex;

  const choose = (i: number) => {
    if (answered) return;
    setPicked(i);
    const at = Date.now();
    const isRight = i === theCase.answerIndex;
    recordCase(theCase.id, theCase.concept, isRight, at);
    if (isRight && !alreadySolved && !awarded) {
      setAwarded(true);
      progress.addXp(CASE_XP);
      progress.markCompleted(`case:${theCase.id}`, 100);
      progress.logActivity({
        label: `Solved: ${theCase.title}`,
        detail: `+${CASE_XP} XP · ${theCase.concept}`,
        icon: 'search',
        at,
      });
    }
  };

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      {answered && correct && <Confetti />}
      <Header title="AI Detective 🕵️" subtitle={theCase.concept} onBack={() => navigation.goBack()} />

      <GlassCard elevation="lg">
        <Text variant="display" center>{theCase.emoji}</Text>
        <Text variant="h2" center style={{ marginTop: spacing.xs }}>{theCase.title}</Text>
        <Text variant="body" color="textSecondary" style={{ marginTop: spacing.sm }}>{theCase.scenario}</Text>
      </GlassCard>

      <View>
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>🔍 CLUES</Text>
        <GlassCard elevation="md">
          <View style={{ gap: spacing.sm }}>
            {theCase.clues.map((c, i) => (
              <View key={i} style={styles.clueRow}>
                <Icon name="ellipse" size={7} color={colors.accent} style={{ marginTop: 7 }} />
                <Text variant="body" color="textSecondary" style={styles.flex}>{c}</Text>
              </View>
            ))}
          </View>
        </GlassCard>
      </View>

      <View>
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>WHAT’S THE FLAW?</Text>
        <View style={{ gap: spacing.sm }}>
          {theCase.options.map((opt, i) => {
            const isRight = i === theCase.answerIndex;
            const show = answered && (i === picked || isRight);
            const tint = show ? (isRight ? colors.success : colors.error) : colors.glassBorder;
            return (
              <Pressable
                key={i}
                disabled={answered}
                onPress={() => choose(i)}
                style={[
                  styles.option,
                  {
                    borderRadius: radius.lg,
                    borderColor: tint,
                    borderWidth: show ? 1.5 : 1,
                    backgroundColor: colors.glass,
                    opacity: answered && !show ? 0.5 : 1,
                  },
                ]}
              >
                <Text variant="body" style={styles.flex}>{opt}</Text>
                {show && (
                  <Icon name={isRight ? 'checkmark-circle' : 'close-circle'} size={20} color={isRight ? colors.success : colors.error} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {answered && (
        <GlassCard elevation="md" style={{ borderColor: (correct ? colors.success : colors.primary) + '66' }}>
          <View style={styles.whyHead}>
            <Icon name={correct ? 'checkmark-circle' : 'help-circle'} size={20} color={correct ? colors.success : colors.primary} />
            <Text variant="bodyStrong" color={correct ? 'success' : 'primary'}>
              {correct ? 'Case solved!' : 'Why?'}
            </Text>
          </View>
          <Text variant="body" color="textSecondary" style={{ marginTop: spacing.xs }}>{theCase.why}</Text>
        </GlassCard>
      )}

      {answered && (
        <View style={{ gap: spacing.sm }}>
          {!correct && (
            <Button label="Investigate again" variant="secondary" onPress={() => setPicked(null)} />
          )}
          <Button label="Back to cases" onPress={() => navigation.goBack()} />
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  clueRow: { flexDirection: 'row', gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
  whyHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
